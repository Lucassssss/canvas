/**
 * 前端项目管理类型定义
 * 
 * 与后端类型保持一致
 */

/**
 * 画布数据结构
 */
export interface CanvasData {
  /** 画布上的所有形状元素 */
  shapes: any[]
  /** 视口状态（位置和缩放） */
  viewport: {
    x: number
    y: number
    zoom: number
  }
  /** 当前选中的元素 ID 列表 */
  selectedIds: string[]
  /** 历史记录（可选） */
  history?: any[]
}

/**
 * 会话信息
 */
export interface Conversation {
  id: string
  title: string
  model: string
  mode: string
  createdAt: number
  updatedAt: number
}

/**
 * 项目完整数据
 */
export interface Project {
  /** 项目唯一标识 */
  id: string
  /** 项目名称 */
  name: string
  /** 项目版本号 */
  version: string
  /** 画布数据 */
  canvasData: CanvasData
  /** 缩略图（base64 或 URL） */
  thumbnail?: string
  /** 创建时间戳 */
  createdAt: number
  /** 更新时间戳 */
  updatedAt: number
  /** 关联的会话列表 */
  conversations?: Conversation[]
}

/**
 * 项目元数据（用于列表展示）
 */
export interface ProjectMetadata {
  /** 项目唯一标识 */
  id: string
  /** 项目名称 */
  name: string
  /** 缩略图 */
  thumbnail?: string
  /** 创建时间戳 */
  createdAt: number
  /** 更新时间戳 */
  updatedAt: number
  /** 关联的会话数量 */
  conversationCount: number
}

/**
 * API 响应类型
 */
export interface ApiResponse<T = any> {
  success?: boolean
  error?: string
  message?: string
  data?: T
}

/**
 * 创建项目的参数
 */
export interface CreateProjectParams {
  name?: string
  canvasData?: CanvasData
}

/**
 * 更新项目的参数
 */
export interface UpdateProjectParams {
  name?: string
  canvasData?: CanvasData
  thumbnail?: string
}
