import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls to top on route change. Useful for SPA where navigation may keep scroll position.
export default function ScrollToTop({ behavior = 'smooth' } = {}) {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior })
  }, [pathname, behavior])
  return null
}
