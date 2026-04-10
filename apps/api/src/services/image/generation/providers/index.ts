import "dotenv/config";
import type { GenerationProvider } from "../../types.js";
import { OpenRouterProvider } from "./openrouter.js";
import { APIMartProvider } from "./apimart.js";
import { LocalGeminiProvider } from "./local-gemini.js";
import { VolcengineSeedreamProvider } from "./volcengine-seedream.js";
import { getEnabledModels } from "../../model-configs.js";

const providerInstances: Map<string, GenerationProvider> = new Map();

const registry: Record<string, () => GenerationProvider> = {
  "openrouter-gemini": () => new OpenRouterProvider(),
  "apimart-gemini": () => new APIMartProvider(),
  "local-gemini": () => new LocalGeminiProvider(),
  "volcengine-seedream-5-0-lite": () => new VolcengineSeedreamProvider(),
  "volcengine-seedream-4-5": () => new VolcengineSeedreamProvider(),
};

export function getProvider(providerId: string): GenerationProvider | null {
  if (providerInstances.has(providerId)) {
    return providerInstances.get(providerId)!;
  }

  const createProvider = registry[providerId];
  if (!createProvider) {
    console.warn(`[服务商注册表] 未找到服务商: ${providerId}`);
    return null;
  }

  const provider = createProvider();
  providerInstances.set(providerId, provider);

  console.log(`[服务商注册表] 获取服务商: ${provider.name}`);
  return provider;
}

export function getProviderByModelId(modelId: string): GenerationProvider | null {
  const models = getEnabledModels();
  const modelConfig = models.find((m) => m.id === modelId);
  
  if (!modelConfig) {
    console.warn(`[服务商注册表] 未找到模型配置: ${modelId}`);
    return null;
  }

  const providerId = modelConfig.registryProviderId;
  if (!providerId) {
    console.warn(`[服务商注册表] 模型 ${modelId} 未配置 registryProviderId`);
    return null;
  }

  return getProvider(providerId);
}

export function getRegisteredProviderIds(): string[] {
  return Object.keys(registry);
}

export function resetProviderCache(): void {
  providerInstances.clear();
  console.log(`[服务商注册表] 已重置缓存`);
}
