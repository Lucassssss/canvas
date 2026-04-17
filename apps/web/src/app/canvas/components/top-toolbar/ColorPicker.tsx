'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Pipette } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCanvasStore } from '../../store'

interface HsvaColor { h: number; s: number; v: number; a: number }

function hexToHsva(hex: string): HsvaColor {
  if (hex === 'transparent') return { h: 0, s: 0, v: 0, a: 0 }
  let hexClr = hex.replace('#', '')
  let r = 0, g = 0, b = 0, a = 1
  if (hexClr.length === 3) {
    r = parseInt(hexClr[0] + hexClr[0], 16)
    g = parseInt(hexClr[1] + hexClr[1], 16)
    b = parseInt(hexClr[2] + hexClr[2], 16)
  } else if (hexClr.length === 6) {
    r = parseInt(hexClr.slice(0, 2), 16)
    g = parseInt(hexClr.slice(2, 4), 16)
    b = parseInt(hexClr.slice(4, 6), 16)
  } else if (hexClr.length === 8) {
    r = parseInt(hexClr.slice(0, 2), 16)
    g = parseInt(hexClr.slice(2, 4), 16)
    b = parseInt(hexClr.slice(4, 6), 16)
    a = parseInt(hexClr.slice(6, 8), 16) / 255
  }
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return { h: h * 360, s, v, a }
}

function hsvaToHex(h: number, s: number, v: number, a: number): string {
  let r, g, b
  const i = Math.floor((h / 360) * 6)
  const f = (h / 360) * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
    default: r = 0; g = 0; b = 0
  }
  const toHex = (x: number) => Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16).padStart(2, '0')
  let hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`
  if (a < 1) hex += toHex(a)
  return hex.toUpperCase()
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ColorStore {
  recentColors: string[]
  addRecentColor: (color: string) => void
}

const useColorStore = create<ColorStore>()(
  persist(
    (set) => ({
      recentColors: ['#E53935', '#D81B60', '#1E88E5', '#43A047', '#FFB300'],
      addRecentColor: (color) => set((state) => {
        if (!color || color === 'transparent') return state
        const c = color.slice(0, 7).toUpperCase() // Ignore alpha for recent palette
        if (state.recentColors[0] === c) return state
        const filtered = state.recentColors.filter(x => x !== c)
        return { recentColors: [c, ...filtered].slice(0, 5) }
      })
    }),
    { name: 'canvas-recent-colors' }
  )
)

const checkerboardStyle = {
  backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 4px 4px'
}

const InteractiveArea = ({ 
  className, style, x, y, onChange, children
}: { 
  className?: string, style?: React.CSSProperties, x: number, y: number, 
  onChange: (x: number, y: number) => void, children?: React.ReactNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    let newX = (clientX - rect.left) / rect.width
    let newY = (clientY - rect.top) / rect.height
    newX = Math.max(0, Math.min(1, newX))
    newY = Math.max(0, Math.min(1, newY))
    onChange(newX, newY)
  }, [onChange])
  
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    handleMove(e.clientX, e.clientY)
    
    // Add active styling during drag to avoid DOM layout recalculation stutter
    const el = containerRef.current
    if (el) el.style.cursor = 'crosshair'
    
    const handlePointerMove = (ev: PointerEvent) => handleMove(ev.clientX, ev.clientY)
    const handlePointerUp = () => {
      if (el) el.style.cursor = ''
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  return (
    <div 
      ref={containerRef}
      className={`relative touch-none cursor-pointer ${className || ''}`}
      style={style}
      onPointerDown={handlePointerDown}
    >
      {children}
      <div 
        className="absolute w-4 h-4 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.4)] border border-gray-100 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
      />
    </div>
  )
}

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
  icon?: React.ReactNode
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label, icon }) => {
  const [hsva, setHsva] = useState<HsvaColor>(hexToHsva(color))
  
  const recentColors = useColorStore(s => s.recentColors)
  const addRecentColor = useColorStore(s => s.addRecentColor)

  const lastChangeRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const newHsva = hexToHsva(color)
    const hex1 = hsvaToHex(newHsva.h, newHsva.s, newHsva.v, newHsva.a)
    const hex2 = hsvaToHex(hsva.h, hsva.s, hsva.v, hsva.a)
    if (hex1 !== hex2 && color !== 'transparent') {
      setHsva(newHsva)
    }
  }, [color])

  const handleHsvaChange = (newHsva: Partial<HsvaColor>) => {
    const updated = { ...hsva, ...newHsva }
    setHsva(updated)
    
    // Throttle external updates to maintain 30-60fps
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    const now = Date.now()
    if (now - lastChangeRef.current > 32) {
      onChange(hsvaToHex(updated.h, updated.s, updated.v, updated.a))
      lastChangeRef.current = now
    } else {
      timeoutRef.current = setTimeout(() => {
        onChange(hsvaToHex(updated.h, updated.s, updated.v, updated.a))
        lastChangeRef.current = Date.now()
      }, 32)
    }
  }

  const isTransparent = color === 'transparent'
  const displayHex = hsvaToHex(hsva.h, hsva.s, hsva.v, 1).slice(0, 7)
  const displayAlpha = Math.round(hsva.a * 100)

  const [hexInput, setHexInput] = useState(displayHex)
  const [alphaInput, setAlphaInput] = useState(String(displayAlpha))

  useEffect(() => {
    setHexInput(displayHex)
    setAlphaInput(String(displayAlpha))
  }, [displayHex, displayAlpha])

  const handleHexSubmit = () => {
    let val = hexInput.trim()
    if (!val.startsWith('#')) val = '#' + val
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
      handleHsvaChange(hexToHsva(val))
    } else {
      setHexInput(displayHex)
    }
  }

  const handleAlphaSubmit = () => {
    let val = parseInt(alphaInput)
    if (!isNaN(val)) {
      val = Math.max(0, Math.min(100, val))
      handleHsvaChange({ a: val / 100 })
    } else {
      setAlphaInput(String(displayAlpha))
    }
  }

  const handleEyeDropper = async () => {
    if (!('EyeDropper' in window)) {
      // Optional fallback or ignore for unsupported browsers like Firefox/Safari
      return
    }
    try {
      const eyeDropper = new (window as any).EyeDropper()
      const result = await eyeDropper.open()
      if (result && result.sRGBHex) {
        // Native eyedropper returns a standard hex (e.g. #ff0000)
        // Keep the current alpha unchanged
        const pickedHsva = hexToHsva(result.sRGBHex)
        handleHsvaChange({ h: pickedHsva.h, s: pickedHsva.s, v: pickedHsva.v })
      }
    } catch (e) {
      // User hit Escape to cancel
    }
  }

  return (
    <Popover onOpenChange={(open) => {
      if (!open) {
        addRecentColor(hsvaToHex(hsva.h, hsva.s, hsva.v, 1))
      }
    }}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors text-sm text-gray-700">
          {icon && <span className="text-gray-500">{icon}</span>}
          <div
            className="w-4 h-4 rounded-full border border-gray-200"
            style={isTransparent ? checkerboardStyle : { backgroundColor: color }}
          />
          {label && <span>{label}</span>}
        </button>
      </PopoverTrigger>
      
      <PopoverContent side="top" sideOffset={12} className="w-[260px] p-3 bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-xl rounded-2xl select-none" align="start">
        
        {/* 1. 调色板 Palette */}
        <InteractiveArea 
          className="w-full h-36 rounded-xl overflow-hidden mb-3 ring-1 ring-inset ring-gray-900/10"
          style={{ backgroundColor: `hsl(${hsva.h}, 100%, 50%)` }}
          x={hsva.s}
          y={1 - hsva.v}
          onChange={(x, y) => handleHsvaChange({ s: x, v: 1 - y })}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </InteractiveArea>

        {/* 2. 色相调节bar Hue Slider */}
        <InteractiveArea
          className="w-full h-3 rounded-full mb-3 ring-1 ring-inset ring-gray-900/10"
          style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}
          x={hsva.h / 360}
          y={0.5}
          onChange={(x) => handleHsvaChange({ h: x * 360 })}
        />

        {/* 3. 透明度调节bar Alpha Slider */}
        <div className="w-full h-3 rounded-full mb-3 ring-1 ring-inset ring-gray-900/10" style={checkerboardStyle}>
          <InteractiveArea
            className="w-full h-full rounded-full"
            style={{ background: `linear-gradient(to right, transparent, ${hsvaToHex(hsva.h, hsva.s, hsva.v, 1).slice(0,7)})` }}
            x={hsva.a}
            y={0.5}
            onChange={(x) => handleHsvaChange({ a: x })}
          />
        </div>

        {/* 4. 最近使用色 (5个圆角full) */}
        <div className="flex justify-between items-center mb-3 px-1">
          {recentColors.map((rc) => (
             <button
               key={rc}
               className="w-6 h-6 rounded-full border border-gray-200 transition-transform hover:scale-110 active:scale-95 shadow-sm"
               style={{ backgroundColor: rc }}
               onClick={() => handleHsvaChange(hexToHsva(rc))}
               title={rc}
             />
          ))}
        </div>

        {/* 5. HEX色值 + 透明度百分比 (space-between) 输入框 */}
        <div className="flex justify-between items-center gap-1.5 mt-1">
           {/* 吸色器 */}
           {'EyeDropper' in window && (
             <button
               onClick={handleEyeDropper}
               className="flex-shrink-0 p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
               title="吸取屏幕颜色"
             >
               <Pipette size={14} />
             </button>
           )}
           <input 
             type="text" 
             value={hexInput}
             onChange={(e) => setHexInput(e.target.value)}
             onBlur={handleHexSubmit}
             onKeyDown={(e) => {
               e.stopPropagation()
               if (e.key === 'Enter') handleHexSubmit()
             }}
             className="w-[100px] text-gray-700 font-mono text-[12px] uppercase font-semibold bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
           />
           <div className="flex flex-1 items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-colors">
             <input 
               type="text" 
               value={alphaInput}
               onChange={(e) => setAlphaInput(e.target.value)}
               onBlur={handleAlphaSubmit}
               onKeyDown={(e) => {
                 e.stopPropagation()
                 if (e.key === 'Enter') handleAlphaSubmit()
               }}
               className="w-full text-gray-700 font-mono text-[12px] font-semibold bg-transparent outline-none text-right"
             />
             <span className="text-gray-400 font-mono text-[11px] font-bold">%</span>
           </div>
        </div>

      </PopoverContent>
    </Popover>
  )
}
