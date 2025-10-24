import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CS2 Skin Monitor - Monitore preços de skins do Counter-Strike 2",
  description: "Sistema completo para monitoramento automático de preços de skins do CS2 com alertas personalizados.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "CS2 Skin Monitor",
    description: "Monitore preços de skins do Counter-Strike 2 com alertas automáticos",
    images: ["/og-image.png"],
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}