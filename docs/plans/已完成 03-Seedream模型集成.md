# Seedream 模型集成开发计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 Joii 集成 Seedream 系列模型（Seedream 5.0 lite、Seedream 4.5），支持电商场景的高质量图片生成。

**Architecture:** 在现有图片生成服务架构基础上，新增 Seedream 服务商适配器。采用火山方舟官方 API（推荐），同时保留 OpenRouter 调用方式作为备选。

**Tech Stack:** TypeScript, 火山方舟 Ark API / OpenRouter API

---

## 📊 官方 API 文档参考

**火山方舟文档**: https://www.volcengine.com/docs/82379/1824121

### 模型能力矩阵

| 模型名称 | 火山方舟 Model ID | OpenRouter Model ID | 支持分辨率 | 输出格式 | 主要能力 |
|---------|------------------|--------------------|-----------|---------|---------|
| **Seedream 5.0 lite** | `doubao-seedream-5-0-260128` | ❌ 未上线 | 2K, 3K | png, jpeg | 文生图、组图生成、联网搜索 |
| **Seedream 4.5** | `doubao-seedream-4-5-251128` | `bytedance-seed/seedream-4.5` | 2K, 4K | jpeg | 文生图、多图融合 |
| **Seedream 4.0** | `doubao-seedream-4-0-250828` | ❌ 未上线 | 1K, 2K, 4K | jpeg | 基础换装 |

### 限流配置
- **IPM (Images Per Minute)**: 500 张/分钟

---

## 🔄 两种调用方式对比

### 方式一：火山方舟官方 API ⭐ 推荐

**优势：**
- ✅ 官方支持，模型更新及时（Seedream 5.0 已上线）
- ✅ 支持更高分辨率（3K 仅官方支持）
- ✅ 支持 png 输出格式（质量更高）
- ✅ 支持联网搜索功能
- ✅ API 文档完善，技术支持有保障

**劣势：**
- ❌ 需要单独的火山方舟 API Key
- ❌ 需要配置新的 API 端点

**API 端点：**
```
Base URL: https://ark.cn-beijing.volces.com/api/v3
Endpoint: /images/generations
```

**请求示例：**
```typescript
const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.ARK_API_KEY}`
  },
  body: JSON.stringify({
    model: 'doubao-seedream-5-0-260128',  // 或 doubao-seedream-4-5-251128
    prompt: '将图1的服装换为图2的服装',
    image: 'https://example.com/model.jpg',      // 单图
    // images: ['url1', 'url2'],                  // 多图
    size: '2K',                                    // 1K/2K/3K/4K
    output_format: 'png',                          // png/jpeg
    response_format: 'url',                        // url/base64
    watermark: false
  })
});
```

---

### 方式二：OpenRouter API ✅ 现有

**优势：**
- ✅ 复用的现有的 OpenRouter 架构
- ✅ 不需要额外的 API Key
- ✅ 统一的接口设计

**劣势：**
- ❌ Seedream 5.0 尚未上线 OpenRouter
- ❌ 仅支持 jpeg 输出格式
- ❌ 分辨率支持有限（1K/2K/4K）

**当前支持：**
- `bytedance-seed/seedream-4.5` - 已在 openrouter.ts 测试过

---

## 🎯 推荐实现方案

**Phase 1: Seedream 4.5 集成（优先级：高）**
1. 使用 OpenRouter 现有架构（快速上线）
2. 复用 `OpenRouterProvider`，添加 Seedream 4.5 模型路由

**Phase 2: Seedream 5.0 lite 集成（优先级：中）**
1. 创建独立的 `VolcengineProvider`
2. 支持火山方舟官方 API
3. 支持更高分辨率（3K）和 png 输出

**Phase 3: 前端和积分优化（优先级：低）**
1. 完善前端模型选项
2. 调整积分规则

---

## Task 1: 创建 Seedream 服务商适配器 ⭐ Phase 1

**Files:**
- Create: `apps/api/src/services/image/generation/providers/seedream.ts`

### 实现说明

**方案选择**：基于现有 `OpenRouterProvider` 架构，创建轻量级 `SeedreamProvider`

**核心设计决策**：
- ✅ 复用 `PromptBuilder`（不创建独立提示词构建逻辑）
- ✅ 复用 S3 上传逻辑
- ✅ 支持动态 resolution 参数（与现有 OpenRouterProvider 的主要差异）
- ✅ 保持 API 兼容性

### 代码实现

```typescript
/**
 * Seedream 图片生成服务商适配器
 *
 * 支持的模型：
 * - OpenRouter: bytedance-seed/seedream-4.5
 * - 火山方舟: doubao-seedream-4-5-251128, doubao-seedream-5-0-260128
 */

import { BaseProvider } from "./base.js";
import {
  GenerationOptions,
  GenerationResult,
  GenerationMode,
  SlotContent,
  GenerationSettings,
} from "../../types.js";
import { PromptBuilder } from "../prompts/builder.js";
import { s3UploadService } from "../../../s3.js";

/**
 * Seedream 模型配置
 */
export enum SeedreamModel {
  /** OpenRouter 模型 ID */
  SEEDREAM_4_5_OPENROUTER = "bytedance-seed/seedream-4.5",
  /** 火山方舟 Seedream 4.5 */
  SEEDREAM_4_5 = "doubao-seedream-4-5-251128",
  /** 火山方舟 Seedream 5.0 lite */
  SEEDREAM_5_0_LITE = "doubao-seedream-5-0-260128",
}

/**
 * 模型分辨率支持映射
 */
export const MODEL_RESOLUTION_MAP: Record<SeedreamModel, string[]> = {
  [SeedreamModel.SEEDREAM_4_5_OPENROUTER]: ["1K", "2K", "4K"],
  [SeedreamModel.SEEDREAM_4_5]: ["2K", "4K"],
  [SeedreamModel.SEEDREAM_5_0_LITE]: ["2K", "3K"],
};

/**
 * 分辨率尺寸映射
 */
const IMAGE_SIZE_MAP: Record<string, number> = {
  "1K": 1024,
  "2K": 2048,
  "3K": 3072,
  "4K": 4096,
};

export class SeedreamProvider extends BaseProvider {
  readonly id = "seedream";
  readonly name = "Seedream";
  readonly model = SeedreamModel.SEEDREAM_4_5;

  readonly supportedModes: GenerationMode[] = [
    GenerationMode.SIMPLE_TRYON,
    GenerationMode.FIXED_FACE_TRYON,
    GenerationMode.FIXED_FACE_BG_TRYON,
    GenerationMode.FIXED_FACE_BG_POSE_TRYON,
  ];

  private promptBuilder: PromptBuilder;

  constructor() {
    super();
    this.promptBuilder = new PromptBuilder();
  }

  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const { mode, slotContents, settings } = options;

    console.log(`[Seedream服务商] 开始生成图片，模式: ${mode}`);

    try {
      const modelId = settings.model || this.model;
      const isVolcengine = modelId.startsWith("doubao-");

      const imageUrl = isVolcengine
        ? await this.callVolcengineAPI(modelId, mode, slotContents, settings)
        : await this.callOpenRouterAPI(modelId, mode, slotContents, settings);

      const uploadedUrl = await this.uploadToS3IfNeeded(imageUrl);

      console.log(`[Seedream服务商] 生成成功: ${uploadedUrl.substring(0, 80)}...`);
      return { success: true, imageUrl: uploadedUrl };
    } catch (error) {
      console.error(`[Seedream服务商] 生成失败:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "图片生成失败",
      };
    }
  }

  /**
   * 火山方舟 API 调用
   */
  private async callVolcengineAPI(
    model: string,
    mode: GenerationMode,
    slotContents: Record<string, SlotContent>,
    settings: GenerationSettings
  ): Promise<string> {
    const apiKey = process.env.ARK_API_KEY;
    if (!apiKey) {
      throw new Error("火山方舟 API Key 未配置，请设置环境变量 ARK_API_KEY");
    }

    const prompt = this.promptBuilder.build(mode, slotContents);
    const images = this.collectImages(slotContents);

    if (images.length === 0) {
      throw new Error("没有提供任何图片");
    }

    const requestBody: Record<string, any> = {
      model,
      prompt,
      size: this.calculateSize(settings.resolution, model),
      output_format: model === SeedreamModel.SEEDREAM_5_0_LITE ? "png" : "jpeg",
      response_format: "url",
      watermark: false,
    };

    if (images.length === 1) {
      requestBody.image = images[0];
    } else {
      requestBody.images = images;
    }

    const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`火山方舟 API 调用失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("图片生成成功但未能提取图片 URL");
    }

    return imageUrl;
  }

  /**
   * OpenRouter API 调用（兼容模式）
   */
  private async callOpenRouterAPI(
    model: string,
    mode: GenerationMode,
    slotContents: Record<string, SlotContent>,
    settings: GenerationSettings
  ): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API Key 未配置");
    }

    const prompt = this.promptBuilder.build(mode, slotContents);
    const imageParts: { slotId: string; url: string }[] = [];

    for (const [slotId, content] of Object.entries(slotContents)) {
      if (content?.imageUrl) {
        imageParts.push({ slotId, url: content.imageUrl });
      }
    }

    if (imageParts.length === 0) {
      throw new Error("没有提供任何图片");
    }

    const requestBody = {
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...imageParts.map(({ url }) => ({
              type: "image_url",
              image_url: { url },
            })),
          ],
        },
      ],
      image_config: {
        aspect_ratio: this.calculateAspectRatio(settings.resolution),
        image_size: this.calculateImageSize(settings.resolution),
      },
      modalities: ["image"] as const,
    };

    const apiUrl = process.env.OPENROUTER_API_BASE_URL || "https://openrouter.ai/api/v1";
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3001",
        "X-Title": "Joii Canvas - Seedream",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API 调用失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const imageUrl = this.extractImageFromResponse(data);

    if (!imageUrl) {
      throw new Error("图片生成成功但未能提取图片");
    }

    return imageUrl;
  }

  private calculateSize(resolution?: { width: number; height: number }, model?: string): string {
    if (!resolution) return "2K";

    const maxDim = Math.max(resolution.width, resolution.height);
    const availableSizes = model ? MODEL_RESOLUTION_MAP[model as SeedreamModel] : ["1K", "2K", "4K"];

    if (maxDim <= 1024 && availableSizes.includes("1K")) return "1K";
    if (maxDim <= 2048 && availableSizes.includes("2K")) return "2K";
    if (maxDim <= 3072 && availableSizes.includes("3K")) return "3K";
    if (maxDim <= 4096 && availableSizes.includes("4K")) return "4K";

    return availableSizes[availableSizes.length - 1];
  }

  private calculateImageSize(resolution?: { width: number; height: number }): string {
    if (!resolution) return "2k";
    const maxDim = Math.max(resolution.width, resolution.height);
    if (maxDim <= 1024) return "1k";
    if (maxDim <= 2048) return "2k";
    return "4k";
  }

  private calculateAspectRatio(resolution?: { width: number; height: number }): string {
    if (!resolution) return "1:1";
    const { width, height } = resolution;
    const gcd = this.gcd(width, height);
    return `${width / gcd}:${height / gcd}`;
  }

  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  private collectImages(slotContents: Record<string, SlotContent>): string[] {
    const images: string[] = [];
    for (const content of Object.values(slotContents)) {
      if (content?.imageUrl) {
        images.push(content.imageUrl);
      }
    }
    return images;
  }

  private extractImageFromResponse(data: any): string | null {
    try {
      const message = data?.choices?.[0]?.message;
      if (!message) return null;

      if (message.images?.length > 0) {
        return message.images[0].image_url?.url;
      }

      const content = message.content;
      if (typeof content === "string") {
        const jsonMatch = content.match(/"url"\s*:\s*"([^"]+)"/);
        if (jsonMatch) return jsonMatch[1];
      }

      if (Array.isArray(content)) {
        for (const part of content) {
          if (part?.type === "image_url" && part.image_url?.url) {
            return part.image_url.url;
          }
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  private async uploadToS3IfNeeded(imageUrl: string): Promise<string> {
    if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
      const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated-seedream");
      return result.success && result.url ? result.url : imageUrl;
    }
    return imageUrl;
  }
}
```

---

## Task 2: 注册 SeedreamProvider 到服务商注册表 ⭐ Phase 1

**Files:**
- Modify: `apps/api/src/services/image/generation/providers/index.ts`

### 实现步骤

**Step 1: 导入 SeedreamProvider**

```typescript
import { OpenRouterProvider } from "./openrouter.js";
import { SeedreamProvider } from "./seedream.js";
```

**Step 2: 添加到 registry**

```typescript
const registry: Record<string, () => GenerationProvider> = {
  [ProviderId.OPENROUTER_GEMINI]: () => new OpenRouterProvider(),
  [ProviderId.SEEDREAM_5]: () => new SeedreamProvider(),
  [ProviderId.SEEDREAM_4_5]: () => new SeedreamProvider(),
  // ... 其他
};
```

**Step 3: 导出 SeedreamModel 枚举**

```typescript
export { SeedreamModel } from "./seedream.js";
```

---

## Task 3: 更新类型定义 ⭐ Phase 1

**Files:**
- Modify: `apps/api/src/services/image/types.ts`

### 添加新的 ProviderId 和模型元数据

```typescript
export enum ProviderId {
  // ... 现有

  /** Seedream 5.0 lite (火山方舟) */
  SEEDREAM_5_0_LITE = "seedream-5-0-lite",

  /** Seedream 4.5 (火山方舟/OpenRouter) */
  SEEDREAM_4_5 = "seedream-4.5",
}

/**
 * Seedream 模型元数据
 */
export const SEEDREAM_MODELS = {
  "seedream-5-0-lite": {
    id: "seedream-5-0-lite",
    name: "Seedream 5.0",
    provider: "火山方舟",
    internalModelId: "doubao-seedream-5-0-260128",
    supportedResolutions: ["2K", "3K"] as const,
    outputFormats: ["png", "jpeg"] as const,
    features: ["text-to-image", "image-to-image", "multi-image", "web-search"],
    maxImages: 15,
  },
  "seedream-4.5": {
    id: "seedream-4.5",
    name: "Seedream 4.5",
    provider: "火山方舟 / OpenRouter",
    internalModelId: "doubao-seedream-4-5-251128",
    supportedResolutions: ["2K", "4K"] as const,
    outputFormats: ["jpeg"] as const,
    features: ["text-to-image", "image-to-image", "multi-image"],
    maxImages: 15,
  },
} as const;

export type SeedreamModelId = keyof typeof SEEDREAM_MODELS;
```

---

## Task 4: 更新图片生成服务路由逻辑 ⭐ Phase 1

**Files:**
- Modify: `apps/api/src/services/image/generation/service.ts`

### 添加模型到服务商的路由

```typescript
async generate(input: ImageGenerateInput): Promise<ImageGenerateResult> {
  const { settings } = input;
  const modelId = settings.model;

  // 根据模型 ID 选择服务商
  let provider: GenerationProvider | null;

  if (modelId?.includes("seedream")) {
    // Seedream 模型 -> SeedreamProvider
    provider = getProvider(this.getSeedreamProviderId(modelId));
  } else {
    // 其他模型 -> 默认服务商
    provider = this.getProvider();
  }

  if (!provider) {
    return { success: false, error: "未找到可用的图片生成服务商" };
  }

  // ... 后续处理
}

private getSeedreamProviderId(modelId: string): string {
  if (modelId === "seedream-5-0-lite") {
    return ProviderId.SEEDREAM_5_0_LITE;
  }
  return ProviderId.SEEDREAM_4_5;
}
```

---

## Task 5: 添加环境变量配置 ⭐ Phase 2

**Files:**
- Modify: `apps/api/.env`
- Modify: `apps/api/.env.production`

### 添加火山方舟 API Key

```bash
# 火山方舟 Ark API (Seedream 官方)
ARK_API_KEY=your_ark_api_key_here
ARK_API_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
```

### 获取 API Key

1. 访问 [火山方舟控制台](https://console.volcengine.com/ark/region:ark+cn-beijing/apikey)
2. 创建 API Key
3. 开通 Seedream 模型访问权限

---

## Task 6: 更新积分规则配置 ⭐ Phase 3

**Files:**
- Modify: `apps/api/src/services/credits/rules.ts`

### 添加/更新 Seedream 模型定价

```typescript
export const MODEL_PRICING: ModelPricing[] = [
  // ... 现有配置

  // Seedream 5.0 lite (最新型号，高质量)
  {
    id: 'seedream-5-0-lite',
    name: 'Seedream 5.0',
    provider: 'seedream',
    credits: 600,  // 比 4.5 更贵
    category: 'image',
    description: '最新一代高质量图片生成，支持 3K 分辨率和 PNG 输出',
    icon: 'seedream',
    enabled: true,
  },

  // Seedream 4.5 (现有型号)
  {
    id: 'seedream-4.5',
    name: 'Seedream 4.5',
    provider: 'seedream',
    credits: 300,  // 保持现有定价
    category: 'image',
    description: '专业级图片生成，多图融合能力强',
    icon: 'seedream',
    enabled: true,
  },
];
```

---

## Task 7: 更新前端模型选择 ⭐ Phase 3

**Files:**
- Modify: `apps/web/src/app/canvas/config-panel/ModelSelect.tsx`

### 添加 Seedream 模型选项

```typescript
export const MODEL_OPTIONS: ModelOption[] = [
  // ... 现有选项

  // Seedream 5.0
  {
    value: 'seedream-5-0-lite',
    label: 'Seedream 5.0',
    icon: 'seedream',
    description: '最新型号，支持 3K 分辨率',
  },

  // Seedream 4.5
  {
    value: 'seedream-4.5',
    label: 'Seedream 4.5',
    icon: 'seedream',
    description: '专业级换装能力',
  },
];

// 更新模型图标映射
const MODEL_ICONS: Record<string, string> = {
  // ...
  'seedream': '/model_provider/seedream_3.svg',
  // ...
};
```

---

## Task 8: 测试计划 ⭐ All Phases

### Phase 1 测试：Seedream 4.5 via OpenRouter

```bash
curl -X POST http://localhost:3001/api/image/generate \
  -H "Content-Type: application/json" \
  -d '{
    "combinationTypeId": "simple-tryon",
    "slotContents": {
      "model": { "imageUrl": "https://example.com/model.jpg" },
      "clothing": { "imageUrl": "https://example.com/clothing.jpg" }
    },
    "settings": {
      "model": "seedream-4.5",
      "resolution": { "width": 2048, "height": 2048 }
    }
  }'
```

**验证点：**
- ✅ 返回生成的图片 URL
- ✅ 积分正确扣除（300 积分）
- ✅ 错误处理正常

### Phase 2 测试：Seedream 5.0 lite via 火山方舟

```bash
curl -X POST http://localhost:3001/api/image/generate \
  -H "Content-Type: application/json" \
  -d '{
    "combinationTypeId": "fixed-face-bg-tryon",
    "slotContents": {
      "model": { "imageUrl": "https://example.com/model.jpg" },
      "face": { "imageUrl": "https://example.com/face.jpg" },
      "background": { "imageUrl": "https://example.com/bg.jpg" },
      "clothing": { "imageUrl": "https://example.com/clothing.jpg" }
    },
    "settings": {
      "model": "seedream-5-0-lite",
      "resolution": { "width": 3072, "height": 4096 },
      "outputFormat": "png"
    }
  }'
```

**验证点：**
- ✅ 3K 分辨率生成成功
- ✅ PNG 格式输出正常
- ✅ 多图输入处理正确

### Phase 3 测试：完整用户体验

1. **前端模型选择** - 验证模型下拉菜单显示所有 Seedream 选项
2. **积分显示** - 验证选择不同模型时积分显示正确
3. **生成流程** - 完整流程测试：选择模型 → 上传图片 → 生成 → 查看结果

---

## Task 9: Commit

```bash
git add apps/api/src/services/image/generation/providers/seedream.ts
git add apps/api/src/services/image/generation/providers/index.ts
git add apps/api/src/services/image/types.ts
git add apps/api/src/services/image/generation/service.ts
git add apps/api/.env
git add apps/api/src/services/credits/rules.ts
git add apps/web/src/app/canvas/config-panel/ModelSelect.tsx
git commit -m "feat(image): add Seedream model integration (5.0 lite, 4.5) via OpenRouter and Volcengine Ark API"
```

---

## 📋 实施顺序建议

```
Phase 1 (高优先级 - 快速上线)
  1. Task 3 - 更新类型定义（SeedreamModel 元数据）
  2. Task 1 - 创建 SeedreamProvider（核心逻辑）
  3. Task 2 - 注册 SeedreamProvider（连接配置）
  4. Task 4 - 更新服务路由逻辑（模型路由）
  ↓
  测试 Phase 1 (OpenRouter seedream-4.5)
  ↓
Phase 2 (中优先级 - 功能完善)
  5. Task 5 - 添加火山方舟环境变量
  ↓
  测试 Phase 2 (火山方舟 seedream-5.0-lite)
  ↓
Phase 3 (低优先级 - 体验优化)
  6. Task 6 - 更新积分规则
  7. Task 7 - 更新前端选项
  ↓
  测试 Phase 3 (完整用户体验)
  ↓
Task 8 - 最终测试和文档更新
Task 9 - Commit
```

---

## 🔧 技术要点

### 1. **分辨率计算逻辑**
```typescript
// 火山方舟 API
size: "2K" | "3K" | "4K"  // 根据模型支持选择

// OpenRouter API
image_size: "1k" | "2k" | "4k"  // 火山引擎格式（小写 + k）
```

### 2. **多图输入处理**
```typescript
// 单图输入
requestBody.image = "url"

// 多图输入
requestBody.images = ["url1", "url2", ...]
```

### 3. **模型路由策略**
```typescript
// 根据模型 ID 前缀判断调用方式
const isVolcengine = modelId.startsWith("doubao-") ||
                     modelId.includes("seedream-5") ||
                     modelId.includes("seedream-4.5");

if (isVolcengine && hasArkApiKey) {
  // 使用火山方舟 API
} else {
  // 回退到 OpenRouter API
}
```

### 4. **错误处理**
- API Key 未配置
- 模型不支持的分辨率
- 网络请求失败
- 图片提取失败

---

## ⚠️ 已知限制

1. **OpenRouter 限制**
   - Seedream 5.0 尚未上线
   - 仅支持 jpeg 输出
   - 分辨率支持有限

2. **火山方舟限制**
   - 需要单独配置 API Key
   - 部分区域可能访问受限

3. **积分限制**
   - 高分辨率生成消耗更多积分
   - 需要根据实际成本调整定价

---

## 📚 参考资源

- [火山方舟 Seedream 官方文档](https://www.volcengine.com/docs/82379/1824121)
- [OpenRouter Seed 模型列表](https://openrouter.ai/models?provider=bytedance)
- [Joii 现有图片生成架构](./02-图片生成服务重构.md)
