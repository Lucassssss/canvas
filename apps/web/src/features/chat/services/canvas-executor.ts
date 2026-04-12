import { useCanvasStore } from '@/app/canvas/store'

/**
 * 集中处理 AI 工具调用到 Canvas 实际操作的映射
 * 独立规划模块，方便后续大规模扩展 AI 画图相关的能力
 */
export const canvasToolExecutor = {
  /**
   * 统一执行入口
   */
  executeTool(toolName: string, outputString: string) {
    if (!toolName.startsWith('canvas')) return;

    try {
      const outputData = JSON.parse(outputString);
      
      switch (toolName) {
        case 'canvasGenerateImage':
        case 'canvasRedrawImage':
          this.handleGenerateImage(outputData);
          break;
        // 后续可以在这里扩展更多，如 canvasGenerateLayout, canvasUpdateShape 等
        default:
          console.warn(`[Canvas Executor] Unrecognized tool: ${toolName}`);
      }
    } catch (e) {
      console.error(`[Canvas Executor] Failed to parse or execute tool ${toolName}:`, e);
    }
  },

  /**
   * 工具：生成图片并放入画布
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
