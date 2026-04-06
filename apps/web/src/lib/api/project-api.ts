/**
 * 项目管理 API 客户端
 * 
 * 封装所有与项目相关的 HTTP 请求
 * 纯前端实现，所有请求都发送到独立的后端 API 服务
 */

import type {
  Project,
  ProjectMetadata,
  CanvasData,
  Conversation,
  CreateProjectParams,
  UpdateProjectParams,
} from '@/types/project'

// API 基础地址，从环境变量读取
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * API 错误类
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * 处理 API 响应
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(
      error.error || error.message || 'Request failed',
      response.status,
      error
    )
  }
  return response.json()
}

/**
 * 项目 API 客户端
 */
export const projectApi = {
  /**
   * 获取所有项目列表
   */
  async getProjects(): Promise<ProjectMetadata[]> {
    console.log('[Project API] Fetching projects')
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      cache: 'no-store',
      credentials: 'include',
    })
    return handleResponse<ProjectMetadata[]>(response)
  },

  /**
   * 获取单个项目详情
   */
  async getProject(id: string): Promise<Project> {
    console.log(`[Project API] Fetching project: ${id}`)
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      cache: 'no-store',
      credentials: 'include',
    })
    return handleResponse<Project>(response)
  },

  /**
   * 创建新项目
   */
  async createProject(params: CreateProjectParams = {}): Promise<{ id: string; name: string; createdAt: number }> {
    console.log('[Project API] Creating project:', params.name || 'Untitled')
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    return handleResponse(response)
  },

  /**
   * 更新项目
   */
  async updateProject(id: string, params: UpdateProjectParams): Promise<{ success: boolean; id: string; updatedAt: number }> {
    console.log(`[Project API] Updating project: ${id}`)
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    return handleResponse(response)
  },

  /**
   * 删除项目
   */
  async deleteProject(id: string): Promise<{ success: boolean; id: string; deletedAt: number }> {
    console.log(`[Project API] Deleting project: ${id}`)
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return handleResponse(response)
  },

  /**
   * 保存画布数据
   */
  async saveCanvasData(projectId: string, canvasData: CanvasData): Promise<{ success: boolean; id: string; savedAt: number }> {
    console.log(`[Project API] Saving canvas data for project: ${projectId}`)
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/canvas`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ canvasData }),
    })
    return handleResponse(response)
  },

  /**
   * 获取项目的会话列表
   */
  async getProjectConversations(projectId: string): Promise<Conversation[]> {
    console.log(`[Project API] Fetching conversations for project: ${projectId}`)
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/conversations`, {
      cache: 'no-store',
      credentials: 'include',
    })
    return handleResponse<Conversation[]>(response)
  },

  /**
   * 为项目创建新会话
   */
  async createConversation(projectId: string, title?: string, model?: string): Promise<{ id: string; projectId: string; createdAt: number }> {
    console.log(`[Project API] Creating conversation for project: ${projectId}`)
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/conversations`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, model }),
    })
    return handleResponse(response)
  },

  /**
   * 关联现有会话到项目
   */
  async linkConversation(projectId: string, conversationId: string): Promise<{ success: boolean }> {
    console.log(`[Project API] Linking conversation ${conversationId} to project ${projectId}`)
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/conversations/${conversationId}`, {
      method: 'POST',
      credentials: 'include',
    })
    return handleResponse(response)
  },

  /**
   * 取消会话与项目的关联
   */
  async unlinkConversation(projectId: string, conversationId: string): Promise<{ success: boolean }> {
    console.log(`[Project API] Unlinking conversation ${conversationId} from project ${projectId}`)
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/conversations/${conversationId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return handleResponse(response)
  },

  /**
   * 获取会话的消息列表
   */
  async getConversationMessages(conversationId: string): Promise<any[]> {
    console.log(`[Project API] Fetching messages for conversation: ${conversationId}`)
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      cache: 'no-store',
      credentials: 'include',
    })
    const data = await handleResponse<{ conversationId: string; messages: any[] }>(response)
    return data.messages
  },
}
