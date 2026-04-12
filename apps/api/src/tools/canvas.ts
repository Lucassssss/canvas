import { tool } from "ai";
import { z } from "zod";
import { imageGenerationService } from "../services/image/generation/service.js";
import { GenerationMode } from "../services/image/types.js";
import { consumeCredits, checkCredits } from "../services/credits/index.js";

export const getCanvasTools = (userId?: string) => ({
  canvasGenerateImage: tool({
  description: "Generate an image and place it on the canvas based on a text prompt.",
  inputSchema: z.object({
    prompt: z.string().describe("A detailed text description of the image to generate."),
    modelId: z.string().optional().describe("The selected image generation model id (e.g., minimax-image-01)."),
    resolution: z.string().optional().describe("The resolution of the image (e.g., 1K, 2K, 4K)."),
    aspectRatio: z.string().optional().describe("The aspect ratio of the image (e.g., 1:1, 16:9)."),
    images: z.array(z.string()).optional().describe("Optional reference image URLs extracted from the user's message context."),
  }),
  execute: async ({ prompt, modelId, resolution, aspectRatio, images }) => {
    try {
      console.log(`[AI Tool] canvasGenerateImage executing with prompt: ${prompt}`);
      
      const actualModelId = modelId || "openrouter-gemini-2-5-flash";
      
      // Perform pre-generation credit check
      if (userId) {
        const creditCheck = await checkCredits(userId, actualModelId);
        if (!creditCheck.sufficient) {
          return {
            success: false,
            error: `Insufficient credits. Required: ${creditCheck.required}, Current: ${creditCheck.current}`
          };
        }
      } else {
        return {
          success: false,
          error: "Unauthorized: User ID is required to generate images."
        };
      }

      const result = await imageGenerationService.generate({
        combinationTypeId: images && images.length > 0 ? GenerationMode.IMAGE_TO_IMAGE : GenerationMode.TEXT_TO_IMAGE,
        prompt: prompt,
        images: images || [],
        settings: {
          model: actualModelId, 
          resolution: resolution || "1K",
          aspectRatio: aspectRatio || "1:1"
        }
      });
      
      if (result.success && result.images.length > 0) {
        if (userId) {
          try {
            await consumeCredits(
              userId,
              actualModelId,
              'image_generate',
              '对话绘画',
              { resolution, aspectRatio, imageCount: result.images.length }
            );
          } catch (creditError) {
            console.error(`[AI Tool] Failed to consume credits:`, creditError);
          }
        }
        
        return { 
          success: true, 
          imageUrl: result.images[0], 
          message: "Image generated successfully and will be added to the canvas." 
        };
      } else {
        return { 
          success: false, 
          error: result.error || "Failed to generate image." 
        };
      }
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  })
});
