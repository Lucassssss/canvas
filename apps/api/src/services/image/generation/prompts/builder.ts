import { GenerationMode, GenerationStatus } from "../../types.js";
import type { SlotContent, PromptTemplate } from "../../types.js";
import { loadTemplate } from "./index.js";

export class PromptBuilder {
  build(
    mode: GenerationMode,
    slotContents: Record<string, SlotContent>
  ): string {
    const template = loadTemplate(mode);
    const prompt = this.replaceVariables(template, slotContents);

    console.log(`[提示词构建器] 构建提示词 [${mode}]: ${prompt.substring(0, 100)}...`);

    return prompt;
  }

  getAvailableVariables(mode: GenerationMode): string[] {
    const template = loadTemplate(mode);
    return template.variables;
  }

  private replaceVariables(
    template: PromptTemplate,
    slotContents: Record<string, SlotContent>
  ): string {
    let result = template.template;

    for (const variable of template.variables) {
      const slotContent = slotContents[variable];
      if (slotContent?.text) {
        result = result.replace(new RegExp(`\\{\\{${variable}\\}\\}`, "g"), slotContent.text);
      }
    }

    return result;
  }

  getSlotList(slotContents: Record<string, SlotContent>): string[] {
    return Object.keys(slotContents).filter((k) => slotContents[k]?.imageUrl);
  }
}

export const promptBuilder = new PromptBuilder();
