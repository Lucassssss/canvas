'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  Play,
  Loader2,
  User,
  Shirt,
  Image as ImageIcon,
  MousePointer2,
  Hand,
  Pencil,
  Eraser,
  Type,
  StickyNote,
  Square,
  Wand2,
} from 'lucide-react'

interface HeroCanvasProps {
  className?: string
}

const SLOT_WIDTH = 140
const SLOT_HEIGHT = 200

const MOCK_IMAGES = {
  model: 'https://d-assets-cn.joii.cc/canvas-uploads/59c6c97e-d9ad-4aaf-b14b-f65398133e23.png',
  clothing: 'https://d-assets-cn.joii.cc/canvas-uploads/e2ba9f5c-7e4d-40e8-b84f-8a9fb4d97aa0.webp',
  result: 'https://d-assets-cn.joii.cc/ai-generated/5e3e910c-9543-4a2d-9232-40424c4b8bed.png',
}

const tools = [
  { icon: <MousePointer2 size={16} />, label: '选择' },
  { icon: <Hand size={16} />, label: '移动' },
  { icon: <Pencil size={16} />, label: '画笔' },
  { icon: <Eraser size={16} />, label: '橡皮' },
  { icon: <Type size={16} />, label: '文本' },
  { icon: <StickyNote size={16} />, label: '便签' },
  { icon: <ImageIcon size={16} />, label: '图片' },
  { icon: <Square size={16} />, label: '形状' },
  { icon: <Shirt size={16} />, label: '服装' },
  { icon: <Wand2 size={16} />, label: 'AI' },
]

type Step = 'idle' | 'generating' | 'result'
type CursorState = 'hidden' | 'entering' | 'over-button' | 'clicking' | 'clicked'

function ImageSlot({ image, isLoading }: { image: string | null; isLoading?: boolean }) {
  return (
    <div
      className="relative bg-white/80 backdrop-blur-sm overflow-hidden shadow-md ring-1 ring-neutral-200"
      style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT }}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <Loader2 size={24} className="animate-spin text-neutral-400" />
        </div>
      ) : image ? (
        <img src={image} alt="" className="w-full h-full object-contain" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-1.5 text-neutral-400">
          <ImageIcon size={18} />
        </div>
      )}
    </div>
  )
}

export function HeroCanvas({ className }: HeroCanvasProps) {
  const [step, setStep] = useState<Step>('idle')
  const [modelImage] = useState<string | null>(MOCK_IMAGES.model)
  const [clothingImage] = useState<string | null>(MOCK_IMAGES.clothing)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<string>('select')
  const [cursorState, setCursorState] = useState<CursorState>('hidden')

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isUserInteractingRef = useRef(false)

  const clearAllTimeouts = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }
  }, [])

  const startGeneration = useCallback(() => {
    setStep('generating')
    setTimeout(() => {
      setResultImage(MOCK_IMAGES.result)
      setStep('result')
    }, 2500)
  }, [])

  const handleGenerate = useCallback(() => {
    if (step === 'generating') return

    clearAllTimeouts()
    isUserInteractingRef.current = true
    setCursorState('hidden')

    if (step === 'result') {
      setResultImage(null)
      setStep('idle')
      setTimeout(() => {
        startGeneration()
      }, 100)
    } else {
      startGeneration()
    }
  }, [step, startGeneration, clearAllTimeouts])

  const handleButtonClick = useCallback(() => {
    handleGenerate()
  }, [handleGenerate])

  useEffect(() => {
    if (step !== 'idle' || isUserInteractingRef.current) return

    const runAnimation = async () => {
      await new Promise(r => {
        animationTimeoutRef.current = setTimeout(r, 1500)
      })
      if (!isUserInteractingRef.current) setCursorState('entering')

      await new Promise(r => {
        animationTimeoutRef.current = setTimeout(r, 1200)
      })
      if (!isUserInteractingRef.current) setCursorState('over-button')

      await new Promise(r => {
        animationTimeoutRef.current = setTimeout(r, 800)
      })
      if (!isUserInteractingRef.current) setCursorState('clicking')

      await new Promise(r => {
        animationTimeoutRef.current = setTimeout(r, 300)
      })
      if (!isUserInteractingRef.current) setCursorState('clicked')

      await new Promise(r => {
        animationTimeoutRef.current = setTimeout(r, 200)
      })
      if (!isUserInteractingRef.current) {
        setCursorState('hidden')
        startGeneration()
      }
    }

    runAnimation()

    return () => {
      clearAllTimeouts()
    }
  }, [step, startGeneration, clearAllTimeouts])

  useEffect(() => {
    if (step === 'result') {
      const restartTimer = setTimeout(() => {
        if (!isUserInteractingRef.current) {
          setStep('idle')
          setResultImage(null)
        }
      }, 5000)
      return () => clearTimeout(restartTimer)
    }
  }, [step])

  const isClicking = cursorState === 'clicking'

  return (
    <div className={`
      relative w-full h-full
      ${className}
    `}>
      <div className="hidden md:block w-full h-full">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #d4d4d4 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center gap-4 p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-neutral-200">
            <ImageSlot image={modelImage} />
            <div className="flex flex-col items-center text-neutral-400">
              <span className="text-lg">+</span>
            </div>
            <ImageSlot image={clothingImage} />

            <div className="flex flex-col items-center text-neutral-400 relative">
              <button
                onClick={handleButtonClick}
                disabled={step === 'generating'}
                className={`
                  w-12 h-12 rounded-full transition-all flex items-center justify-center
                  ${step === 'generating'
                    ? 'bg-neutral-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'}
                `}
              >
                <Play size={22} fill="white" />
              </button>

              {cursorState !== 'hidden' && (
                <div
                  className="absolute pointer-events-none z-50 transition-all duration-1200 ease-out"
                  style={{
                    left: cursorState === 'over-button' || cursorState === 'clicking' || cursorState === 'clicked'
                      ? '50%'
                      : '120px',
                    top: cursorState === 'over-button' || cursorState === 'clicking' || cursorState === 'clicked'
                      ? '50%'
                      : '120px',
                    opacity: 1,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <img
                    src="/click.svg"
                    alt="cursor"
                    className={`w-12 h-12 transition-transform duration-200 ${isClicking ? 'scale-90' : 'scale-100'}`}
                  />
                </div>
              )}
            </div>

            <div className="relative">
              <ImageSlot image={resultImage} isLoading={step === 'generating'} />
            </div>
          </div>

          <div className="absolute top-8 left-8">
            <div className="font-serif-display text-2xl text-neutral-300">真</div>
            <div className="font-serif-display text-lg text-neutral-950 tracking-tight">一键换装，稳定可控</div>
          </div>
        </div>

        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-200">
          {tools.map((tool, i) => (
            <React.Fragment key={tool.label}>
              <button
                onClick={() => setActiveTool(tool.label)}
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-all
                  ${activeTool === tool.label
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'}
                `}
                title={tool.label}
              >
                {tool.icon}
              </button>
              {i === 1 || i === 5 ? (
                <div className="w-px h-6 bg-neutral-200 mx-0.5" />
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="md:hidden flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-center text-sm text-neutral-600 mb-2">
          <span className="font-sans-zh">AI 换装</span>
        </div>
        <button
          onClick={handleGenerate}
          disabled={step === 'generating'}
          className="px-4 py-2 bg-blue-500 text-white text-xs rounded-lg"
        >
          {step === 'generating' ? '生成中...' : '开始演示'}
        </button>
      </div>
    </div>
  )
}
