# 适合屏幕功能修复说明

## 问题分析

### 原始问题
执行"适合屏幕"功能后，画布内容不可见，偏离到了很远的位置。

### 根本原因
`zoomToFit()` 方法中的坐标计算公式错误：

```typescript
// ❌ 错误的公式
x: viewportWidth / 2 / zoom - centerX
y: viewportHeight / 2 / zoom - centerY
```

这个公式混淆了两个坐标系统：
1. **屏幕坐标系**：相对于浏览器窗口的像素坐标
2. **画布坐标系**：无限制范围画布上的逻辑坐标

### 坐标系统关系
视口变换矩阵使用以下公式：
```
screenX = canvasX * zoom + viewportX
screenY = canvasY * zoom + viewportY
```

反推得到视口偏移：
```
viewportX = screenX - canvasX * zoom
viewportY = screenY - canvasY * zoom
```

## 修复方案

### 关键改进

1. **正确的侧边栏宽度计算**
   ```typescript
   const sidebarWidth = 64 + 320  // 左侧工具栏(64px) + 右侧面板(320px)
   ```

2. **正确的屏幕中心计算**
   ```typescript
   const screenCenterX = viewportWidth / 2
   const screenCenterY = (viewportHeight / 2) + topOffset
   ```

3. **正确的视口偏移公式**
   ```typescript
   const x = screenCenterX - contentCenterX * zoom
   const y = screenCenterY - contentCenterY * zoom
   ```

### 修复后的逻辑流程

1. 计算所有形状的边界框 (minX, minY, maxX, maxY)
2. 计算内容的中心点和尺寸
3. 计算合适的缩放比例（不超过 1 倍）
4. 计算屏幕中心位置（考虑 UI 偏移）
5. 使用正确的公式计算视口偏移，使内容中心对齐到屏幕中心

## 受影响的方法

修复了以下三个方法：
- `zoomToFit()` - 适合屏幕功能
- `zoomToArea()` - 缩放到指定区域（Logo 编辑）
- `focusOnArea()` - 聚焦到指定区域

## 锚点说明

当前系统使用**中心点作为锚点**：
- 每个形状的锚点是其中心：`(x + width/2, y + height/2)`
- 视口变换也以中心对齐的方式工作
- 这确保了缩放和平移的一致性

## 测试建议

1. 创建多个形状在不同位置
2. 点击"适合屏幕"按钮
3. 验证所有形状都可见且居中
4. 验证缩放比例合理（不会过度放大或缩小）
5. 测试不同窗口大小下的行为


---

## 缩放锚点问题修复

### 问题描述
缩放时不是围绕鼠标位置（屏幕中心）进行，而是往左上角或右下角偏移。

### 根本原因
1. **CSS transform-origin 问题**：`.canvas-viewport` 设置了 `transform-origin: 0 0`（左上角），虽然我们使用 matrix 变换不应该受影响，但这是不必要的
2. **变量命名混淆**：代码中 `mouseX` 和 `mouseY` 的含义不清楚，容易导致理解错误

### 修复方案

#### 1. 移除不必要的 transform-origin
```css
/* 删除这一行 */
transform-origin: 0 0;
```

#### 2. 改进缩放逻辑的注释和变量名
```javascript
const rect = container.getBoundingClientRect()
// 鼠标在容器内的屏幕坐标
const screenMouseX = e.clientX - rect.left
const screenMouseY = e.clientY - rect.top

// 鼠标在画布上的坐标（使用当前缩放和偏移）
const canvasX = (screenMouseX - viewport.x) / viewport.zoom
const canvasY = (screenMouseY - viewport.y) / viewport.zoom

// 计算新的视口偏移，使鼠标位置在新缩放下保持不变
// 公式：screenMouse = canvasPoint * newZoom + newViewportOffset
// 所以：newViewportOffset = screenMouse - canvasPoint * newZoom
setViewport({
  zoom: newZoom,
  x: screenMouseX - canvasX * newZoom,
  y: screenMouseY - canvasY * newZoom,
})
```

### 缩放原理

缩放时需要保持鼠标指向的画布点不变：

1. **获取鼠标位置**
   - 屏幕坐标：`(screenMouseX, screenMouseY)`
   - 画布坐标：`(canvasX, canvasY) = (screenMouse - viewportOffset) / zoom`

2. **计算新的视口偏移**
   - 目标：新缩放下，同一个画布点应该在同一个屏幕位置
   - 公式：`screenMouse = canvasPoint * newZoom + newViewportOffset`
   - 推导：`newViewportOffset = screenMouse - canvasPoint * newZoom`

3. **结果**
   - 缩放时鼠标指向的内容保持在鼠标下方
   - 缩放围绕鼠标位置进行，而不是左上角

### 测试步骤

1. 在画布中心放置一个形状
2. 将鼠标移到形状上
3. 使用 Cmd/Ctrl + 滚轮缩放
4. 验证形状始终在鼠标下方
5. 尝试在不同位置缩放，确保都围绕鼠标进行
