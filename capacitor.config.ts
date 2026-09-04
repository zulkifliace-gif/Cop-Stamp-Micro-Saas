import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'my.lajuq.merchant',
  appName: 'LajuS Merchant',
  webDir: 'public',
  server: {
    url: 'https://www.lajuq.my/dashboard',
    cleartext: false,
    androidScheme: 'https',
    allowNavigation: [
      'www.lajuq.my',
      'lajuq.my',
      '*.lajuq.my',
      '*.supabase.co',
      'accounts.google.com',
      '*.google.com',
      'accounts.youtube.com',
    ],
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
  },
}

export default config
