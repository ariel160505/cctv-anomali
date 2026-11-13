import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { PwaRegister } from '@/components/pwa-register'
import './globals.css'

export const metadata: Metadata = {
  title: 'CCTV : Aqis - Surveillance Anomaly Protocol',
  description: 'Protokol Pengawasan Keamanan & Deteksi Anomali Sekolah. Bertahan selama 13 menit dengan 3 nyawa.',
  applicationName: 'CCTV : Aqis',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CCTV : Aqis',
  },
  icons: {
    icon: [
      {
        url: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#060907',
  userScalable: true,
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <PwaRegister />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
