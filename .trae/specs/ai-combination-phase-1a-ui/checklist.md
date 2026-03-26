# Checklist - AI换装组件 Phase 1A

## 基础架构

- [x] `ai-combination/types.ts` 创建完成，类型定义正确
- [x] `ai-combination/registry.ts` 创建完成，注册表功能正常
- [x] `ai-combination/built-in-types.ts` 创建完成，simple-tryon 类型已注册
- [x] `ai-combination/service.ts` 创建完成，模拟生成功能正常

## 类型扩展

- [x] `canvas/shapes/types.ts` - `ShapeType` 添加了 `'ai-combination'`
- [x] `canvas/shapes/types.ts` - `AICombinationShapeProps` 接口定义完整
- [x] `canvas/shapes/types.ts` - `ShapeProps` 联合类型包含 ai-combination

## 组件渲染

- [x] `AICombinationComponent.tsx` - Header 显示组合类型名称
- [x] `AICombinationComponent.tsx` - 槽位虚线框显示正确
- [x] `AICombinationComponent.tsx` - placeholder 文字显示正确
- [x] `AICombinationComponent.tsx` - 拖拽高亮效果（蓝色边框+背景）
- [x] `AICombinationComponent.tsx` - 点击上传打开文件选择器
- [x] `AICombinationComponent.tsx` - 清除按钮功能正常
- [x] `AICombinationComponent.tsx` - 执行按钮样式正确（禁用状态、加载动画）
- [x] `AICombinationComponent.tsx` - Phase 1A 模拟：2秒后显示占位图
- [x] `AICombinationComponent.tsx` - 结果区域正常显示
- [x] `AICombinationComponent.tsx` - 错误状态显示正常
- [x] `AICombinationComponent.tsx` - 选中状态蓝色 ring 边框正常

## Shape 集成

- [x] `Shape.tsx` - 添加了 `ai-combination` case
- [x] `Shape.tsx` - 类型断言正确处理

## Store 扩展

- [x] `store.ts` - 使用现有 `updateShape` 方法，无需额外修改
- [x] `store.ts` - ai-combination 特有属性已添加到 ShapeProps

## Canvas 集成

- [x] `Canvas.tsx` - `ToolType` 包含 `'ai-combination'`
- [x] `Canvas.tsx` - `placementTools` 数组包含 `'ai-combination'`
- [x] `Canvas.tsx` - 点击 ai-combination 工具创建新实例
- [x] `Canvas.tsx` - 新实例默认使用 `simple-tryon` 类型
- [x] `Canvas.tsx` - 新实例槽位初始为空状态

## Toolbar 集成

- [x] `Toolbar.tsx` - 添加了 Sparkles 图标和 AI换装 按钮
- [x] `Toolbar.tsx` - 快捷键设置为 U

## App 初始化

- [x] `App.tsx` - 导入并调用 `registerBuiltInTypes()` 初始化内置类型

## 交互功能

- [x] 工具栏正确显示 ai-combination 工具
- [x] 点击工具后画布上出现组件
- [x] 拖拽文件到槽位显示高亮
- [x] 释放后图片填充到槽位
- [x] 点击清除按钮恢复空状态
- [x] 点击执行按钮显示加载，2秒后显示结果
- [x] 选中组件显示蓝色边框
- [x] Delete 键可以删除组件

## 视觉检查点

- [x] 组件整体布局符合设计（Header、Slots、结果区）
- [x] 槽位边框样式正确（虚线、悬停高亮）
- [x] 执行按钮样式正确（圆形、蓝色、hover效果）
- [x] 结果图片显示为小缩略图
- [x] 错误提示以红色背景显示
