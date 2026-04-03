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

  if (!isOpen) return null

  return (
    <div className="detail-image-overlay">
      <div className="detail-image-container">
        {/* 顶部进度条 */}
        <div className="detail-image-header">
          <div className="detail-image-progress">
            <div className="progress-step" data-step="1" data-complete={step > 1}>
              <div className="progress-step-icon">
                {step > 1 ? <span className="check-icon">✓</span> : '1'}
              </div>
              <span>输入</span>
            </div>
            <div className="progress-line" data-active={step > 1} />
            
            <div className="progress-step" data-step="2" data-complete={step > 2}>
              <div className="progress-step-icon">
                {step > 2 ? <span className="check-icon">✓</span> : '2'}
              </div>
              <span>分析中</span>
            </div>
            <div className="progress-line" data-active={step > 2} />
            
            <div className="progress-step" data-step="3" data-complete={step > 3}>
              <div className="progress-step-icon">
                {step > 3 ? <span className="check-icon">✓</span> : '3'}
              </div>
              <span>确认规划</span>
            </div>
            <div className="progress-line" data-active={step > 3} />
            
            <div className="progress-step" data-step="4" data-complete={step > 4}>
              <div className="progress-step-icon">
                {step > 4 ? <span className="check-icon">✓</span> : '4'}
              </div>
              <span>生成中</span>
            </div>
            <div className="progress-line" data-active={step > 4} />
            
            <div className="progress-step" data-step="5" data-complete={step > 5}>
              <div className="progress-step-icon">
                {step > 5 ? <span className="check-icon">✓</span> : '5'}
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
            {step >= 3 && <DesignPlanPanel />}
            {step < 3 && (
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
