# Checklist

## SDK 包结构

- [x] SDK 包目录结构符合规范（core、shapes、events、react 等模块分离）
- [x] package.json 配置正确（name、version、exports、dependencies）
- [x] tsconfig.json 配置为严格模式
- [x] 构建脚本支持 ESM 和 CJS 两种格式
- [x] 入口文件 src/index.ts 正确导出所有公共 API

## 基础原语

- [x] Vec 类实现完整（加减乘除、点积、叉积、归一化、距离计算）
- [x] Box 类实现完整（边界计算、相交判断、合并、包含判断）
- [x] Matrix 类实现完整（2D 变换、缩放、旋转、平移、逆矩阵）
- [ ] 所有原语类有对应的单元测试

## 工具函数

- [x] ID 生成器 generateId() 实现并测试
- [x] 几何计算函数实现（点在矩形内、边界框计算、旋转边界）
- [x] DOM 操作工具实现（元素位置、坐标转换）

## 状态管理

- [x] 核心状态类型定义完整（shapes、selectedIds、viewport）
- [x] Store 类实现状态订阅机制
- [x] Store 支持批量更新
- [x] 状态变更触发对应事件

## 历史管理

- [x] HistoryManager 实现 undo/redo 功能
- [x] 历史记录数量可配置（默认 50 条）
- [x] undo/redo 触发对应事件

## Editor 核心

- [x] Editor 接口类型定义完整
- [x] Editor 构造函数支持配置选项
- [x] Editor mount/unmount 生命周期正确实现
- [x] Editor 集成 Store 和 HistoryManager

## 形状管理 API

- [x] createShape() 正确创建形状并触发事件
- [x] updateShape() 正确更新形状并触发事件
- [x] deleteShape() 正确删除形状并触发事件
- [x] getShape() 和 getShapes() 返回正确数据
- [x] getShapesByType() 按类型筛选形状

## 选择管理 API

- [x] select() 正确设置选择状态
- [x] deselect() 正确清除选择状态
- [x] getSelectedShapes() 返回选中的形状
- [x] 选择变化触发 selection:change 事件

## 视口管理 API

- [x] getViewport()/setViewport() 正确操作视口
- [x] zoomIn()/zoomOut() 正确缩放
- [x] zoomToFit() 自动适应所有形状
- [x] zoomToShape() 聚焦指定形状
- [x] panTo() 平移到指定位置
- [x] screenToCanvas()/canvasToScreen() 坐标转换正确

## 事件系统

- [x] EditorEvents 类型定义完整
- [x] EventEmitter 类实现 on/off/once 方法
- [x] on() 返回取消订阅函数
- [x] 所有核心操作触发对应事件

## Shape 系统

- [x] ShapeUtil 接口定义完整
- [x] ShapeProps 基础类型定义
- [x] ShapeRenderContext 类型定义
- [x] ShapeRegistry 实现注册和获取 ShapeUtil

## 内置形状

- [x] RectangleShapeUtil 实现
- [x] EllipseShapeUtil 实现
- [x] TextShapeUtil 实现
- [x] ImageShapeUtil 实现
- [x] GroupShapeUtil 实现

## React 集成

- [x] EditorContext 和 EditorProvider 实现
- [x] useEditor() Hook 返回 Editor 实例
- [x] useShape() Hook 响应式订阅形状
- [x] useShapes() Hook 响应式订阅形状列表
- [x] useSelection() Hook 响应式订阅选择状态
- [x] useViewport() Hook 响应式订阅视口状态

## Canvas 组件

- [x] Canvas 组件正确渲染画布
- [x] 视口变换使用 CSS matrix() 实现
- [x] ShapeRenderer 正确渲染所有注册的形状
- [x] SelectionBox 正确显示选择框

## 交互功能

- [x] 单击选择形状功能正常
- [x] Shift + 点击多选功能正常
- [ ] 框选功能正常
- [ ] 形状拖拽移动功能正常
- [ ] 形状缩放功能正常（8 个控制点）
- [ ] 形状旋转功能正常（旋转手柄）
- [x] 视口平移功能正常（鼠标拖拽、滚轮）
- [x] 视口缩放功能正常（滚轮、快捷键）

## 导出功能

- [x] exportToJSON() 正确导出画布状态
- [x] importFromJSON() 正确导入画布状态
- [ ] exportToImage() 正确导出图片

## TypeScript 支持

- [x] 所有公共 API 有完整的类型定义
- [x] 类型定义正确导出
- [x] 泛型支持（createShape<T>, getShape<T>）

## 文档

- [x] README.md 包含安装和使用说明
- [ ] API 文档完整
- [ ] 使用示例可运行

## 测试

- [ ] Editor 单元测试覆盖核心功能
- [ ] Store 单元测试覆盖状态管理
- [ ] Shape 系统测试覆盖形状操作
- [ ] React 组件测试覆盖渲染和交互

## 应用层迁移

- [ ] apps/ai_draw/client 正确依赖 SDK
- [ ] ClothingShape 迁移到应用层并使用 SDK API
- [ ] 业务组件使用 SDK API
- [ ] 无重复代码

## 性能验证

- [ ] 首次渲染时间 < 100ms
- [ ] 形状操作响应 < 16ms (60fps)
- [ ] 支持 1000+ 形状无明显卡顿
- [ ] 包体积 (gzip) < 50KB
