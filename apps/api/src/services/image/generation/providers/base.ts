import { GenerationMode } from "../../types.js";
import type { GenerationProvider, GenerationOptions, GenerationResult, ImageGenerateInput, ValidationResult } from "../../types.js";

export abstract class BaseProvider implements GenerationProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly supportedModes: GenerationMode[];

  abstract generate(options: GenerationOptions): Promise<GenerationResult>;

  validateInput(input: ImageGenerateInput): ValidationResult {
    const mode = input.combinationTypeId as GenerationMode;
    if (!this.supportedModes.includes(mode)) {
      return {
        valid: false,
        error: `不支持的生成模式: ${input.combinationTypeId}，支持的模式: ${this.supportedModes.join(", ")}`
      };
    }

    const requiredSlots: Record<string, string[]> = {
      "simple-tryon": ["model", "clothing"],
      "fixed-face-tryon": ["model", "face", "clothing"],
      "fixed-face-bg-tryon": ["model", "face", "background", "clothing"],
      "fixed-face-bg-pose-tryon": ["model", "face", "background", "pose", "clothing"],
      "pose-fission": ["source"],
    };

    const required = requiredSlots[input.combinationTypeId];
    if (!required) {
      return { valid: false, error: `不支持的组合类型: ${input.combinationTypeId}` };
    }

    for (const slotId of required) {
      const content = input.slotContents[slotId];
      if (!content?.imageUrl) {
        return { valid: false, error: `缺少必填槽位: ${slotId}` };
      }
    }

    return { valid: true };
  }
}
