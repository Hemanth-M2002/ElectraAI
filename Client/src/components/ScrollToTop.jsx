import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls to top on route change. Useful for SPA where navigation may keep scroll position.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  
  useLayoutEffect(() => {
    // We use 'instant' (or omit behavior) to ensure the user doesn't see the scroll transition
    // during a page change, which can feel like a bug.
    window.scrollTo(0, 0);
  }, [pathname])
  
  return null
}
