import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      // Default to dark mode when no saved preference exists.
      const initial = saved === 'light' ? 'light' : 'dark'
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', initial)
      }
      return initial
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return [theme, setTheme]
}
