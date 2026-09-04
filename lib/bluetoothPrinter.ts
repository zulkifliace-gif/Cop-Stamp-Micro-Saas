/**
 * Web Bluetooth ESC/POS Receipt Printer Service for LajuS
 * Connects directly to thermal receipt printers via Web Bluetooth API.
 * Generates crisp QR codes and concise English stamp receipts.
 */
import QRCode from 'qrcode'

// Standard GATT service UUIDs used by Bluetooth thermal receipt printers
const PRINTER_SERVICES = [
  '000018f0-0000-1000-8000-00805f9b34fb', // Standard Printer Service
  '0000e0ff-0000-1000-8000-00805f9b34fb', // Common Portable Thermal Printers (Goojprt, MPT-II, etc.)
  '49535343-fe7d-41a3-8c56-79b64cc86123', // ISSC Transparent Service
  '00001101-0000-1000-8000-00805f9b34fb', // SPP Serial Port Profile
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Pos-58 series
]

// ESC/POS Command Sequences
const ESC_POS = {
  INIT: new Uint8Array([0x1b, 0x40]), // Reset printer
  ALIGN_LEFT: new Uint8Array([0x1b, 0x61, 0x00]),
  ALIGN_CENTER: new Uint8Array([0x1b, 0x61, 0x01]),
  ALIGN_RIGHT: new Uint8Array([0x1b, 0x61, 0x02]),
  BOLD_ON: new Uint8Array([0x1b, 0x45, 0x01]),
  BOLD_OFF: new Uint8Array([0x1b, 0x45, 0x00]),
  DOUBLE_HEIGHT: new Uint8Array([0x1d, 0x21, 0x01]),
  DOUBLE_SIZE: new Uint8Array([0x1d, 0x21, 0x11]),
  NORMAL_TEXT: new Uint8Array([0x1d, 0x21, 0x00]),
  FEED_LINE: new Uint8Array([0x0a]),
  FEED_LINES_3: new Uint8Array([0x1b, 0x64, 0x03]),
  CUT_PAPER: new Uint8Array([0x1d, 0x56, 0x41, 0x00]),
}

export interface BluetoothPrinterConnection {
  device: any
  server: any
  characteristic: any
  name: string
  isNative?: boolean
}

export interface StampReceiptData {
  storeName: string
  stampCount: number
  tokenCode: string
  claimUrl: string
  expiresInMinutes?: number
}

export interface ClaimReceiptData {
  storeName: string
  customerEmail: string
  stampsUsed: number
  remainingStamps: number
  rewardName: string
  rewardQuantity?: number
  redeemedAt?: string | Date
}

/**
 * Convert text to clean ASCII bytes for thermal printer
 */
function textToBytes(text: string): Uint8Array {
  const clean = text.replace(/[^\x00-\x7F]/g, '') // strip non-ASCII
  return new TextEncoder().encode(clean)
}

/**
 * Convert QR Code Canvas to ESC/POS GS v 0 Raster Bitmap
 * Raster format ensures 100% compatibility across all 58mm / 80mm Bluetooth printers.
 */
async function generateQrRaster(text: string, widthPx = 256): Promise<Uint8Array | null> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: widthPx,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        const widthBytes = Math.floor(widthPx / 8)
        const width = widthBytes * 8
        const height = Math.round((img.height / img.width) * width)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(null)

        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        const imgData = ctx.getImageData(0, 0, width, height)
        const data = imgData.data

        // GS v 0 m xL xH yL yH
        const xL = widthBytes % 256
        const xH = Math.floor(widthBytes / 256)
        const yL = height % 256
        const yH = Math.floor(height / 256)

        const header = new Uint8Array([0x1d, 0x76, 0x30, 0x00, xL, xH, yL, yH])
        const rasterData = new Uint8Array(widthBytes * height)

        let byteIdx = 0
        for (let y = 0; y < height; y++) {
          for (let xByte = 0; xByte < widthBytes; xByte++) {
            let byteVal = 0
            for (let bit = 0; bit < 8; bit++) {
              const pxX = xByte * 8 + bit
              const pxIdx = (y * width + pxX) * 4
              const r = data[pxIdx]
              const g = data[pxIdx + 1]
              const b = data[pxIdx + 2]
              const luminance = 0.299 * r + 0.587 * g + 0.114 * b
              if (luminance < 128) {
                byteVal |= 1 << (7 - bit)
              }
            }
            rasterData[byteIdx++] = byteVal
          }
        }

        const fullRaster = new Uint8Array(header.length + rasterData.length)
        fullRaster.set(header, 0)
        fullRaster.set(rasterData, header.length)
        resolve(fullRaster)
      }
      img.onerror = () => resolve(null)
      img.src = dataUrl
    })
  } catch (e) {
    console.error('QR raster error:', e)
    return null
  }
}

/**
 * Check if Web Bluetooth API is supported
 */
/**
 * Check if Web Bluetooth API or Android Native Bluetooth is supported
 */
export function isBluetoothSupported(): boolean {
  if (typeof window !== 'undefined' && (window as any).AndroidBluetooth) {
    return true
  }
  return typeof navigator !== 'undefined' && Boolean((navigator as any).bluetooth)
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

async function sendToNativePrinter(data: Uint8Array): Promise<void> {
  const nativeBridge = typeof window !== 'undefined' ? (window as any).AndroidBluetooth : null
  if (!nativeBridge) throw new Error('Native Bluetooth bridge tidak dijumpai.')
  const base64 = uint8ArrayToBase64(data)
  const success = nativeBridge.printBase64(base64)
  if (!success) {
    throw new Error('Gagal mencetak ke printer Bluetooth. Sila semak sambungan printer.')
  }
}

/**
 * Connect to Bluetooth Thermal Printer (Native Android Bridge or Web Bluetooth)
 */
export async function connectBluetoothPrinter(): Promise<BluetoothPrinterConnection> {
  // 1. Android Native Bluetooth Bridge (Inside Android APK)
  const nativeBridge = typeof window !== 'undefined' ? (window as any).AndroidBluetooth : null
  if (nativeBridge && typeof nativeBridge.isNativeSupported === 'function') {
    if (!nativeBridge.isBluetoothEnabled()) {
      throw new Error('Sila hidupkan Bluetooth telefon anda terlebih dahulu.')
    }
    if (!nativeBridge.hasPermission()) {
      nativeBridge.requestPermission()
      throw new Error('Sila berikan kebenaran Bluetooth pada telefon anda dan cuba semula.')
    }

    const pairedJson = nativeBridge.getPairedDevices()
    let pairedDevices: Array<{ name: string; address: string }> = []
    try {
      pairedDevices = JSON.parse(pairedJson)
    } catch {
      pairedDevices = []
    }

    if (!pairedDevices || pairedDevices.length === 0) {
      throw new Error('Tiada printer Bluetooth dijumpai. Sila "Pair" printer anda dalam Tetapan Bluetooth Android terlebih dahulu.')
    }

    // Auto-detect printer with typical thermal printer names, or use the first paired device
    const target =
      pairedDevices.find((d) =>
        /printer|pos|mpt|rpp|gooj|58|80|thermal|bt/i.test(d.name)
      ) || pairedDevices[0]

    const connected = nativeBridge.connect(target.address)
    if (!connected) {
      throw new Error(`Gagal menyambung ke "${target.name}". Pastikan printer dihidupkan dan berdekatan.`)
    }

    return {
      device: target,
      server: null,
      characteristic: null,
      name: target.name || 'Bluetooth Printer',
      isNative: true,
    }
  }

  // 2. Web Bluetooth (Google Chrome / Edge)
  const nav = navigator as any
  if (!nav.bluetooth) {
    throw new Error('Web Bluetooth tidak disokong pada pelayar ini. Sila gunakan Google Chrome atau Microsoft Edge.')
  }

  const device = await nav.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: PRINTER_SERVICES,
  })

  if (!device.gatt) {
    throw new Error('Peranti Bluetooth tiada sokongan GATT.')
  }

  const server = await device.gatt.connect()

  let targetCharacteristic: any = null
  const services = await server.getPrimaryServices()

  for (const service of services) {
    try {
      const characteristics = await service.getCharacteristics()
      for (const char of characteristics) {
        if (char.properties.write || char.properties.writeWithoutResponse) {
          targetCharacteristic = char
          break
        }
      }
    } catch {
      // Continue to next service
    }
    if (targetCharacteristic) break
  }

  if (!targetCharacteristic) {
    throw new Error('Tiada saluran cetakan (writable characteristic) dijumpai pada peranti printer ini.')
  }

  return {
    device,
    server,
    characteristic: targetCharacteristic,
    name: device.name || 'Bluetooth Printer',
    isNative: false,
  }
}

/**
 * Send chunked data to Bluetooth printer characteristic to avoid buffer overflow
 */
async function sendToCharacteristic(
  characteristic: any,
  data: Uint8Array
): Promise<void> {
  const CHUNK_SIZE = 100 // Safe packet size for BLE thermal printers
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE)
    if (characteristic.properties.writeWithoutResponse) {
      await characteristic.writeValueWithoutResponse(chunk)
    } else {
      await characteristic.writeValue(chunk)
    }
    // Small delay between packets to prevent printer buffer saturation
    await new Promise((resolve) => setTimeout(resolve, 20))
  }
}

/**
 * Print Stamp Receipt to Connected Bluetooth Printer
 * Receipt contents:
 * 1. Store Name (Bold, Center)
 * 2. Stamp Count (e.g., +1 STAMP)
 * 3. Clear QR Code Raster
 * 4. Token Code (Monospace)
 * 5. Short English Validity Notice: "Expires in: 30 mins (Claim before expiry)"
 */
export async function printStampReceipt(
  printer: BluetoothPrinterConnection,
  data: StampReceiptData
): Promise<boolean> {
  try {
    const { storeName, stampCount, tokenCode, claimUrl, expiresInMinutes = 30 } = data

    const chunks: Uint8Array[] = []
    const append = (b: Uint8Array) => chunks.push(b)
    const appendText = (t: string) => chunks.push(textToBytes(t))

    // 1. Initialize
    append(ESC_POS.INIT)
    append(ESC_POS.ALIGN_CENTER)

    // 2. Store Name Header
    append(ESC_POS.BOLD_ON)
    append(ESC_POS.DOUBLE_HEIGHT)
    appendText(`${storeName.toUpperCase()}\n`)
    append(ESC_POS.NORMAL_TEXT)
    append(ESC_POS.BOLD_OFF)
    appendText('--------------------------------\n')

    // 3. Stamp Reward Details (Concise & Bold)
    append(ESC_POS.BOLD_ON)
    append(ESC_POS.DOUBLE_SIZE)
    appendText(`+${stampCount} STAMP${stampCount > 1 ? 'S' : ''}\n`)
    append(ESC_POS.NORMAL_TEXT)
    append(ESC_POS.BOLD_OFF)
    appendText('--------------------------------\n')

    // 4. QR Code Raster (240px wide for 58mm/80mm sharp scan)
    const qrRaster = await generateQrRaster(claimUrl, 240)
    if (qrRaster) {
      append(ESC_POS.ALIGN_CENTER)
      append(qrRaster)
      append(ESC_POS.FEED_LINE)
    }

    // 5. Expiration (Concise & Minimal)
    append(ESC_POS.ALIGN_CENTER)
    appendText(`Expires in: ${expiresInMinutes} mins\n`)
    appendText('--------------------------------\n')

    // 6. Paper Feed
    append(ESC_POS.FEED_LINES_3)
    append(ESC_POS.CUT_PAPER)

    // Combine all chunks
    const totalLength = chunks.reduce((acc, c) => acc + c.length, 0)
    const combinedBytes = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      combinedBytes.set(chunk, offset)
      offset += chunk.length
    }

    // Send to Bluetooth Printer
    if (printer.isNative) {
      await sendToNativePrinter(combinedBytes)
    } else {
      await sendToCharacteristic(printer.characteristic, combinedBytes)
    }
    return true
  } catch (error) {
    console.error('Failed to print receipt:', error)
    throw error
  }
}

/**
 * Print Claim / Reward Redemption Receipt to Connected Bluetooth Printer
 * Receipt contents:
 * 1. Store Name (Bold, Center)
 * 2. Header: CLAIM RECEIPT
 * 3. Customer Email
 * 4. Reward Name
 * 5. Stamps Used
 * 6. Stamps Remaining
 * 7. Date & Time
 * 8. Status: DONE CLAIM ✓
 */
export async function printClaimReceipt(
  printer: BluetoothPrinterConnection,
  data: ClaimReceiptData
): Promise<boolean> {
  try {
    const {
      storeName,
      customerEmail,
      stampsUsed,
      remainingStamps,
      rewardName,
      rewardQuantity = 1,
      redeemedAt = new Date(),
    } = data

    const chunks: Uint8Array[] = []
    const append = (b: Uint8Array) => chunks.push(b)
    const appendText = (t: string) => chunks.push(textToBytes(t))

    // Format date & time
    const dateObj = typeof redeemedAt === 'string' ? new Date(redeemedAt) : redeemedAt
    const formattedDate = dateObj.toLocaleDateString('ms-MY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    const formattedTime = dateObj.toLocaleTimeString('ms-MY', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    const qtySuffix = rewardQuantity > 1 ? ` x${rewardQuantity}` : ''

    // 1. Initialize
    append(ESC_POS.INIT)
    append(ESC_POS.ALIGN_CENTER)

    // 2. Store Name Header
    append(ESC_POS.BOLD_ON)
    append(ESC_POS.DOUBLE_HEIGHT)
    appendText(`${storeName.toUpperCase()}\n`)
    append(ESC_POS.NORMAL_TEXT)
    appendText('CLAIM RECEIPT / RESIT TEBUS\n')
    append(ESC_POS.BOLD_OFF)
    appendText('================================\n')

    // 3. Status Badge
    append(ESC_POS.ALIGN_CENTER)
    append(ESC_POS.BOLD_ON)
    append(ESC_POS.DOUBLE_SIZE)
    appendText(rewardQuantity > 1 ? `DONE CLAIM x${rewardQuantity}\n` : 'DONE CLAIM\n')
    append(ESC_POS.NORMAL_TEXT)
    append(ESC_POS.BOLD_OFF)
    appendText('--------------------------------\n')

    // 4. Key Details (Left-aligned)
    append(ESC_POS.ALIGN_LEFT)
    appendText(`Store  : ${storeName}\n`)
    appendText(`Email  : ${customerEmail}\n`)
    appendText(`Reward : ${rewardName}${qtySuffix}\n`)
    appendText(`Used   : ${stampsUsed} Stamps\n`)
    appendText(`Balance: ${remainingStamps} Stamps\n`)
    appendText(`Date   : ${formattedDate} ${formattedTime}\n`)
    appendText('--------------------------------\n')

    // 5. Footer note
    append(ESC_POS.ALIGN_CENTER)
    appendText('Thank you for your loyalty!\n')
    appendText('Terima kasih atas sokongan anda!\n')
    appendText('================================\n')

    // 6. Paper Feed & Cut
    append(ESC_POS.FEED_LINES_3)
    append(ESC_POS.CUT_PAPER)

    // Combine all chunks
    const totalLength = chunks.reduce((acc, c) => acc + c.length, 0)
    const combinedBytes = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      combinedBytes.set(chunk, offset)
      offset += chunk.length
    }

    // Send to Bluetooth Printer
    if (printer.isNative) {
      await sendToNativePrinter(combinedBytes)
    } else {
      await sendToCharacteristic(printer.characteristic, combinedBytes)
    }
    return true
  } catch (error) {
    console.error('Failed to print claim receipt:', error)
    throw error
  }
}
