'use client'
import { usePathname } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { BaileyChat } from '@/components/BaileyChat'

export default function FooterWrapper() {
  const pathname = usePathname()

  const hide =
    pathname.startsWith('/sites/') ||
    pathname.startsWith('/dashboard/workflows/new') ||
    (pathname.startsWith('/dashboard/workflows/') &&
      pathname !== '/dashboard/workflows')

  if (hide) return null

  return (
    <>
      <Footer />
      <BaileyChat />
    </>
  )
}
