'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Paperclip, ArrowUp, Square, Loader2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/store/project-store'
import { ModelSelect } from '@/app/canvas/config-panel/ModelSelect'
import { AspectRatioSelect } from '@/app/canvas/config-panel/AspectRatioSelect'
import { ResolutionSelect, type Resolution } from '@/app/canvas/config-panel/ResolutionSelect'
import { useModelsStore } from '@/app/canvas/store/models'
import { aiCombinationService } from '@/ai-combination/service'

const QUICK_TAGS = [
  // { label: '🛍️ 欧美发丝级换模', prompt: '请保留主体服装色彩及一切面料细节。将当前模特无缝替换为欧美籍白人女性外模，要求金发、冷白皮、五官立体高级。背景重构为充满阳光的加州街头，确保衣服材质纹理和全新环境的光影顺滑融合。', image: 'https://d-assets-cn.joii.cc/ai-generated/dcc2a007-0672-4369-a887-7d22c8cdcbfe.png?fmt=webp&w=800' },
  { label: '淘系原生感街拍', prompt: '智能隔离主体服装。将模特替换为五官精致、轮廓柔和的原生感亚洲模特，适合淘宝平台调性。背景生成为带有绿植和阳光的自然街景，渲染出强烈的真实街拍生活感与亲和力。', image: 'https://d-assets-cn.joii.cc/ai-generated/e5fccb7b-6406-4f44-8868-2a941138ed09.png?fmt=webp&w=800' },
  { label: '小红书网感打光', prompt: '不要改变主体对象结构。将视觉重塑为符合小红书审美的氛围感风格：应用低对比度胶片色调，引入百叶窗漏光（高光漫反射）或傍晚落日灯效果，增加轻微颗粒感，让商品极具生活气息和极强购买欲。', image: 'https://d-assets-cn.joii.cc/ai-generated/e0fff5b8-b243-4cf1-97ab-ae6d0b988160.png?fmt=webp&w=800' },
  { label: '纯净质感白底精修', prompt: '精准扣除商品主体，完全去除原生背景和杂乱元素，生成一张纯白（#FFFFFF）底色的专业级商品展示图。同时添加边缘高光和底部真实落地阴影，呈现高端影棚精修级质感。', image: 'https://d-assets-cn.joii.cc/ai-generated/bc6ad51b-833c-4f80-9d54-83a3188dc569.png?fmt=webp&w=800' },
  { label: '街角咖啡慵懒素人', prompt: '生成一位具有极强实拍素人感的亚洲模特，面带慵懒随性的微表情，肌肤保留真实的毛孔肌理与微瑕疵，拒绝塑料AI感。置身于阳光明媚的法式街角咖啡馆，采用iPhone后置摄像头直出视角的松弛感抓拍，柔和的自然光完美展现面料的生活化质感。', image: null },
  { label: '种草OOTD对镜拍', prompt: '将画面重构为极具真实生活种草感的小红书手机对镜自拍（OOTD）风格。生成一位身材匀称的素人模特，手持手机挡脸或自然微笑，背景为温馨极简的落地窗卧室。光线采用午后柔和的散射光，附加轻微胶片颗粒感，彻底消除假人感，营造出极强的真实穿搭代入感与购买欲。', image: null },
  { label: '韩系Ins杂志摆拍', prompt: '生成一位极具韩流Ins风格的亚洲女性模特，五官精致优越，肤感白透有光泽。置身于艺术画廊或高级极简空间中，采用优雅且自带高级感的微侧身摆拍动作。搭配冷调反差光与高端杂志封面级的细腻构图，将衣物的设计轮廓展现得淋漓尽致，营造出极度吸睛的惊艳感。', image: null },
  { label: '徕卡胶片高街抓拍', prompt: '打造极高视觉张力的欧美原生感高街抓拍（High Street Snap）。模特正从斑马线红绿灯旁自信阔步走过，衣摆与头发随风动态扬起。应用徕卡相机的35mm纪实胶片色彩还原，捕捉城市斑驳阳光与冷色调建筑的对比，用强烈的街头感和真实布料褶皱瞬间抓住眼球。', image: null },
  { label: '顶奢户外机能风', prompt: '围绕当下爆火的户外机能风（Gorpcore）与运动风，生成一位体态健美的运动模特。背景深入极具呼吸感的森林松木深处或广阔的雪山湖泊边。使用极低机位的广角仰拍带来绝佳的力量感，晨间清冽的硬光勾勒出服装的防水面料光泽与高弹性质感，呈现出世界顶尖户外品牌的广告级硬照水平。', image: null },
]

interface ChatSectionProps {
  onSend?: (message: string) => void
}

export function ChatSection({ onSend }: ChatSectionProps) {
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 52), 200)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [inputValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (inputValue.trim()) {
        handleSend()
      }
    }
  }

  const router = useRouter()
  const createProject = useProjectStore((state) => state.createProject)
  const { models } = useModelsStore()

  const [isSending, setIsSending] = useState(false)
  const [selectedModel, setSelectedModel] = useState(models.length > 0 ? models[0].id : '')
  const [resolution, setResolution] = useState<Resolution>('1K')
  const [aspectRatio, setAspectRatio] = useState('1:1')

  const [attachmentImage, setAttachmentImage] = useState<string | null>(null)
  const [isUploadingObj, setIsUploadingObj] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingObj(true)
    try {
      const result = await aiCombinationService.uploadImage(file, 'dashboard-uploads')
      if (result.success && result.url) {
        setAttachmentImage(result.url)
      } else {
        alert('上传附件失败：' + result.error)
      }
    } catch {
      alert('上传过程发生错误')
    } finally {
      setIsUploadingObj(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (!selectedModel && models.length > 0) {
      setSelectedModel(models[0].id)
    }
  }, [models, selectedModel])

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return

    if (onSend) {
      onSend(inputValue)
      setInputValue('')
      return
    }

    // Default global shortcut: Create project & jump to canvas with prompt
    setIsSending(true)
    try {
      const promptText = inputValue.trim()
      const projectName = promptText.length > 12 ? promptText.slice(0, 12) + '...' : promptText
      const projectId = await createProject(projectName)

      let url = `/canvas?projectId=${projectId}&initialPrompt=${encodeURIComponent(promptText)}&model=${encodeURIComponent(selectedModel)}&resolution=${encodeURIComponent(resolution)}&aspectRatio=${encodeURIComponent(aspectRatio)}`
      if (attachmentImage) {
        url += `&attachmentImage=${encodeURIComponent(attachmentImage)}`
      }
      // Navigate to canvas with the initial prompt & configs & attachment
      router.push(url)
    } catch (error) {
      console.error('[ChatSection] Failed to create quick project:', error)
      alert('创建项目失败，请重试')
      setIsSending(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full border border-neutral-300 bg-white rounded-2xl transition-all focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-900/5 flex flex-col pt-1">

        {/* Optional Image Attachment Preview */}
        {(attachmentImage || isUploadingObj) && (
          <div className="px-4 pt-3 pb-0 flex flex-wrap gap-2">
            {attachmentImage && (
              <div className="group relative border border-neutral-200 rounded-lg p-0.5 shadow-sm bg-white">
                <img src={attachmentImage} className="w-14 h-14 object-cover rounded-md block" />
                <button
                  onClick={() => setAttachmentImage(null)}
                  className="absolute -top-1.5 -right-1.5 bg-neutral-900 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            {isUploadingObj && (
              <div className="w-14 h-14 border border-neutral-200 rounded-lg bg-neutral-50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
              </div>
            )}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="描述你想要创建的内容，比如 “保留主体换个欧美外模，在加州阳光街头”..."
          rows={4}
          className="
            w-full resize-none border-0 bg-transparent
            px-4 pt-3 pb-14
            font-sans-zh text-sm text-neutral-800 placeholder-neutral-400
            focus:outline-none focus:ring-0
          "
          style={{
            minHeight: '52px',
            maxHeight: '160px',
            height: 'auto',
          }}
        />

        <div className="absolute left-3 bottom-4 flex items-center gap-1.5 flex-wrap">
          <ModelSelect
            value={selectedModel}
            onChange={setSelectedModel}
            disabled={isSending}
            className="h-8 text-sm bg-transparent border-0 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 max-w-[150px]"
          />
          <AspectRatioSelect
            value={aspectRatio}
            onChange={setAspectRatio}
            className="h-8 text-sm bg-transparent border-0 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 w-auto min-w-[70px]"
          />
          <ResolutionSelect
            value={resolution}
            onChange={setResolution}
            className="h-8 text-sm bg-transparent border-0 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 w-auto min-w-[70px]"
          />
        </div>

        <div className="absolute right-3 bottom-4 flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all rounded-lg cursor-pointer"
            title="上传参考图"
            disabled={isUploadingObj || isSending}
          >
            <Paperclip className="w-[18px] h-[18px]" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className={`
            shrink-0 h-8 w-8 p-0 flex items-center justify-center rounded-full transition-all
            ${isSending
                ? 'bg-neutral-800 text-white cursor-not-allowed'
                : inputValue.trim()
                  ? 'bg-black text-white hover:bg-neutral-800 cursor-pointer shadow'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }
          `}
          >
            {isSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Tags - payload buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {QUICK_TAGS.map((tag, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputValue(tag.prompt)
              setAttachmentImage(tag.image || null)
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all rounded-full text-xs font-sans-zh text-neutral-600 whitespace-nowrap hover:shadow"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  )
}
