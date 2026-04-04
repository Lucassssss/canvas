'use client'

import React from 'react'
import { X } from 'lucide-react'
import { useDetailImageStore } from './store'
import { DetailImagePanel } from './DetailImagePanel'
import { DesignPlanPanel } from './DesignPlanPanel'
import { AIWriteModal } from './AIWriteModal'
import './style.css'
import './components.css'

export const DetailImageContainer: React.FC = () => {
  const { isOpen, step, closeDetailImage } = useDetailImageStore()

  const STEP_INDEX: Record<string, number> = {
    input: 0,
    analyzing: 1,
    planning: 2,
    generating: 3,
    done: 4,
  }

  const currentStepIndex = STEP_INDEX[step] ?? 0

  if (!isOpen) return null

  return (
    <div className="detail-image-overlay">
      <div className="detail-image-container">
        {/* 顶部进度条 */}
        <div className="detail-image-header">
          <div className="detail-image-progress">
            <div className="progress-step" data-step="1" data-complete={currentStepIndex > 0}>
              <div className="progress-step-icon">
                {currentStepIndex > 0 ? <span className="check-icon">✓</span> : '1'}
              </div>
              <span>输入</span>
            </div>
            <div className="progress-line" data-active={currentStepIndex > 0} />

            <div className="progress-step" data-step="2" data-complete={currentStepIndex > 1}>
              <div className="progress-step-icon">
                {currentStepIndex > 1 ? <span className="check-icon">✓</span> : '2'}
              </div>
              <span>分析中</span>
            </div>
            <div className="progress-line" data-active={currentStepIndex > 1} />

            <div className="progress-step" data-step="3" data-complete={currentStepIndex > 2}>
              <div className="progress-step-icon">
                {currentStepIndex > 2 ? <span className="check-icon">✓</span> : '3'}
              </div>
              <span>确认规划</span>
            </div>
            <div className="progress-line" data-active={currentStepIndex > 2} />

            <div className="progress-step" data-step="4" data-complete={currentStepIndex > 3}>
              <div className="progress-step-icon">
                {currentStepIndex > 3 ? <span className="check-icon">✓</span> : '4'}
              </div>
              <span>生成中</span>
            </div>
            <div className="progress-line" data-active={currentStepIndex > 3} />

            <div className="progress-step" data-step="5" data-complete={currentStepIndex > 4}>
              <div className="progress-step-icon">
                {currentStepIndex > 4 ? <span className="check-icon">✓</span> : '5'}
              </div>
              <span>完成</span>
            </div>
          </div>
          <button
            onClick={closeDetailImage}
            className="detail-image-close-btn"
            title="关闭"
          >
            <X size={20} />
          </button>
        </div>

        {/* 主体内容区 */}
        <div className="detail-image-content">
          {/* 左侧输入面板 */}
          <div className="detail-image-left">
            <DetailImagePanel />
          </div>

          {/* 右侧预览/结果面板 */}
          <div className="detail-image-right">
            {currentStepIndex >= 2 && <DesignPlanPanel />}
            {currentStepIndex < 2 && (
              <div className="detail-image-empty-state">
                <div className="empty-icon">📋</div>
                <p>输入产品信息后，AI将帮您分析并生成详情图规划</p>
              </div>
            )}
          </div>
        </div>

        {/* AI帮写弹窗 */}
        <AIWriteModal />
      </div>
    </div>
  )
}
