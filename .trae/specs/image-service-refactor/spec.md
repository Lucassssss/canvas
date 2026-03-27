# 图片服务架构重构规范

## Why

当前图片服务（image.ts）存在以下问题：
- 所有功能（上传、AI生成）集中在单一文件，职责不清
- AI生成服务与其他服务强耦合，无法独立使用
- 无法灵活切换不同的图片生成服务商
- 提示词硬编码在代码中，无法独立管理和配置

需要重构以实现：
- 服务分离：上传服务、AI生成服务独立
- 可扩展性：支持多服务商（Nano Banana、GPT Image、Flux、Seedream等）
- 可维护性：提示词模块独立，支持文件化配置
- 复用性：AI生成服务可同时提供给API和Subagent使用

## What Changes

### 1. 服务架构重构

```
services/
├── image/
│   ├── index.ts                 # 统一导出
│   ├── types.ts                 # 公共类型定义
│   ├── upload/                  # 图片上传服务（当前已存在）
│   │   └── s3.ts
│   ├── generation/              # AI图片生成服务（新建）
│   │   ├── index.ts             # 主入口
│   │   ├── service.ts           # 生成服务主类
│   │   ├── providers/           # 服务商实现
│   │   │   ├── base.ts          # 基础接口
│   │   │   ├── openrouter.ts     # OpenRouter适配器
│   │   │   └── index.ts          # 导出
│   │   └── prompts/             # 提示词模块（新建）
│   │       ├── index.ts         # 提示词加载器
│   │       ├── templates/       # 提示词模板文件
│   │       │   ├── simple-tryon.md
│   │       │   ├── fixed-face-tryon.md
│   │       │   ├── fixed-face-bg-tryon.md
│   │       │   ├── fixed-face-bg-pose-tryon.md
│   │       │   └── pose-fission.md
│   │       └── builder.ts        # 提示词构建器
│   └── llm/                     # LLM服务（新建，给Subagent用）
│       ├── index.ts
│       └── service.ts
```

### 2. 核心抽象

**Provider接口** - 统一的服务商接口：
```typescript
interface GenerationProvider {
  readonly id: string;
  readonly name: string;
  readonly supportedModes: GenerationMode[];

  generate(options: GenerationOptions): Promise<GenerationResult>;
  validateInput(input: ImageGenerateInput): ValidationResult;
}
```

**Prompt模块** - 支持变量注入的提示词系统：
```typescript
interface PromptTemplate {
  mode: GenerationMode;
  template: string;
  variables: string[];
}

class PromptBuilder {
  build(mode: GenerationMode, variables: Record<string, string>): string;
  loadTemplate(mode: GenerationMode): PromptTemplate;
}
```

### 3. 支持的服务商

| 服务商 | ID | 说明 |
|--------|-----|------|
| OpenRouter (Gemini) | `openrouter-gemini` | 当前实现，基于OpenRouter |
| Nano Banana 2 | `nano-banana-2` | 预留 |
| Nano Banana Pro | `nano-banana-pro` | 预留 |
| GPT Image 1.5 | `gpt-image-1.5` | 预留 |
| Flux 2 Pro | `flux-2-pro` | 预留 |
| Flux 2 Max | `flux-2-max` | 预留 |
| Seedream 5 | `seedream-5` | 预留 |

### 4. 服务暴露

**API层** - 保持现有接口，调用重构后的服务

**Subagent层** - 新增LLM服务接口：
```typescript
class ImageLLMService {
  // 生成图片（给对话使用）
  async generateForConversation(
    conversationId: string,
    input: ImageGenerateInput
  ): Promise<ImageGenerateResult>;

  // 查询生成状态
  async getGenerationStatus(taskId: string): Promise<GenerationStatus>;
}
```

## Impact

### 目录结构变更

| 操作 | 路径 |
|------|------|
| 新建 | `services/image/generation/` |
| 新建 | `services/image/generation/providers/` |
| 新建 | `services/image/generation/prompts/` |
| 新建 | `services/image/generation/prompts/templates/` |
| 新建 | `services/image/llm/` |
| 修改 | `services/image.ts` → 拆分为多个文件 |

### API兼容性

- [x] 现有 `/api/generate` 接口保持兼容
- [x] 现有 `ImageGenerateInput` / `ImageGenerateResult` 类型保持兼容
- [ ] 新增 `ImageLLMService` 供Subagent调用

## ADDED Requirements

### Requirement: 服务商切换能力
系统 SHALL 支持运行时切换不同的图片生成服务商。

#### Scenario: 切换服务商
- **WHEN** 配置文件中指定了不同的服务商ID
- **THEN** 生成服务使用对应服务商实现

### Requirement: 提示词独立配置
系统 SHALL 支持从文件加载提示词模板，并支持变量注入。

#### Scenario: 使用提示词生成
- **WHEN** 调用 `PromptBuilder.build(mode, variables)`
- **THEN** 返回填充变量后的提示词

### Requirement: LLM服务复用
系统 SHALL 允许Subagent服务调用图片生成能力。

#### Scenario: Subagent调用
- **WHEN** Subagent发送图片生成请求
- **THEN** 通过 `ImageLLMService` 处理请求

## MODIFIED Requirements

### Requirement: 图片生成接口
**原**: 单文件 `image.ts` 实现所有功能
**改**: 分散到多个模块，职责分离

## REMOVED Requirements

### Requirement: Mock服务
**Reason**: 开发/测试时应使用真实服务商或专门的测试环境
**Migration**: 移除所有 `getMock*` 方法

## Migration Steps

1. 创建新的目录结构
2. 实现 Provider 接口和 OpenRouter 适配器
3. 实现 Prompt 模块
4. 实现 LLM 服务
5. 更新 API 路由使用新服务
6. 删除旧 `image.ts`
