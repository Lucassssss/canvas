import { GenerationMode, ProviderId } from "../../types.js";
import type { GenerationProvider } from "../../types.js";
import { OpenRouterProvider } from "./openrouter.js";

const providerInstances: Map<string, GenerationProvider> = new Map();

const registry: Record<string, () => GenerationProvider> = {
  [ProviderId.OPENROUTER_GEMINI]: () => new OpenRouterProvider(),
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
  const defaultProviderId = ProviderId.OPENROUTER_GEMINI;
  return getProvider(defaultProviderId);
}

export function getRegisteredProviderIds(): string[] {
  return Object.keys(registry);
}

export function resetProviderCache(): void {
  providerInstances.clear();
  console.log(`[服务商注册表] 已重置缓存`);
}
