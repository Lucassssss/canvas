# Joii 落地页设计规范文档

> 本文档详细记录 Joii 落地页的完整设计方案，涵盖设计理念、字体系统、色彩规范、布局结构、组件规范及技术实现。可作为未来设计迭代的核心参考文档。

---

## 目录

1. [设计理念与灵感来源](#1-设计理念与灵感来源)
2. [字体系统](#2-字体系统)
3. [色彩规范](#3-色彩规范)
4. [布局与网格系统](#4-布局与网格系统)
5. [组件规范](#5-组件规范)
6. [动效与交互规范](#6-动效与交互规范)
7. [技术实现](#7-技术实现)
8. [文件结构](#8-文件结构)

---

## 1. 设计理念与灵感来源

### 1.1 核心设计理念

本次落地页设计融合了**当代中文海报设计大师**的排版精髓与**现代电商 SaaS 产品**的简洁高效理念，追求以下设计目标：

| 设计维度 | 目标描述 |
|---------|---------|
| **文化气质** | 运用思源宋体营造优雅、文化感，体现东方设计美学 |
| **视觉冲击** | 巨大的中文标题作为视觉焦点，非对称布局打破常规 |
| **呼吸感** | 大量留白创造空间感，信息层次分明 |
| **现代感** | 思源黑体搭配精致的字间距 tracking，整体简洁有力 |

### 1.2 参考来源

**中文海报设计风格特征**：
- 思源宋体 + 思源黑体的衬线/无衬线对比
- 巨大标题文字占据视觉重心
- 非居中、非对称的编辑布局
- 编号系统（01, 02, 03...）作为视觉引导
- 克制的配色方案（黑白为主，少量强调色）
- 精心控制的字间距（tracking）

**现代电商 SaaS 特征**：
- 清晰的信息层级
- 突出的产品价值主张
- 社会证明（数据统计）
- 明确的行动号召（CTA）

### 1.3 设计风格定位

```
风格定位：Editorial / Magazine / Chinese Poster Hybrid
中文定位：编辑风 + 杂志排版 + 中文海报美学融合
适用场景：电商视觉 AI 产品落地页
品牌调性：专业、创新、文化、自信
```

---

## 2. 字体系统

### 2.1 字体选择

| 字体用途 | 字体名称 | 字重范围 | 回退字体 |
|---------|---------|---------|---------|
| 衬线标题 | Noto Serif SC（思源宋体） | 400, 500, 600, 700, 900 | Source Han Serif CN, 宋体 |
| 无衬线正文 | Noto Sans SC（思源黑体） | 300, 400, 500, 600, 700, 800, 900 | Source Han Sans CN, 黑体 |
| 英文字体 | Geist | latin subset | system-ui |

### 2.2 字体加载配置

```tsx
// apps/web/src/app/layout.tsx
import { Geist, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";

const notoSerif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-serif-zh',
});

const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans-zh',
});
```

### 2.3 CSS 字体变量定义

```css
/* apps/web/src/app/globals.css */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
               "Helvetica Neue", Arial, sans-serif, 
               var(--font-sans-zh), var(--font-serif-zh);
}

.font-serif-zh {
  font-family: var(--font-serif-zh), "Noto Serif SC", "Source Han Serif CN", "宋体", serif;
}

.font-sans-zh {
  font-family: var(--font-sans-zh), "Noto Sans SC", "Source Han Sans CN", "黑体", sans-serif;
}

.font-serif-display {
  font-family: var(--font-serif-zh), "Noto Serif SC", "Source Han Serif CN", "SimSun", serif;
  font-weight: 700;
  letter-spacing: 0.02em;
}
```

### 2.4 字体使用规范

#### 衬线标题（.font-serif-display）
- **用途**：大标题、功能名称、数字强调
- **字重**：700（bold）
- **字间距**：0.02em
- **示例**：`font-serif-display text-5xl md:text-7xl`

#### 无衬线正文（.font-sans-zh）
- **用途**：正文段落、导航、按钮文字
- **字重**：400-500（regular-medium）
- **示例**：`font-sans-zh text-base text-neutral-500`

#### 字间距规范

| 使用场景 | tracking 值 | Tailwind 类 |
|---------|------------|-------------|
| 大标题 | 0 | `tracking-tighter` |
| 小标签/分类 | 0.3em | `tracking-[0.3em]` |
| 编号系统 | 0.2em | `tracking-[0.2em]` |
| 按钮文字 | 0 | `tracking-wide` |
| 正文 | 0 | 默认 |

---

## 3. 色彩规范

### 3.1 主色板（Neutral Scale）

基于 Tailwind CSS neutral 色板，保持黑白灰的经典搭配：

| 用途 | 颜色值 | Tailwind 类 |
|-----|-------|------------|
| 纯黑文字 | `#09090b` | `text-neutral-950` |
| 深灰文字 | `#18181b` | `text-neutral-900` |
| 中灰文字 | `#3f3f46` | `text-neutral-600` |
| 浅灰文字 | `#71717a` | `text-neutral-500` |
| 更浅文字 | `#a1a1aa` | `text-neutral-400` |
| 背景白 | `#ffffff` | `bg-white` |
| 浅灰背景 | `#f4f4f5` | `bg-neutral-100` |
| 中灰背景 | `#e4e4e7` | `bg-neutral-200` |
| 深灰背景 | `#27272a` | `bg-neutral-800` |
| 纯黑背景 | `#09090b` | `bg-neutral-950` |

### 3.2 强调色（Accent Colors）

**靛蓝色系**（品牌主色）：

| 用途 | 颜色值 | Tailwind 类 |
|-----|-------|------------|
| 品牌主色 | `#4f46e5` | `text-indigo-600` |
| 浅品牌色 | `#6366f1` | `text-indigo-500` |
| 深品牌色 | `#4338ca` | `text-indigo-700` |
| 品牌背景 | `#eef2ff` | `bg-indigo-50` |

### 3.3 功能色

| 功能 | 颜色值 | Tailwind 类 | 用途 |
|-----|-------|------------|-----|
| 成功/在线 | `#22c55e` | `text-emerald-500` | 系统状态指示 |
| 链接/交互 | `#4f46e5` | `text-indigo-600` | 超链接、强调 |

### 3.4 背景配置规范

```css
/* 全站背景配置 */
:root {
  --color-background: #ffffff;
  --color-foreground: #09090b;
}
```

---

## 4. 布局与网格系统

### 4.1 容器宽度

| 断点 | 最大宽度 | Tailwind 类 |
|-----|---------|------------|
| 移动端 | 100% - 48px | `max-w-full px-6` |
| 平板+ | 1600px | `max-w-[1600px]` |

**页面容器**：
```tsx
<div className="max-w-[1600px] mx-auto px-6 md:px-12">
```

### 4.2 网格系统

采用 **12 列网格系统**，实现非对称布局：

```tsx
<div className="grid grid-cols-12 gap-6">
  {/* 左侧 7 列 */}
  <div className="col-span-12 lg:col-span-7">...</div>
  
  {/* 右侧 5 列 */}
  <div className="col-span-12 lg:col-span-5">...</div>
</div>
```

**常用列宽组合**：

| 布局场景 | 列宽配置 |
|---------|---------|
| Hero 左文字区 | `col-span-12 lg:col-span-7` |
| Hero 右图片区 | `col-span-12 lg:col-span-5 lg:col-start-8` |
| Feature 大卡片 | `col-span-12 md:col-span-5 md:row-span-2` |
| Feature 小卡片1 | `col-span-12 md:col-span-7` |
| Feature 小卡片2 | `col-span-12 md:col-span-4` |
| Feature 小卡片3 | `col-span-12 md:col-span-3` |
| Footer 列1 | `col-span-12 md:col-span-5` |
| Footer 列2-4 | `col-span-6 md:col-span-2` |

### 4.3 间距规范

| 元素 | 垂直间距 | Tailwind 类 |
|-----|---------|------------|
| Section 内边距 | 96px / 128px | `py-24 md:py-32` |
| Section 标题与内容 | 80px / 128px | `mb-20 md:mb-32` |
| 卡片内边距 | 32px / 48px | `p-8 md:p-12` |
| 元素间距（常规） | 24px | `gap-6` |
| 元素间距（紧凑） | 12px | `gap-3` |

### 4.4 响应式断点

| 断点 | 屏幕宽度 | Tailwind 前缀 |
|-----|---------|--------------|
| 手机 | < 640px | 默认 |
| 平板 | ≥ 640px | `sm:` |
| 平板横屏+ | ≥ 768px | `md:` |
| 笔记本 | ≥ 1024px | `lg:` |
| 桌面 | ≥ 1280px | `xl:` |

---

## 5. 组件规范

### 5.1 导航栏（NavbarCN）

**设计规范**：

| 属性 | 值 |
|-----|---|
| 高度 | 64px / 80px（桌面） |
| 背景 | `bg-white/90 backdrop-blur-md` |
| 边框 | `border-b border-neutral-100` |
| 定位 | `fixed top-0 left-0 right-0 z-50` |

**代码实现**：
```tsx
<header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/90 backdrop-blur-md z-50 border-b border-neutral-100">
  <div className="max-w-[1600px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
    {/* Logo */}
    <Link href="/" className="flex items-center">
      <img src="/joii_logo_fa.svg" alt="Joii" className="h-6" />
    </Link>
    
    {/* 导航链接 */}
    <nav className="hidden md:flex items-center gap-8 font-sans-zh text-sm text-neutral-500">
      <Link href="#features">核心能力</Link>
      <Link href="#showcase">商业案例</Link>
      <Link href="/news">最新资讯</Link>
      <Link href="/help">帮助支持</Link>
    </nav>
    
    {/* CTA 按钮 */}
    <div className="flex items-center gap-6">
      <Link href="/login" className="hidden md:block">登录</Link>
      <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950 text-white">
        开始免费使用
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  </div>
</header>
```

### 5.2 Hero 区域（HeroSectionCN）

**设计规范**：

| 属性 | 值 |
|-----|---|
| 背景 | 白色 + 右侧浅灰装饰 |
| 内边距 | 96px top / 64px bottom（移动），128px top / 96px bottom（桌面） |
| 标题字号 | 5xl（移动）/ 7xl（桌面）/ 5.5rem（大屏） |

**布局结构**：
```
┌─────────────────────────────────────────────────┐
│  电商视觉 AI 革命                                  │  ← 小标签 tracking-[0.3em]
├─────────────────────────────────────────────────┤
│  智能                                              │  ← 大标题 衬线体
│  换装                                              │
│  无限                                              │
├─────────────────────────────────────────────────┤
│  基于大模型的电商视觉基础设施...                      │  ← 描述文字
├─────────────────────────────────────────────────┤
│  [开始创作]  v1.1.0 现已发布                        │  ← CTA + 版本信息
├─────────────────────────┬───────────────────────┤
│                          │                       │
│                          │     [产品图片]         │
│                          │                       │
│                          │     01                │
└─────────────────────────┴───────────────────────┘
│  300%    │  4K     │  ∞      │  10x               │  ← 数据统计
└─────────────────────────────────────────────────┘
```

**代码实现**：
```tsx
<section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-white text-neutral-950">
  {/* 右侧装饰 */}
  <div className="absolute top-0 right-0 w-1/2 h-full bg-neutral-100/50" />
  
  <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative">
    <div className="grid grid-cols-12 gap-6 items-start">
      {/* 左侧文字区 */}
      <div className="col-span-12 lg:col-span-7">
        <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-8">
          电商视觉 AI 革命
        </div>
        
        <h1 className="font-serif-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight mb-6">
          <span className="block">智能</span>
          <span className="block font-sans-zh font-extralight italic text-neutral-400">换装</span>
          <span className="block">无限</span>
        </h1>
        
        <p className="font-sans-zh text-base md:text-lg text-neutral-500 max-w-md mb-12 leading-relaxed">
          基于大模型的电商视觉基础设施，打破创意边界。物理级贴合，4K无损放大，让每一帧都成为可能。
        </p>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-950 text-white font-sans-zh font-medium text-sm">
            <span>开始创作</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-xs font-sans-zh text-neutral-400 tracking-wider">v1.1.0 现已发布</span>
        </div>
      </div>
      
      {/* 右侧图片区 */}
      <div className="col-span-12 lg:col-span-5 lg:col-start-8">
        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden group">
          {/* 图片 + hover 效果 */}
        </div>
      </div>
    </div>
    
    {/* 数据统计 */}
    <div className="mt-24 md:mt-32 pt-12 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <div className="font-serif-display text-3xl md:text-4xl">300%</div>
        <div className="font-sans-zh text-xs text-neutral-400 tracking-wider">贴合度提升</div>
      </div>
      {/* ... 其他数据 */}
    </div>
  </div>
</section>
```

### 5.3 功能区域（FeatureSectionCN）

**设计规范**：

采用 **Bento Grid**（便当盒式）布局，混合不同尺寸的功能卡片：

```
┌─────────────────────┬───────────────────────────┐
│                     │                           │
│   01 智能换装 2.0    │      02 4K 无损放大        │
│                     │                     4K    │
│   [深色背景卡片]     │      [白色背景卡片]        │
│   (5列 x 2行)       │      (7列)                │
│                     ├───────────────────────────┤
│                     │                │          │
│                     │   03 无限画布  │ 04 云端   │
│                     │                │          │
└─────────────────────┴────────────────┴──────────┘
```

**卡片设计**：

| 卡片类型 | 背景色 | 文字色 | 边框 |
|--------|-------|-------|-----|
| 强调卡片 | `bg-neutral-950` | 白色 | 无 |
| 白色卡片 | `bg-white` | `neutral-950` | `border-neutral-200` |

**代码实现**：
```tsx
<section id="features" className="py-24 md:py-32 bg-neutral-100 text-neutral-950">
  <div className="max-w-[1600px] mx-auto px-6 md:px-12">
    {/* 标题区 */}
    <div className="mb-20 md:mb-32">
      <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-4">
        核心能力
      </div>
      <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
        为电商视觉<br />
        <span className="font-sans-zh font-extralight italic text-neutral-400">重新定义</span><br />
        创作工作流
      </h2>
    </div>

    {/* Bento Grid */}
    <div className="grid grid-cols-12 gap-6">
      {/* 大卡片 - 深色 */}
      <div className="col-span-12 md:col-span-5 md:row-span-2 bg-neutral-950 text-white p-8 md:p-12">
        <div className="text-xs tracking-[0.2em] uppercase mb-8">01</div>
        <ImageIcon className="w-10 h-10 mb-6" />
        <h3 className="font-serif-display text-3xl md:text-4xl mb-4">
          智能换装<span className="text-xs font-normal text-neutral-400 ml-2">2.0</span>
        </h3>
        <p className="text-neutral-300 leading-relaxed">物理级贴合，精准识别衣服材质...</p>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-t from-indigo-500/20 to-transparent" />
      </div>
      
      {/* 其他卡片... */}
    </div>
  </div>
</section>
```

### 5.4 案例展示（ShowcaseSectionCN）

**设计规范**：

| 属性 | 值 |
|-----|---|
| 背景 | `bg-white` |
| 卡片比例 | `aspect-[3/4]`（竖长方形） |
| 卡片间距 | 24px / 32px |

**代码实现**：
```tsx
<section id="showcase" className="py-24 md:py-32 bg-white text-neutral-950">
  <div className="max-w-[1600px] mx-auto px-6 md:px-12">
    <div className="mb-16 md:mb-24 grid grid-cols-12 gap-6 items-end">
      <div className="col-span-12 md:col-span-6">
        <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl">
          赋能<br />
          <span className="font-sans-zh font-extralight italic text-neutral-400">商业视觉</span>
        </h2>
      </div>
      <div className="col-span-12 md:col-span-6 md:text-right">
        <p className="font-sans-zh text-neutral-500 max-w-md ml-auto">
          探索顶尖商家如何利用 Joii 突破内容产出瓶颈...
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {cases.map((item) => (
        <div key={item.number} className="group cursor-pointer">
          <div className="relative aspect-[3/4] mb-4 md:mb-6">
            <div className="absolute top-4 left-4 w-8 h-8 border border-neutral-400/30 flex items-center justify-center font-mono text-[10px]">
              {item.number}
            </div>
          </div>
          <h3 className="font-serif-zh text-base md:text-lg font-medium">{item.title}</h3>
          <p className="font-sans-zh text-xs text-neutral-400 tracking-wider">{item.type}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### 5.5 资讯区域（NewsSectionCN）

**设计规范**：

- 白色卡片
- 左上角装饰性直角边框
- 编号系统

**代码实现**：
```tsx
<section className="py-24 md:py-32 bg-neutral-100 text-neutral-950">
  <div className="max-w-[1600px] mx-auto px-6 md:px-12">
    <div className="mb-16 md:mb-24 grid grid-cols-12 gap-6 items-end">
      <div className="col-span-12 md:col-span-5">
        <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl">
          Updates<span className="font-sans-zh font-extralight italic text-neutral-400">.</span>
        </h2>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {NEWS_ITEMS.map((item, index) => (
        <article key={item.id} className="relative bg-white p-8 md:p-12">
          {/* 装饰边框 */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-neutral-200" />
          
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs text-neutral-300">{String(index + 1).padStart(2, '0')}</span>
            <span className="font-sans-zh text-xs text-neutral-400 tracking-wider uppercase">{item.category}</span>
          </div>
          
          <h3 className="font-serif-zh text-xl md:text-2xl font-medium mb-4">{item.title}</h3>
          <p className="font-sans-zh text-neutral-500 text-sm leading-relaxed mb-6 line-clamp-2">{item.excerpt}</p>
          
          <div className="flex items-center justify-between">
            <time className="font-sans-zh text-xs text-neutral-400">{item.date}</time>
            <Link href={`/news/${item.id}`} className="inline-flex items-center gap-2 font-sans-zh text-xs">
              <span>阅读更多</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>
```

### 5.6 CTA 区域

**设计规范**：

| 属性 | 值 |
|-----|---|
| 背景 | `bg-neutral-950`（深色） |
| 文字 | 白色 |
| 按钮样式 | 白色背景 + 深色文字 |
| 装饰 | 模糊渐变光晕 |

**代码实现**：
```tsx
<section className="py-24 md:py-32 bg-neutral-950 text-white relative overflow-hidden">
  {/* 背景装饰 */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] -z-10" />
  
  <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center">
    <h2 className="font-serif-display text-4xl md:text-5xl lg:text-7xl mb-8">
      开始<br />
      <span className="font-sans-zh font-extralight italic text-neutral-400">创作</span><br />
      今日
    </h2>
    <p className="font-sans-zh text-neutral-400 mb-12 max-w-md mx-auto">
      体验 Joii 带来的电商视觉革命，让每一帧都成为可能
    </p>
    <Link href="/dashboard" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-neutral-950 font-sans-zh font-medium text-sm">
      <span>启动 Joii</span>
      <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
</section>
```

### 5.7 页脚（FooterCN）

**设计规范**：

| 属性 | 值 |
|-----|---|
| 背景 | `bg-white` |
| 上边框 | `border-t border-neutral-200` |
| 上内边距 | 80px |

**代码实现**：
```tsx
<footer className="bg-white pt-20 pb-12 px-6 md:px-12 border-t border-neutral-200 text-neutral-950">
  <div className="max-w-[1600px] mx-auto">
    <div className="grid grid-cols-12 gap-12 mb-20">
      {/* Logo + 描述 */}
      <div className="col-span-12 md:col-span-5">
        <img src="/joii_logo_fa.svg" alt="Joii" className="h-8 mb-6" />
        <p className="font-sans-zh text-neutral-500 max-w-sm text-sm leading-relaxed mb-6">
          Joii 致力于为电商设计师和商家提供基于前沿大模型的视觉创作工具...
        </p>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>系统运行正常</span>
        </div>
      </div>
      
      {/* 链接列 */}
      <div className="col-span-6 md:col-span-2 md:col-start-7">
        <h4 className="font-sans-zh font-medium text-xs text-neutral-400 tracking-widest uppercase mb-6">产品</h4>
        <ul className="space-y-4 font-sans-zh text-sm text-neutral-600">
          <li><Link href="/dashboard">智能换装</Link></li>
          {/* ... */}
        </ul>
      </div>
      {/* ... 其他列 */}
    </div>
    
    {/* 底部栏 */}
    <div className="pt-8 border-t border-neutral-200 flex items-center justify-between">
      <p className="font-sans-zh text-xs text-neutral-400">© 2026 Joii AI Inc.</p>
      <div className="flex items-center gap-6">
        <a href="#" className="font-sans-zh text-xs text-neutral-400">中文</a>
        <a href="#" className="font-sans-zh text-xs text-neutral-400">English</a>
        <a href="#" className="font-sans-zh text-xs text-neutral-400">日本語</a>
      </div>
    </div>
  </div>
</footer>
```

---

## 6. 动效与交互规范

### 6.1 过渡动画

| 动画类型 | 时长 | 缓动函数 | Tailwind 类 |
|---------|-----|---------|------------|
| 颜色过渡 | 300ms | ease-in-out | `transition-colors` |
| 变换过渡 | 300ms | ease-in-out | `transition-transform` |
| 位移过渡 | 300ms | ease-in-out | `transition-transform` |
| 悬停缩放 | 300ms | ease-out | `hover:scale-105` |
| 激活缩放 | 150ms | ease-in-out | `active:scale-95` |

### 6.2 悬停效果

**按钮悬停**：
```tsx
<Link className="bg-neutral-950 text-white hover:bg-neutral-800 transition-colors">
```

**文字悬停**：
```tsx
<span className="group-hover:text-neutral-600 transition-colors">
```

**箭头位移**：
```tsx
<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
```

### 6.3 图片效果

**Hero 图片悬停**：
```tsx
<div 
  className="opacity-80 group-hover:opacity-90 transition-opacity duration-700 
         grayscale group-hover:grayscale-0"
  style={{ backgroundImage: 'url(...)' }}
/>
```

### 6.4 背景效果

**渐变光晕**：
```tsx
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] -z-10" />
```

---

## 7. 技术实现

### 7.1 技术栈

| 技术 | 版本/说明 |
|-----|---------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4 |
| 图标 | Lucide React |
| 字体加载 | next/font/google |

### 7.2 项目结构

```
apps/web/src/
├── app/
│   ├── layout.tsx          # 字体配置、全局布局
│   ├── page.tsx            # 落地页入口
│   └── globals.css         # 全局样式、字体变量
│
└── features/
    └── landing/
        ├── LandingPageCN.tsx          # 主组件
        └── components/
            ├── NavbarCN.tsx          # 导航栏
            ├── HeroSectionCN.tsx      # 首屏区域
            ├── FeatureSectionCN.tsx   # 功能区域
            ├── ShowcaseSectionCN.tsx  # 案例展示
            ├── NewsSectionCN.tsx     # 资讯区域
            └── FooterCN.tsx          # 页脚
```

### 7.3 字体配置完整代码

**layout.tsx**：
```tsx
import type { Metadata } from 'next'
import './globals.css'
import { Geist, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'], variable:'--font-sans'});
const notoSerif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-serif-zh',
});
const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans-zh',
});

export const metadata: Metadata = {
  title: 'Joii - 无限画布智能设计平台',
  description: 'Joii电商AI神器，让爆单轻松发生',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={cn("font-sans", geist.variable, notoSerif.variable, notoSans.variable)}>
      <body>
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 7.4 全局样式

**globals.css**：
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme {
  --color-background: #ffffff;
  --color-foreground: #09090b;
  /* ... 其他主题变量 */
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
               "Helvetica Neue", Arial, sans-serif, 
               var(--font-sans-zh), var(--font-serif-zh);
  background-color: var(--color-background);
  color: var(--color-foreground);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.font-serif-zh {
  font-family: var(--font-serif-zh), "Noto Serif SC", "Source Han Serif CN", "宋体", serif;
}

.font-sans-zh {
  font-family: var(--font-sans-zh), "Noto Sans SC", "Source Han Sans CN", "黑体", sans-serif;
}

.font-serif-display {
  font-family: var(--font-serif-zh), "Noto Serif SC", "Source Han Serif CN", "SimSun", serif;
  font-weight: 700;
  letter-spacing: 0.02em;
}
```

---

## 8. 文件结构

### 8.1 落地页组件列表

| 文件名 | 组件名 | 功能描述 |
|-------|--------|---------|
| `LandingPageCN.tsx` | LandingPageCN | 落地页主容器，整合所有区域组件 |
| `NavbarCN.tsx` | NavbarCN | 固定顶部导航栏 |
| `HeroSectionCN.tsx` | HeroSectionCN | 首屏区域：大标题 + 产品图 + 数据统计 |
| `FeatureSectionCN.tsx` | FeatureSectionCN | 功能展示：Bento Grid 布局 |
| `ShowcaseSectionCN.tsx` | ShowcaseSectionCN | 商业案例：4列网格展示 |
| `NewsSectionCN.tsx` | NewsSectionCN | 最新资讯：2列文章卡片 |
| `FooterCN.tsx` | FooterCN | 页脚：链接列表 + 版权信息 |

### 8.2 入口配置

**page.tsx**：
```tsx
import { LandingPageCN } from '@/features/landing/LandingPageCN'

export default function Page() {
  return <LandingPageCN />
}
```

---

## 附录：快速参考卡片

### 字体类名速查

| 类名 | 用途 | 典型使用 |
|-----|-----|---------|
| `font-serif-display` | 衬线标题 | 大标题、功能名、数字 |
| `font-sans-zh` | 黑体正文 | 正文、按钮、导航 |
| `font-serif-zh` | 宋体强调 | 文章标题、引用 |
| `tracking-[0.3em]` | 宽字间距 | 分类标签 |
| `tracking-[0.2em]` | 中字间距 | 编号系统 |

### 背景色速查

| Tailwind 类 | 用途 |
|------------|-----|
| `bg-white` | 亮色区域背景 |
| `bg-neutral-100` | 浅灰背景（交替区域） |
| `bg-neutral-950` | 深色背景（强调区域） |

### 文字色速查

| Tailwind 类 | 用途 |
|------------|-----|
| `text-neutral-950` | 主标题、强调文字 |
| `text-neutral-600` | 正文、描述 |
| `text-neutral-400` | 次要信息、标签 |
| `text-indigo-600` | 链接、强调色 |

---

**文档版本**：v1.0  
**创建日期**：2026-04-05  
**维护者**：Joii Design Team  
**下次更新**：根据产品迭代需求
