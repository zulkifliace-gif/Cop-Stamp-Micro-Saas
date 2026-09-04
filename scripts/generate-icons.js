import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const resDir = path.resolve('android/app/src/main/res')
const svgPath = path.resolve('public/logo.svg')

const densities = [
  { name: 'mipmap-mdpi', size: 48, fgSize: 108 },
  { name: 'mipmap-hdpi', size: 72, fgSize: 162 },
  { name: 'mipmap-xhdpi', size: 96, fgSize: 216 },
  { name: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
  { name: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
]

async function generateIcons() {
  console.log('Generating Android icons from', svgPath)

  for (const d of densities) {
    const targetFolder = path.join(resDir, d.name)
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true })
    }

    const logoSafeSize = Math.round(d.fgSize * 0.65)
    const logoPng = await sharp(svgPath)
      .resize(logoSafeSize, logoSafeSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer()

    await sharp({
      create: {
        width: d.fgSize,
        height: d.fgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: logoPng, gravity: 'center' }])
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher_foreground.png'))

    const squareLogoSize = Math.round(d.size * 0.75)
    const squareLogoPng = await sharp(svgPath)
      .resize(squareLogoSize, squareLogoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer()

    await sharp({
      create: {
        width: d.size,
        height: d.size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([{ input: squareLogoPng, gravity: 'center' }])
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher.png'))

    const circleSvg = Buffer.from(
      `<svg width="${d.size}" height="${d.size}"><circle cx="${d.size / 2}" cy="${d.size / 2}" r="${d.size / 2}" fill="white"/></svg>`
    )
    const circleBg = await sharp(circleSvg).png().toBuffer()

    await sharp(circleBg)
      .composite([{ input: squareLogoPng, gravity: 'center' }])
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher_round.png'))

    console.log(`Generated icons for ${d.name} (${d.size}x${d.size}, fg: ${d.fgSize}x${d.fgSize})`)
  }

  console.log('All Android icons generated successfully!')
}

generateIcons().catch((err) => {
  console.error(err)
  process.exit(1)
})
