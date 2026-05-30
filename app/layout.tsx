import type { Metadata } from 'next'
import Script from 'next/script'
import { Playfair_Display, Inter, Noto_Sans_SC } from 'next/font/google'
import { InquiryProvider } from '@/lib/inquiry'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import InquiryBar from '@/components/InquiryBar'
import QuoteDrawer from '@/components/QuoteDrawer'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-cjk',
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Petpallets — Aquarium & Pet Products Wholesale',
    template: '%s | Petpallets',
  },
  description:
    'B2B wholesale supplier of aquarium supplies and pet products. Factory-direct pricing, OEM/ODM available. ISO-certified.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={`${playfair.variable} ${inter.variable} ${notoSansSC.variable}`}
    >
      <body className='font-body text-base text-neutral-900 bg-neutral-0 antialiased'>
        {/* Google Tag Manager */}
        <Script
          id='gtm-init'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KMNRNL4P');`,
          }}
        />
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-KMNRNL4P'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <InquiryProvider>
          <Nav />
          <main className=''>{children}</main>
          <Footer />
          <InquiryBar />
          <QuoteDrawer />
        </InquiryProvider>
      </body>
    </html>
  )
}
