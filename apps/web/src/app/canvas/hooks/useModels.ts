'use client'

import { useEffect, useCallback } from 'react'
import { useModelsStore } from '../store/models'

export type { ModelConfig, ModelCapability } from '../store/models'

export function useModels() {
  const {
    models,
    defaultModel,
    loading,
    error,
    initialized,
    fetchModels,
    getModelById,
    getModelsByProvider,
    getRecommendedModels,
    getResolutionsForModel,
  } = useModelsStore()

  useEffect(() => {
    // 页面加载时请求一次
    if (!initialized) {
      fetchModels()
    }
  }, [initialized, fetchModels])

  return {
    models,
    defaultModel,
    loading,
    error,
    refetch: fetchModels,
    getModelById,
    getModelsByProvider,
    getRecommendedModels,
    getResolutionsForModel,
  }
}
