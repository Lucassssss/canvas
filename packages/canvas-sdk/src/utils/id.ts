/**
 * 生成唯一 ID
 * @param prefix ID 前缀，默认为 'id'
 * @returns 格式: "prefix_abc123" 的唯一字符串
 */
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}${randomPart}`
}

/**
 * 生成 UUID v4
 * @returns 标准 UUID v4 格式字符串
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
