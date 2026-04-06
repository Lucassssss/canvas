/**
 * 项目管理相关类型定义
 * 
 * 核心概念：
 * - Project: 项目实体，包含画布数据和关联的会话
 * - CanvasData: 画布状态数据（shapes, viewport, selection）
 * - ProjectMetadata: 项目元数据（用于列表展示）
 */

import type { Conversation } from './index.js'

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
 * 项目完整数据
 */
export interface Project {
  /** 项目唯一标识 */
  id: string
  /** 用户ID */
  userId: string
  /** 项目名称 */
  name: string
  /** 项目版本号 */
  version: string
  /** 画布数据 */
  canvasData: CanvasData
  /** 缩略图（base64 或 URL） */
  thumbnail?: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 关联的会话列表 */
  conversations?: Conversation[]
}

/**
 * 项目元数据（用于列表展示）
 */
export interface ProjectMetadata {
  /** 项目唯一标识 */
  id: string
  /** 用户ID */
  userId: string
  /** 项目名称 */
  name: string
  /** 缩略图 */
  thumbnail?: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 关联的会话数量 */
  conversationCount: number
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
