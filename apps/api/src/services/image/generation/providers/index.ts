import "dotenv/config";
import { GenerationMode, ProviderId } from "../../types.js";
import type { GenerationProvider } from "../../types.js";
import { OpenRouterProvider } from "./openrouter.js";
import { APIMartProvider } from "./apimart.js";

const DEFAULT_IMAGE_PROVIDER_ID = process.env.DEFAULT_IMAGE_PROVIDER_ID;
import { LocalGeminiProvider } from "./local-gemini.js";

const providerInstances: Map<string, GenerationProvider> = new Map();

const registry: Record<string, () => GenerationProvider> = {
  [ProviderId.OPENROUTER_GEMINI]: () => new OpenRouterProvider(),
  [ProviderId.APIMART_GEMINI]: () => new APIMartProvider(),
  [ProviderId.LOCAL_GEMINI]: () => new LocalGeminiProvider(),
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

  console.log(`[服务商注册表] 获取服务商: ${provider.name} (模型: ${provider.model})`);
  return provider;
}

export function getDefaultProvider(): GenerationProvider | null {
  if (!DEFAULT_IMAGE_PROVIDER_ID) {
    throw new Error(
      `[服务商注册表] 未配置默认图片服务商，请设置环境变量 DEFAULT_IMAGE_PROVIDER_ID\n` +
      `可用选项: ${Object.values(ProviderId).join(", ")}`
    );
  }
  
  console.log(`[服务商注册表] 使用默认服务商: ${DEFAULT_IMAGE_PROVIDER_ID}`);
  return getProvider(DEFAULT_IMAGE_PROVIDER_ID);
}

export function getRegisteredProviderIds(): string[] {
  return Object.keys(registry);
}

export function resetProviderCache(): void {
  providerInstances.clear();
  console.log(`[服务商注册表] 已重置缓存`);
}
