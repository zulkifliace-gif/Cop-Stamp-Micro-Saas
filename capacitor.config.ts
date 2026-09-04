import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'my.lajuq.merchant',
  appName: 'LajuS Merchant',
  webDir: 'public',
  server: {
    url: 'https://lajuq.my/dashboard',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
  },
}

export default config
