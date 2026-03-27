# 图片服务架构重构检查清单

## 目录结构

- [x] 目录 `services/image/generation/` 已创建
- [x] 目录 `services/image/generation/providers/` 已创建
- [x] 目录 `services/image/generation/prompts/templates/` 已创建
- [x] 目录 `services/image/llm/` 已创建

## 类型定义

- [x] `GenerationMode` 枚举定义了所有支持的生成模式
- [x] `GenerationProvider` 接口定义了服务商必须实现的方法
- [x] `GenerationOptions` 类型包含生成所需的所有参数
- [x] `ValidationResult` 类型包含验证结果和错误信息

## 服务商实现

- [x] `GenerationProvider` 基类正确实现
- [x] OpenRouter 适配器实现了完整的 `generate` 方法
- [x] `validateInput` 方法能正确验证输入
- [x] `getProvider('openrouter-gemini')` 能返回正确的服务商实例

## 提示词模块

- [x] `simple-tryon.md` 模板文件存在且格式正确
- [x] `fixed-face-tryon.md` 模板文件存在且格式正确
- [x] `fixed-face-bg-tryon.md` 模板文件存在且格式正确
- [x] `fixed-face-bg-pose-tryon.md` 模板文件存在且格式正确
- [x] `pose-fission.md` 模板文件存在且格式正确
- [x] `PromptBuilder.build` 能正确替换变量
- [x] 不存在的模式能抛出清晰的错误

## 生成服务

- [x] `ImageGenerationService` 能根据配置选择服务商
- [x] `generate` 方法返回正确格式的结果
- [x] 错误能被正确捕获和传播

## LLM 服务

- [x] `ImageLLMService.generateForConversation` 能处理对话请求
- [x] 能正确记录生成状态

## API 兼容性

- [x] `/api/generate` 接口仍然正常工作
- [x] `ImageGenerateInput` 类型兼容
- [x] `ImageGenerateResult` 类型兼容
- [x] 中文日志输出正常

## 代码质量

- [x] 所有新增代码有中文注释
- [x] 无 mock 服务
- [x] 错误处理完善
- [x] 编译无错误
