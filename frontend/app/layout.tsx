import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🚀 Stripe Connect Dashboard',
  description: 'Experimente todas as funcionalidades do Stripe Connect de forma interativa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <script src="https://js.stripe.com/v3/" async></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
