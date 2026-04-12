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
  }),
  execute: async ({ prompt, modelId, resolution, aspectRatio }) => {
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
        combinationTypeId: GenerationMode.TEXT_TO_IMAGE,
        prompt: prompt,
        images: [],
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
  }),
  canvasRedrawImage: tool({
    description: "Redraw or modify an existing image on the canvas using image-to-image capabilities. Use this ONLY when the user explicitly references an image and asks you to modify or redraw it.",
    inputSchema: z.object({
      sourceImageUrl: z.string().describe("The URL of the original image to modify. You MUST extract this from the user's message context or image attachments."),
      prompt: z.string().describe("A detailed text description of HOW the new image should look after modification."),
      modelId: z.string().optional().describe("The selected image generation model id (e.g., minimax-image-01)."),
      resolution: z.string().optional().describe("The resolution of the image (e.g., 1K, 2K)."),
      aspectRatio: z.string().optional().describe("The aspect ratio of the image (e.g., 1:1, 16:9)."),
      denoisingStrength: z.number().min(0.1).max(1.0).optional().describe("How much to alter the image. 0.1 is minimal change, 1.0 is a completely new image. Default is 0.5")
    }),
    execute: async ({ sourceImageUrl, prompt, modelId, resolution, aspectRatio, denoisingStrength }) => {
      try {
        console.log(`[AI Tool] canvasRedrawImage executing with prompt: ${prompt}, source: ${sourceImageUrl.substring(0, 50)}...`);
        
        const actualModelId = modelId || "openrouter-gemini-2-5-flash";
        
        if (userId) {
          const creditCheck = await checkCredits(userId, actualModelId);
          if (!creditCheck.sufficient) {
            return { success: false, error: `Insufficient credits. Required: ${creditCheck.required}, Current: ${creditCheck.current}` };
          }
        } else {
          return { success: false, error: "Unauthorized: User ID is required to generate images." };
        }

        const result = await imageGenerationService.generate({
          combinationTypeId: GenerationMode.IMAGE_TO_IMAGE,
          prompt: prompt,
          images: [sourceImageUrl],
          settings: {
            model: actualModelId, 
            resolution: resolution || "1K",
            aspectRatio: aspectRatio || "1:1",
            // Pass denoising somehow if the provider supports it, or it will be ignored gracefully
          }
        });
        
        if (result.success && result.images.length > 0) {
          if (userId) {
            try {
              await consumeCredits(
                userId,
                actualModelId,
                'image_generate',
                '重图生成',
                { resolution, aspectRatio, imageCount: result.images.length }
              );
            } catch (creditError) {
              console.error(`[AI Tool] Failed to consume credits:`, creditError);
            }
          }
          
          return { 
            success: true, 
            imageUrl: result.images[0], 
            message: "Image redrawn successfully. The new image should be added to the canvas." 
          };
        } else {
          return { success: false, error: result.error || "Failed to redraw image." };
        }
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  }),
});
