/**
 * 获取元素相对于视口的位置
 * @param element HTML 元素
 * @returns 元素相对于视口的位置 { x, y }
 */
export function getElementOffset(element: HTMLElement): { x: number; y: number } {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left,
    y: rect.top,
  }
}

/**
 * 将屏幕坐标转换为元素内坐标
 * @param screenX 屏幕 X 坐标
 * @param screenY 屏幕Y 坐标
 * @param element HTML 元素
 * @returns 元素内坐标 { x, y }
 */
export function screenToElement(
  screenX: number,
  screenY: number,
  element: HTMLElement
): { x: number; y: number } {
  const rect = element.getBoundingClientRect()
  return {
    x: screenX - rect.left,
    y: screenY - rect.top,
  }
}

/**
 * 将元素内坐标转换为屏幕坐标
 * @param elementX 元素内 X 坐标
 * @param elementY 元素内 Y 坐标
 * @param element HTML 元素
 * @returns 屏幕坐标 { x, y }
 */
export function elementToScreen(
  elementX: number,
  elementY: number,
  element: HTMLElement
): { x: number; y: number } {
  const rect = element.getBoundingClientRect()
  return {
    x: elementX + rect.left,
    y: elementY + rect.top,
  }
}

/**
 * 检测是否支持触摸
 * @returns 是否支持触摸
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * 阻止默认事件
 * @param e 事件对象
 */
export function preventDefault(e: Event): void {
  e.preventDefault()
}

/**
 * 停止事件传播
 * @param e 事件对象
 */
export function stopPropagation(e: Event): void {
  e.stopPropagation()
}

/**
 * 阻止事件冒泡和默认行为
 * @param e 事件对象
 */
export function stopEvent(e: Event): void {
  e.preventDefault()
  e.stopPropagation()
}

/**
 * 获取鼠标/触摸事件的坐标
 * @param e 鼠标或触摸事件
 * @returns 坐标 { x, y }
 */
export function getEventPosition(
  e: MouseEvent | TouchEvent | PointerEvent
): { x: number; y: number } {
  if ('touches' in e && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }

  if ('clientX' in e) {
    return {
      x: e.clientX,
      y: e.clientY,
    }
  }

  return { x: 0, y: 0 }
}

/**
 * 获取元素的计算样式
 * @param element HTML 元素
 * @param property CSS 属性名
 * @returns CSS 属性值
 */
export function getComputedStyleValue(
  element: HTMLElement,
  property: string
): string {
  return window.getComputedStyle(element).getPropertyValue(property)
}

/**
 * 设置元素的 CSS 变量
 * @param element HTML 元素
 * @param name 变量名（不含 --）
 * @param value 变量值
 */
export function setCSSVariable(
  element: HTMLElement,
  name: string,
  value: string
): void {
  element.style.setProperty(`--${name}`, value)
}

/**
 * 获取元素的 CSS 变量
 * @param element HTML 元素
 * @param name 变量名（不含 --）
 * @returns 变量值
 */
export function getCSSVariable(element: HTMLElement, name: string): string {
  return getComputedStyleValue(element, `--${name}`)
}

/**
 * 检测元素是否可见
 * @param element HTML 元素
 * @returns 是否可见
 */
export function isElementVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  )
}

/**
 * 获取元素的滚动位置
 * @param element HTML 元素，默认为 document
 * @returns 滚动位置 { x, y }
 */
export function getScrollPosition(
  element?: HTMLElement | null
): { x: number; y: number } {
  if (element) {
    return {
      x: element.scrollLeft,
      y: element.scrollTop,
    }
  }

  return {
    x: window.scrollX || document.documentElement.scrollLeft,
    y: window.scrollY || document.documentElement.scrollTop,
  }
}

/**
 * 设置元素的滚动位置
 * @param x X 坐标
 * @param y Y 坐标
 * @param element HTML 元素，默认为 window
 */
export function setScrollPosition(
  x: number,
  y: number,
  element?: HTMLElement | null
): void {
  if (element) {
    element.scrollLeft = x
    element.scrollTop = y
  } else {
    window.scrollTo(x, y)
  }
}

/**
 * 平滑滚动到指定位置
 * @param x 目标 X 坐标
 * @param y 目标 Y 坐标
 * @param element HTML 元素，默认为 window
 */
export function smoothScrollTo(
  x: number,
  y: number,
  element?: HTMLElement | null
): void {
  if (element) {
    element.scrollTo({
      left: x,
      top: y,
      behavior: 'smooth',
    })
  } else {
    window.scrollTo({
      left: x,
      top: y,
      behavior: 'smooth',
    })
  }
}

/**
 * 获取视口尺寸
 * @returns 视口尺寸 { width, height }
 */
export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * 获取元素相对于文档的位置
 * @param element HTML 元素
 * @returns 相对于文档的位置 { x, y }
 */
export function getElementDocumentOffset(
  element: HTMLElement
): { x: number; y: number } {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
  }
}
