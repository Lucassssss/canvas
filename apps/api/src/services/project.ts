/**
 * 项目管理服务层
 * 
 * 职责：
 * 1. 项目的 CRUD 操作
 * 2. 画布数据的持久化
 * 3. 项目与会话的关联管理
 * 
 * 数据流：
 * Frontend → API Routes → Project Service → Database
 */

import db from './database.js'
import type { 
  Project, 
  ProjectMetadata, 
  CanvasData,
  CreateProjectParams,
  UpdateProjectParams
} from '../types/index.js'

/**
 * 生成唯一 ID
 * 格式: timestamp-randomString
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 创建新项目
 * 
 * @param params - 创建参数
 * @returns 创建的项目对象
 */
export function createProject(params: CreateProjectParams = {}): Project {
  const id = generateId()
  const now = Date.now()
  const name = params.name || 'Untitled Project'
  
  // 默认画布数据
  const defaultCanvasData: CanvasData = {
    shapes: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    selectedIds: []
  }
  
  const canvasData = params.canvasData || defaultCanvasData

  console.log(`[Project Service] Creating project: ${name} (${id})`)

  try {
    db.prepare(`
      INSERT INTO projects (id, name, version, canvas_data, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, '1.0.0', JSON.stringify(canvasData), now, now)

    console.log(`[Project Service] Project created successfully: ${id}`)

    return {
      id,
      name,
      version: '1.0.0',
      canvasData,
      createdAt: now,
      updatedAt: now,
      conversations: []
    }
  } catch (error) {
    console.error(`[Project Service] Failed to create project:`, error)
    throw error
  }
}

/**
 * 获取所有项目（元数据）
 * 
 * @returns 项目元数据列表
 */
export function getProjects(): ProjectMetadata[] {
  console.log('[Project Service] Fetching all projects')

  try {
    const rows = db.prepare(`
      SELECT 
        p.id, 
        p.name, 
        p.thumbnail, 
        p.created_at as createdAt, 
        p.updated_at as updatedAt,
        COUNT(pc.conversation_id) as conversationCount
      FROM projects p
      LEFT JOIN project_conversations pc ON p.id = pc.project_id
      GROUP BY p.id
      ORDER BY p.updated_at DESC
    `).all() as ProjectMetadata[]

    console.log(`[Project Service] Found ${rows.length} projects`)
    return rows
  } catch (error) {
    console.error('[Project Service] Failed to fetch projects:', error)
    throw error
  }
}

/**
 * 获取单个项目（完整数据）
 * 
 * @param id - 项目 ID
 * @returns 项目对象或 null
 */
export function getProject(id: string): Project | null {
  console.log(`[Project Service] Fetching project: ${id}`)

  try {
    // 获取项目基本信息
    const row = db.prepare(`
      SELECT id, name, version, canvas_data, thumbnail, 
             created_at as createdAt, updated_at as updatedAt
      FROM projects
      WHERE id = ?
    `).get(id) as any

    if (!row) {
      console.log(`[Project Service] Project not found: ${id}`)
      return null
    }

    // 获取关联的会话
    const conversations = db.prepare(`
      SELECT c.id, c.title, c.model, c.mode,
             c.created_at as createdAt, c.updated_at as updatedAt
      FROM conversations c
      INNER JOIN project_conversations pc ON c.id = pc.conversation_id
      WHERE pc.project_id = ?
      ORDER BY c.updated_at DESC
    `).all(id) as any[]

    console.log(`[Project Service] Project found with ${conversations.length} conversations`)

    return {
      id: row.id,
      name: row.name,
      version: row.version,
      canvasData: JSON.parse(row.canvas_data),
      thumbnail: row.thumbnail,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      conversations
    }
  } catch (error) {
    console.error(`[Project Service] Failed to fetch project ${id}:`, error)
    throw error
  }
}

/**
 * 更新项目
 * 
 * @param id - 项目 ID
 * @param params - 更新参数
 */
export function updateProject(id: string, params: UpdateProjectParams): void {
  console.log(`[Project Service] Updating project: ${id}`, {
    hasName: !!params.name,
    hasCanvasData: !!params.canvasData,
    hasThumbnail: !!params.thumbnail
  })

  const updates: string[] = []
  const values: any[] = []

  if (params.name !== undefined) {
    updates.push('name = ?')
    values.push(params.name)
  }

  if (params.canvasData !== undefined) {
    updates.push('canvas_data = ?')
    values.push(JSON.stringify(params.canvasData))
  }

  if (params.thumbnail !== undefined) {
    updates.push('thumbnail = ?')
    values.push(params.thumbnail)
  }

  if (updates.length === 0) {
    console.log('[Project Service] No updates to apply')
    return
  }

  // 总是更新 updated_at
  updates.push('updated_at = ?')
  values.push(Date.now())
  values.push(id)

  try {
    const result = db.prepare(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`
    ).run(...values)

    console.log(`[Project Service] Project updated: ${id}, changes: ${result.changes}`)
  } catch (error) {
    console.error(`[Project Service] Failed to update project ${id}:`, error)
    throw error
  }
}

/**
 * 删除项目
 * 注意：会级联删除关联的会话关系，但不会删除会话本身
 * 
 * @param id - 项目 ID
 */
export function deleteProject(id: string): void {
  console.log(`[Project Service] Deleting project: ${id}`)

  try {
    // 先删除关联关系
    db.prepare('DELETE FROM project_conversations WHERE project_id = ?').run(id)
    
    // 再删除项目
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id)

    console.log(`[Project Service] Project deleted: ${id}, changes: ${result.changes}`)
  } catch (error) {
    console.error(`[Project Service] Failed to delete project ${id}:`, error)
    throw error
  }
}

/**
 * 保存画布数据（快速保存接口）
 * 
 * @param projectId - 项目 ID
 * @param canvasData - 画布数据
 */
export function saveCanvasData(projectId: string, canvasData: CanvasData): void {
  console.log(`[Project Service] Saving canvas data for project: ${projectId}`)

  try {
    const result = db.prepare(`
      UPDATE projects 
      SET canvas_data = ?, updated_at = ? 
      WHERE id = ?
    `).run(JSON.stringify(canvasData), Date.now(), projectId)

    console.log(`[Project Service] Canvas data saved: ${projectId}, changes: ${result.changes}`)
  } catch (error) {
    console.error(`[Project Service] Failed to save canvas data for ${projectId}:`, error)
    throw error
  }
}

/**
 * 获取项目的会话列表
 * 
 * @param projectId - 项目 ID
 * @returns 会话列表
 */
export function getProjectConversations(projectId: string): any[] {
  console.log(`[Project Service] Fetching conversations for project: ${projectId}`)

  try {
    const conversations = db.prepare(`
      SELECT c.id, c.title, c.model, c.mode,
             c.created_at as createdAt, c.updated_at as updatedAt
      FROM conversations c
      INNER JOIN project_conversations pc ON c.id = pc.conversation_id
      WHERE pc.project_id = ?
      ORDER BY c.updated_at DESC
    `).all(projectId) as any[]

    console.log(`[Project Service] Found ${conversations.length} conversations`)
    return conversations
  } catch (error) {
    console.error(`[Project Service] Failed to fetch conversations for ${projectId}:`, error)
    throw error
  }
}

/**
 * 为项目创建新会话
 * 
 * @param projectId - 项目 ID
 * @param title - 会话标题
 * @param model - 模型名称
 * @returns 新会话的 ID
 */
export function createProjectConversation(
  projectId: string,
  title?: string,
  model?: string
): string {
  const conversationId = generateId()
  const now = Date.now()

  console.log(`[Project Service] Creating conversation for project ${projectId}: ${title || 'New Conversation'}`)

  try {
    // 创建会话
    db.prepare(`
      INSERT INTO conversations (id, title, model, mode, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      conversationId,
      title || 'New Conversation',
      model || 'deepseek/deepseek-chat',
      'agent',
      now,
      now
    )

    // 关联到项目
    const linkId = generateId()
    db.prepare(`
      INSERT INTO project_conversations (id, project_id, conversation_id, created_at)
      VALUES (?, ?, ?, ?)
    `).run(linkId, projectId, conversationId, now)

    console.log(`[Project Service] Conversation created and linked: ${conversationId}`)
    return conversationId
  } catch (error) {
    console.error(`[Project Service] Failed to create conversation for ${projectId}:`, error)
    throw error
  }
}

/**
 * 关联现有会话到项目
 * 
 * @param projectId - 项目 ID
 * @param conversationId - 会话 ID
 */
export function linkConversationToProject(
  projectId: string,
  conversationId: string
): void {
  console.log(`[Project Service] Linking conversation ${conversationId} to project ${projectId}`)

  try {
    const id = generateId()
    db.prepare(`
      INSERT OR IGNORE INTO project_conversations (id, project_id, conversation_id, created_at)
      VALUES (?, ?, ?, ?)
    `).run(id, projectId, conversationId, Date.now())

    console.log('[Project Service] Conversation linked successfully')
  } catch (error) {
    console.error(`[Project Service] Failed to link conversation:`, error)
    throw error
  }
}

/**
 * 取消会话与项目的关联
 * 注意：不会删除会话本身，只删除关联关系
 * 
 * @param projectId - 项目 ID
 * @param conversationId - 会话 ID
 */
export function unlinkConversationFromProject(
  projectId: string,
  conversationId: string
): void {
  console.log(`[Project Service] Unlinking conversation ${conversationId} from project ${projectId}`)

  try {
    const result = db.prepare(`
      DELETE FROM project_conversations 
      WHERE project_id = ? AND conversation_id = ?
    `).run(projectId, conversationId)

    console.log(`[Project Service] Conversation unlinked, changes: ${result.changes}`)
  } catch (error) {
    console.error(`[Project Service] Failed to unlink conversation:`, error)
    throw error
  }
}
