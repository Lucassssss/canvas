/**
 * Provider 基类
 *
 * 概念简化：Provider 只负责调用 API，返回图片列表
 */

import type { GenerationProvider, GenerationOptions, GenerationResult } from "../../types.js";

export abstract class BaseProvider implements GenerationProvider {
  abstract readonly id: string;
  abstract readonly name: string;

  abstract generate(options: GenerationOptions): Promise<GenerationResult>;
}
