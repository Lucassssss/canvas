# 图片服务架构重构任务列表

## 前置准备

- [x] 1.1: 创建目录结构
  - [x] 创建 `services/image/generation/` 目录
  - [x] 创建 `services/image/generation/providers/` 目录
  - [x] 创建 `services/image/generation/prompts/templates/` 目录
  - [x] 创建 `services/image/llm/` 目录

## 类型定义

- [x] 2.1: 定义公共类型 (`services/image/types.ts`)
  - [x] `GenerationMode` 枚举（对应 combinationTypeId）
  - [x] `GenerationProvider` 接口
  - [x] `GenerationOptions` 类型
  - [x] `GenerationResult` 类型
  - [x] `ValidationResult` 类型

## 服务商实现

- [x] 3.1: 实现服务商基础接口 (`services/image/generation/providers/base.ts`)
  - [x] 定义 `GenerationProvider` 抽象基类
  - [x] 定义 `validateInput` 抽象方法

- [x] 3.2: 实现 OpenRouter 适配器 (`services/image/generation/providers/openrouter.ts`)
  - [x] 继承 `GenerationProvider`
  - [x] 实现 `generate` 方法（从现有 image.ts 迁移）
  - [x] 实现 `validateInput` 方法

- [x] 3.3: 实现服务商注册表 (`services/image/generation/providers/index.ts`)
  - [x] 导出 `getProvider` 函数
  - [x] 支持通过 ID 获取服务商实例

## 提示词模块

- [x] 4.1: 创建提示词模板文件
  - [x] `services/image/generation/prompts/templates/simple-tryon.md`
  - [x] `services/image/generation/prompts/templates/fixed-face-tryon.md`
  - [x] `services/image/generation/prompts/templates/fixed-face-bg-tryon.md`
  - [x] `services/image/generation/prompts/templates/fixed-face-bg-pose-tryon.md`
  - [x] `services/image/generation/prompts/templates/pose-fission.md`

- [x] 4.2: 实现提示词加载器 (`services/image/generation/prompts/index.ts`)
  - [x] 实现 `PromptTemplate` 结构
  - [x] 实现 `loadTemplate` 方法

- [x] 4.3: 实现提示词构建器 (`services/image/generation/prompts/builder.ts`)
  - [x] 实现 `PromptBuilder` 类
  - [x] 实现 `build` 方法（支持变量注入）
  - [x] 实现 `getAvailableVariables` 方法

## 生成服务

- [x] 5.1: 实现生成服务主类 (`services/image/generation/service.ts`)
  - [x] 实现 `ImageGenerationService` 类
  - [x] 实现 `generate` 方法（分发到对应服务商）
  - [x] 实现 `setProvider` 方法（切换服务商）

- [x] 5.2: 实现主入口 (`services/image/generation/index.ts`)
  - [x] 导出 `ImageGenerationService`
  - [x] 导出 `getProvider` 函数
  - [x] 导出 `PromptBuilder` 类

## LLM 服务（Subagent用）

- [x] 6.1: 实现 LLM 服务 (`services/image/llm/service.ts`)
  - [x] 实现 `ImageLLMService` 类
  - [x] 实现 `generateForConversation` 方法
  - [x] 实现 `getGenerationStatus` 方法

- [x] 6.2: 实现 LLM 服务入口 (`services/image/llm/index.ts`)
  - [x] 导出 `ImageLLMService`

## 服务整合

- [x] 7.1: 创建图片服务统一入口 (`services/image/index.ts`)
  - [x] 导出上传服务
  - [x] 导出生成服务
  - [x] 导出 LLM 服务

- [x] 7.2: 更新 API 路由 (`services/routes/index.ts`)
  - [x] 使用新的 `ImageGenerationService`
  - [x] 保持接口兼容

## 清理

- [x] 8.1: 删除旧的 `services/image.ts`

## 任务依赖

```
1.1 → 2.1 → 3.1 → 3.2 → 3.3 → 4.1 → 4.2 → 4.3 → 5.1 → 5.2 → 6.1 → 6.2 → 7.1 → 7.2 → 8.1
```

- 3.1, 3.2, 3.3 可以并行（实现不同服务商）
- 4.1 可以并行（创建多个模板文件）
- 5.1, 5.2 依赖 3.x 和 4.x
- 7.1, 7.2 依赖所有前置任务
