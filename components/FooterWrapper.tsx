'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { BaileyChat } from '@/components/BaileyChat'

interface Props {
  initialHide?: boolean
}

const BASE_DOMAIN = 'baileyagents.com'

function isCustomerSubdomainHost(host: string): boolean {
  if (!host) return false
  const bare = host.split(':')[0].toLowerCase()
  if (!bare.endsWith(`.${BASE_DOMAIN}`)) return false
  if (bare === BASE_DOMAIN || bare === `www.${BASE_DOMAIN}`) return false
  return true
}

export default function FooterWrapper({ initialHide = false }: Props) {
  const pathname = usePathname()

  // Same hydration story as NavWrapper — usePathname() returns "/" on a
  // customer subdomain because the middleware rewrite is server-only, so
  // we must look at window.location.hostname to know if we're on
  // *.baileyagents.com (a generated user site) and suppress the footer
  // and the BaileyChat widget there.
  const [isCustomerSubdomain, setIsCustomerSubdomain] = useState(initialHide)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsCustomerSubdomain(isCustomerSubdomainHost(window.location.hostname))
  }, [])

  const hide =
    isCustomerSubdomain ||
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
