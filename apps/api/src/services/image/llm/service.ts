/**
 * 图片 LLM 服务（供 Subagent 使用）
 *
 * 为 AI 对话系统提供图片生成能力
 */

import { GenerationStatus } from "../types.js";
import type {
  ImageGenerateInput,
  ImageGenerateResult,
} from "../types.js";
import { imageGenerationService } from "../generation/service.js";

interface GenerationTask {
  taskId: string;
  conversationId: string;
  input: ImageGenerateInput;
  status: GenerationStatus;
  result?: ImageGenerateResult;
  createdAt: Date;
  completedAt?: Date;
}

class ImageLLMService {
  private tasks: Map<string, GenerationTask> = new Map();
  private taskIdCounter = 0;

  async generateForConversation(
    conversationId: string,
    input: ImageGenerateInput
  ): Promise<{ taskId: string }> {
    const taskId = this.generateTaskId();

    console.log(`[图片LLM服务] 创建生成任务 [${taskId}]，对话: ${conversationId}`);

    const task: GenerationTask = {
      taskId,
      conversationId,
      input,
      status: GenerationStatus.PENDING,
      createdAt: new Date(),
    };
    this.tasks.set(taskId, task);

    this.executeGeneration(taskId, input);

    return { taskId };
  }

  async getGenerationStatus(taskId: string): Promise<{
    status: GenerationStatus;
    result?: ImageGenerateResult;
  }> {
    const task = this.tasks.get(taskId);
    if (!task) {
      console.warn(`[图片LLM服务] 任务不存在: ${taskId}`);
      return { status: GenerationStatus.FAILED };
    }

    return {
      status: task.status,
      result: task.result,
    };
  }

  async getConversationTasks(conversationId: string): Promise<GenerationTask[]> {
    const tasks: GenerationTask[] = [];
    for (const task of this.tasks.values()) {
      if (task.conversationId === conversationId) {
        tasks.push(task);
      }
    }
    return tasks;
  }

  private async executeGeneration(taskId: string, input: ImageGenerateInput): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;

    try {
      task.status = GenerationStatus.PROCESSING;
      console.log(`[图片LLM服务] 任务开始处理 [${taskId}]`);

      const result = await imageGenerationService.generate(input);

      task.status = result.success ? GenerationStatus.COMPLETED : GenerationStatus.FAILED;
      task.result = {
        success: result.success,
        images: result.images || [],
        error: result.error,
      };
      task.completedAt = new Date();

      console.log(`[图片LLM服务] 任务完成 [${taskId}]，状态: ${task.status}`);
    } catch (error) {
      console.error(`[图片LLM服务] 任务异常 [${taskId}]:`, error);
      task.status = GenerationStatus.FAILED;
      task.result = {
        success: false,
        images: [],
        error: error instanceof Error ? error.message : "未知错误",
      };
      task.completedAt = new Date();
    }
  }

  private generateTaskId(): string {
    this.taskIdCounter++;
    return `img_${Date.now()}_${this.taskIdCounter}`;
  }

  cleanupExpiredTasks(maxAgeMs: number = 3600000): void {
    const now = Date.now();
    for (const [taskId, task] of this.tasks.entries()) {
      if (now - task.createdAt.getTime() > maxAgeMs) {
        this.tasks.delete(taskId);
      }
    }
    console.log(`[图片LLM服务] 清理过期任务完成，当前任务数: ${this.tasks.size}`);
  }
}

export const imageLLMService = new ImageLLMService();
