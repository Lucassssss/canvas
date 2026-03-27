import { GenerationMode } from "../../types.js";
import type { PromptTemplate } from "../../types.js";

const TEMPLATES: Record<GenerationMode, { name: string; template: string }> = {
  [GenerationMode.SIMPLE_TRYON]: {
    name: "简单换装",
    template: `You are an expert fashion stylist. Take the person from the first image and apply the clothing from the second image to them. The person should keep their natural pose, face, and body shape. The final image must look realistic, as if the person is genuinely wearing that clothing item. Important: Only output the final result image, no additional text or description.`,
  },
  [GenerationMode.FIXED_FACE_TRYON]: {
    name: "固定人脸换装",
    template: `You are an expert fashion stylist. Use the first image as reference for the person's identity. Apply the clothing from the third image to them while preserving the face from the second image. Maintain the natural pose and ensure a realistic appearance. Only output the final result image.`,
  },
  [GenerationMode.FIXED_FACE_BG_TRYON]: {
    name: "固定人脸背景换装",
    template: `You are an expert fashion stylist. Using the first image as reference: preserve the face from the second image, keep the background from the third image, and apply the clothing from the fourth image. Maintain the same pose and create a realistic, natural-looking composition. Only output the final result image.`,
  },
  [GenerationMode.FIXED_FACE_BG_POSE_TRYON]: {
    name: "固定人脸背景姿势换装",
    template: `You are an expert fashion stylist. Using the first image as reference: preserve the face from the second image, keep the background from the third image, use the pose from the fourth image, and apply the clothing from the fifth image. Create a natural, realistic result that looks like one coherent image. Only output the final result image.`,
  },
  [GenerationMode.POSE_FISSION]: {
    name: "姿势分解",
    template: `You are an expert fashion stylist. Generate 5 different natural pose variations of the person in the image. Each pose should be unique and realistic. Only output the final result images, no additional text or description.`,
  },
};

export function loadTemplate(mode: GenerationMode): PromptTemplate {
  const templateInfo = TEMPLATES[mode];
  if (!templateInfo) {
    throw new Error(`不支持的生成模式: ${mode}`);
  }

  const variables: string[] = [];
  const variableMatch = templateInfo.template.match(/\{\{(\w+)\}\}/g);
  if (variableMatch) {
    for (const v of variableMatch) {
      const varName = v.replace(/\{\{|\}\}/g, "");
      if (!variables.includes(varName)) {
        variables.push(varName);
      }
    }
  }

  return {
    mode,
    name: templateInfo.name,
    template: templateInfo.template,
    variables,
  };
}

export function getSupportedModes(): GenerationMode[] {
  return Object.keys(TEMPLATES) as GenerationMode[];
}
