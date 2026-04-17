import { useCallback, useRef } from 'react'

export interface TextMeasureOptions {
  text: string
  fontSize: number
  fontFamily: string
  fontWeight: string | number
  fontStyle: string
  lineHeight: number
  isNote?: boolean // For padding handling in notes
}

export function useTextMeasure() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const measureText = useCallback((options: TextMeasureOptions) => {
    if (typeof window === 'undefined') return { width: 0, height: 0 }

    if (!containerRef.current) {
      const el = document.createElement('div')
      // Make it completely invisible, non-interactive, and out of document flow
      el.style.visibility = 'hidden'
      el.style.position = 'absolute'
      el.style.pointerEvents = 'none'
      el.style.left = '-9999px'
      el.style.top = '-9999px'
      el.style.whiteSpace = 'pre-wrap'
      el.style.wordBreak = 'break-word'
      el.style.width = 'max-content'
      document.body.appendChild(el)
      containerRef.current = el
    }

    const el = containerRef.current
    
    // Default fallback values based on the text configuration
    const text = options.text || ' '

    el.style.fontSize = `${options.fontSize}px`
    el.style.fontFamily = options.fontFamily
    el.style.fontWeight = String(options.fontWeight)
    el.style.fontStyle = options.fontStyle
    el.style.lineHeight = String(options.lineHeight) // fixed line height

    // Notes have 12px from .canvas-shape and 8px from p-2 (20px total)
    // Text has 8px from .canvas-shape
    if (options.isNote) {
      el.style.padding = '20px'
    } else {
      el.style.padding = '8px'
    }

    el.innerText = text

    const rect = el.getBoundingClientRect()

    return {
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height),
    }
  }, [])

  return measureText
}
