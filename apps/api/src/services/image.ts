import "dotenv/config";

export interface ImageGenerateInput {
  combinationTypeId: string;
  slotContents: Record<string, { imageUrl?: string | null; text?: string | null }>;
  settings: {
    prompt?: string;
    resolution: { width: number; height: number };
    model?: string;
  };
}

export interface ImageGenerateResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

interface TryOnInput extends ImageGenerateInput {
  modelImage?: string;
  clothingImage?: string;
}

class ImageService {
  async generate(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    try {
      const validationError = this.validateInput(input);
      if (validationError) {
        return { success: false, error: validationError };
      }

      switch (input.combinationTypeId) {
        case "simple-tryon":
          return this.handleSimpleTryon(input);
        case "fixed-face-tryon":
          return this.handleFixedFaceTryon(input);
        case "fixed-face-bg-tryon":
          return this.handleFixedFaceBgTryon(input);
        case "fixed-face-bg-pose-tryon":
          return this.handleFixedFaceBgPoseTryon(input);
        case "pose-fission":
          return this.handlePoseFission(input);
        default:
          return { success: false, error: `Unknown combination type: ${input.combinationTypeId}` };
      }
    } catch (error) {
      console.error("[ImageService] Generate error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private validateInput(input: ImageGenerateInput): string | null {
    const { combinationTypeId, slotContents } = input;

    const requiredSlots: Record<string, string[]> = {
      "simple-tryon": ["model", "clothing"],
      "fixed-face-tryon": ["model", "face", "clothing"],
      "fixed-face-bg-tryon": ["model", "face", "background", "clothing"],
      "fixed-face-bg-pose-tryon": ["model", "face", "background", "pose", "clothing"],
      "pose-fission": ["source"],
    };

    const required = requiredSlots[combinationTypeId];
    if (!required) {
      return `Unknown combination type: ${combinationTypeId}`;
    }

    for (const slotId of required) {
      const content = slotContents[slotId];
      if (!content?.imageUrl) {
        return `Missing required slot: ${slotId}`;
      }
    }

    return null;
  }

  private async handleSimpleTryon(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    const { slotContents } = input;
    const modelImage = slotContents.model?.imageUrl;
    const clothingImage = slotContents.clothing?.imageUrl;

    if (!modelImage || !clothingImage) {
      return { success: false, error: "Missing model or clothing image" };
    }

    const resultImageUrl = await this.callTryOnAPI({
      combinationTypeId: "simple-tryon",
      slotContents,
      settings: input.settings,
      modelImage,
      clothingImage,
    });

    return { success: true, imageUrl: resultImageUrl };
  }

  private async handleFixedFaceTryon(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    const { slotContents } = input;

    const resultImageUrl = await this.callTryOnAPI({
      combinationTypeId: "fixed-face-tryon",
      slotContents,
      settings: input.settings,
    });

    return { success: true, imageUrl: resultImageUrl };
  }

  private async handleFixedFaceBgTryon(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    const { slotContents } = input;

    const resultImageUrl = await this.callTryOnAPI({
      combinationTypeId: "fixed-face-bg-tryon",
      slotContents,
      settings: input.settings,
    });

    return { success: true, imageUrl: resultImageUrl };
  }

  private async handleFixedFaceBgPoseTryon(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    const { slotContents } = input;

    const resultImageUrl = await this.callTryOnAPI({
      combinationTypeId: "fixed-face-bg-pose-tryon",
      slotContents,
      settings: input.settings,
    });

    return { success: true, imageUrl: resultImageUrl };
  }

  private async handlePoseFission(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    const { slotContents } = input;
    const sourceImage = slotContents.source?.imageUrl;

    if (!sourceImage) {
      return { success: false, error: "Missing source image" };
    }

    const resultImageUrl = await this.callPoseFissionAPI({
      combinationTypeId: "pose-fission",
      slotContents,
      settings: input.settings,
    });

    return { success: true, imageUrl: resultImageUrl };
  }

  private async callTryOnAPI(input: TryOnInput): Promise<string> {
    const apiUrl = process.env.TRYON_API_URL;
    const apiKey = process.env.TRYON_API_KEY;

    if (!apiUrl) {
      console.log("[ImageService] TRYON_API_URL not configured, using mock response");
      return this.getMockTryOnResult(input);
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model_image: input.modelImage,
        clothing_image: input.clothingImage,
        combination_type: input.combinationTypeId,
        prompt: input.settings.prompt,
        resolution: input.settings.resolution,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ImageService] TryOn API error:", errorText);
      throw new Error(`TryOn API error: ${response.status}`);
    }

    const data = await response.json();
    return data.image_url || data.result_url || data.url;
  }

  private async callPoseFissionAPI(input: ImageGenerateInput): Promise<string> {
    const apiUrl = process.env.POSE_FISSION_API_URL;
    const apiKey = process.env.POSE_FISSION_API_KEY;

    if (!apiUrl) {
      console.log("[ImageService] POSE_FISSION_API_URL not configured, using mock response");
      return this.getMockPoseFissionResult();
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        source_image: input.slotContents.source?.imageUrl,
        resolution: input.settings.resolution,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ImageService] Pose Fission API error:", errorText);
      throw new Error(`Pose Fission API error: ${response.status}`);
    }

    const data = await response.json();
    return data.image_url || data.result_url || data.url;
  }

  private getMockTryOnResult(input: TryOnInput): string {
    const { resolution } = input.settings;
    const width = resolution?.width || 768;
    const height = resolution?.height || 1024;
    return `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
  }

  private getMockPoseFissionResult(): string {
    return `https://picsum.photos/512/512?random=${Date.now()}`;
  }
}

export const imageService = new ImageService();
