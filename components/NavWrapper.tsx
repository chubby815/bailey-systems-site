'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Props {
  initialHideNav: boolean
  isLoggedIn: boolean
}

export default function NavWrapper({ initialHideNav, isLoggedIn }: Props) {
  const pathname = usePathname()

  const isCustomerSite = pathname.startsWith('/sites/')
  const isWorkflowEditor =
    pathname.startsWith('/dashboard/workflows/new') ||
    (pathname.startsWith('/dashboard/workflows/') &&
      pathname !== '/dashboard/workflows')

  if (isCustomerSite || isWorkflowEditor) return null

  return <Navbar initialLoggedIn={isLoggedIn} />
}
