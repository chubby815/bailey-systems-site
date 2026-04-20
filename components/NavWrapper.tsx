'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Props {
  initialHideNav: boolean
  isLoggedIn: boolean
}

const BASE_DOMAIN = 'baileyagents.com'

/**
 * Decide whether the current request is hitting a customer-generated
 * subdomain (e.g. machesney-park.baileyagents.com). Only runs in the
 * browser — the server already makes its own decision via the
 * x-pathname header set by middleware.ts.
 */
function isCustomerSubdomainHost(host: string): boolean {
  if (!host) return false
  const bare = host.split(':')[0].toLowerCase()
  if (!bare.endsWith(`.${BASE_DOMAIN}`)) return false
  if (bare === BASE_DOMAIN || bare === `www.${BASE_DOMAIN}`) return false
  return true
}

export default function NavWrapper({ initialHideNav, isLoggedIn }: Props) {
  const pathname = usePathname()

  // Trust the server's decision until hydration runs. Without this, a customer
  // subdomain (which middleware rewrites to /sites/{slug} server-side) would
  // briefly render the Bailey Agents navbar after hydration because the client
  // router's usePathname() returns "/" — the middleware rewrite is invisible
  // to the client.
  const [isCustomerSubdomain, setIsCustomerSubdomain] = useState(initialHideNav)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsCustomerSubdomain(isCustomerSubdomainHost(window.location.hostname))
  }, [])

  const isCustomerSitePath = pathname.startsWith('/sites/')
  const isWorkflowEditor =
    pathname.startsWith('/dashboard/workflows/new') ||
    (pathname.startsWith('/dashboard/workflows/') &&
      pathname !== '/dashboard/workflows')

  if (isCustomerSubdomain || isCustomerSitePath || isWorkflowEditor) return null

  return <Navbar initialLoggedIn={isLoggedIn} />
}
