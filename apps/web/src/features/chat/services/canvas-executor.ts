import { useCanvasStore } from '@/app/canvas/store'

/**
 * 临时缓存 tool-call 的 blockId 与画布中 ShapeId 的映射
 */
const toolShapeMap = new Map<string, string>()

/**
 * 集中处理 AI 工具调用到 Canvas 实际操作的映射
 * 独立规划模块，方便后续大规模扩展 AI 画图相关的能力
 */
export const canvasToolExecutor = {
  /**
   * 工具准备阶段：在接收到 tool_call 时立刻在画布上创建占位符（Loading 状态）
   */
  prepareTool(toolName: string, blockId: string) {
    if (toolName === 'canvasGenerateImage' || toolName === 'canvasRedrawImage') {
      const store = useCanvasStore.getState()
      const currentViewport = store.viewport
      
      const centerX = -currentViewport.x / currentViewport.zoom + window.innerWidth / 2 / currentViewport.zoom
      const centerY = -currentViewport.y / currentViewport.zoom + window.innerHeight / 2 / currentViewport.zoom
      
      const newShape = store.addShape({
        type: 'image',
        x: centerX - 256,
        y: centerY - 256,
        width: 512,
        height: 512,
        imageUrl: '', // 为空触发占位
        imageName: 'AI 生成中...',
        isGenerating: true,
        opacity: 1,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        rotation: 0,
      })
      
      toolShapeMap.set(blockId, newShape.id)
      store.setSelectedIds([newShape.id])
    }
  },

  /**
   * 统一执行入口
   */
  executeTool(toolName: string, outputString: string, blockId?: string) {
    if (!toolName.startsWith('canvas')) return;

    try {
      const outputData = JSON.parse(outputString);
      const store = useCanvasStore.getState();
      const shapeId = blockId ? toolShapeMap.get(blockId) : undefined;
      
      switch (toolName) {
        case 'canvasGenerateImage':
        case 'canvasRedrawImage':
          if (outputData.success && outputData.imageUrl) {
            if (shapeId) {
              // 替换掉之前创建的占位符形状
              store.updateShape(shapeId, {
                imageUrl: outputData.imageUrl,
                imageName: 'AI 生成结果',
                isGenerating: false,
                opacity: 1,
                fill: 'transparent',
                stroke: 'transparent',
                strokeWidth: 0,
              })
            } else {
              // Fallback
              this.handleGenerateImage(outputData);
            }
          } else {
            // 执行失败，清理占位符
            if (shapeId) {
              store.deleteShape(shapeId)
            }
          }
          break;
        default:
          console.warn(`[Canvas Executor] Unrecognized tool: ${toolName}`);
      }

      if (blockId) {
        toolShapeMap.delete(blockId);
      }
    } catch (e) {
      console.error(`[Canvas Executor] Failed to parse or execute tool ${toolName}:`, e);
      if (blockId) {
        const shapeId = toolShapeMap.get(blockId)
        if (shapeId) useCanvasStore.getState().deleteShape(shapeId)
        toolShapeMap.delete(blockId)
      }
    }
  },

  /**
   * (Fallback) 兜底：生成图片并放入画布
   */
  handleGenerateImage(outputData: any) {
    if (outputData.success && outputData.imageUrl) {
      const store = useCanvasStore.getState();
      const currentViewport = store.viewport;
      
      const centerX = -currentViewport.x / currentViewport.zoom + window.innerWidth / 2 / currentViewport.zoom;
      const centerY = -currentViewport.y / currentViewport.zoom + window.innerHeight / 2 / currentViewport.zoom;
      
      store.addShape({
        type: 'image',
        x: centerX - 256,
        y: centerY - 256,
        width: 512,
        height: 512,
        imageUrl: outputData.imageUrl,
        opacity: 1,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        rotation: 0,
      });
    }
  }
};
