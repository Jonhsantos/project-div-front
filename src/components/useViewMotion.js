import { useEffect, useRef } from 'react'

// Animate the existing container instead of replacing it and losing form state.
export default function useViewMotion(view) {
  const ref = useRef(null)
  const previous = useRef(view)

  useEffect(() => {
    const node = ref.current
    if (!node || previous.current === view) return undefined
    previous.current = view
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !node.animate) return undefined
    const animation = node.animate(
      [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 240, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
    )
    return () => animation.cancel()
  }, [view])

  return ref
}
