/**
 * 项目管理 API 路由
 * 
 * 端点列表：
 * - GET    /api/projects              获取所有项目列表
 * - GET    /api/projects/:id          获取单个项目详情
 * - POST   /api/projects              创建新项目
 * - PUT    /api/projects/:id          更新项目
 * - DELETE /api/projects/:id          删除项目
 * - PUT    /api/projects/:id/canvas   保存画布数据
 * - GET    /api/projects/:id/conversations              获取项目的会话列表
 * - POST   /api/projects/:id/conversations             为项目创建新会话
 * - POST   /api/projects/:id/conversations/:convId     关联现有会话到项目
 * - DELETE /api/projects/:id/conversations/:convId     取消会话关联
 */

import { Router, Request, Response } from 'express'
import * as projectService from '../services/project.js'

const router = Router()

/**
 * GET /api/projects
 * 获取所有项目列表（元数据）
 */
router.get('/projects', async (req: Request, res: Response) => {
  console.log('[API] GET /api/projects')
  
  try {
    const projects = await projectService.getProjects()
    res.json(projects)
  } catch (error: any) {
    console.error('[API] Error fetching projects:', error)
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      message: error.message 
    })
  }
})

/**
 * GET /api/projects/:id
 * 获取单个项目详情（包含画布数据和会话列表）
 */
router.get('/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  console.log(`[API] GET /api/projects/${id}`)

  try {
    const project = await projectService.getProject(id)
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found',
        id 
      })
    }

    res.json(project)
  } catch (error: any) {
    console.error(`[API] Error fetching project ${id}:`, error)
    res.status(500).json({ 
      error: 'Failed to fetch project',
      message: error.message 
    })
  }
})

/**
 * POST /api/projects
 * 创建新项目
 * 
 * Body: { name?: string, canvasData?: CanvasData }
 */
router.post('/projects', async (req: Request, res: Response) => {
  console.log('[API] POST /api/projects', req.body)

  try {
    const { name, canvasData } = req.body
    const project = await projectService.createProject({ name, canvasData })
    
    res.status(201).json({ 
      id: project.id,
      name: project.name,
      createdAt: project.createdAt
    })
  } catch (error: any) {
    console.error('[API] Error creating project:', error)
    res.status(500).json({ 
      error: 'Failed to create project',
      message: error.message 
    })
  }
})

/**
 * PUT /api/projects/:id
 * 更新项目
 * 
 * Body: { name?: string, canvasData?: CanvasData, thumbnail?: string }
 */
router.put('/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  console.log(`[API] PUT /api/projects/${id}`, {
    hasName: !!req.body.name,
    hasCanvasData: !!req.body.canvasData,
    hasThumbnail: !!req.body.thumbnail
  })

  try {
    const { name, canvasData, thumbnail } = req.body
    await projectService.updateProject(id, { name, canvasData, thumbnail })
    
    res.json({ 
      success: true,
      id,
      updatedAt: Date.now()
    })
  } catch (error: any) {
    console.error(`[API] Error updating project ${id}:`, error)
    res.status(500).json({ 
      error: 'Failed to update project',
      message: error.message 
    })
  }
})

/**
 * DELETE /api/projects/:id
 * 删除项目
 */
router.delete('/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  console.log(`[API] DELETE /api/projects/${id}`)

  try {
    await projectService.deleteProject(id)
    
    res.json({ 
      success: true,
      id,
      deletedAt: Date.now()
    })
  } catch (error: any) {
    console.error(`[API] Error deleting project ${id}:`, error)
    res.status(500).json({ 
      error: 'Failed to delete project',
      message: error.message 
    })
  }
})

/**
 * PUT /api/projects/:id/canvas
 * 保存画布数据（快速保存接口）
 * 
 * Body: { canvasData: CanvasData }
 */
router.put('/projects/:id/canvas', async (req: Request, res: Response) => {
  const { id } = req.params
  console.log(`[API] PUT /api/projects/${id}/canvas`)

  try {
    const { canvasData } = req.body
    
    if (!canvasData) {
      return res.status(400).json({ 
        error: 'Missing canvasData in request body' 
      })
    }

    await projectService.saveCanvasData(id, canvasData)
    
    res.json({ 
      success: true,
      id,
      savedAt: Date.now()
    })
  } catch (error: any) {
    console.error(`[API] Error saving canvas data for ${id}:`, error)
    res.status(500).json({ 
      error: 'Failed to save canvas data',
      message: error.message 
    })
  }
})

/**
 * GET /api/projects/:id/conversations
 * 获取项目的会话列表
 */
router.get('/projects/:id/conversations', async (req: Request, res: Response) => {
  const { id } = req.params
  console.log(`[API] GET /api/projects/${id}/conversations`)

  try {
    const conversations = await projectService.getProjectConversations(id)
    res.json(conversations)
  } catch (error: any) {
    console.error(`[API] Error fetching conversations for ${id}:`, error)
    res.status(500).json({ 
      error: 'Failed to fetch conversations',
      message: error.message 
    })
  }
})

/**
 * POST /api/projects/:id/conversations
 * 为项目创建新会话
 * 
 * Body: { title?: string, model?: string }
 */
router.post('/projects/:id/conversations', async (req: Request, res: Response) => {
  const { id } = req.params
  console.log(`[API] POST /api/projects/${id}/conversations`, req.body)

  try {
    const { title, model } = req.body
    const conversationId = await projectService.createProjectConversation(id, title, model)
    
    res.status(201).json({ 
      id: conversationId,
      projectId: id,
      createdAt: Date.now()
    })
  } catch (error: any) {
    console.error(`[API] Error creating conversation for ${id}:`, error)
    res.status(500).json({ 
      error: 'Failed to create conversation',
      message: error.message 
    })
  }
})

/**
 * POST /api/projects/:id/conversations/:convId
 * 关联现有会话到项目
 */
router.post('/projects/:id/conversations/:convId', async (req: Request, res: Response) => {
  const { id, convId } = req.params
  console.log(`[API] POST /api/projects/${id}/conversations/${convId}`)

  try {
    await projectService.linkConversationToProject(id, convId)
    
    res.json({ 
      success: true,
      projectId: id,
      conversationId: convId,
      linkedAt: Date.now()
    })
  } catch (error: any) {
    console.error(`[API] Error linking conversation:`, error)
    res.status(500).json({ 
      error: 'Failed to link conversation',
      message: error.message 
    })
  }
})

/**
 * DELETE /api/projects/:id/conversations/:convId
 * 取消会话与项目的关联
 */
router.delete('/projects/:id/conversations/:convId', async (req: Request, res: Response) => {
  const { id, convId } = req.params
  console.log(`[API] DELETE /api/projects/${id}/conversations/${convId}`)

  try {
    await projectService.unlinkConversationFromProject(id, convId)
    
    res.json({ 
      success: true,
      projectId: id,
      conversationId: convId,
      unlinkedAt: Date.now()
    })
  } catch (error: any) {
    console.error(`[API] Error unlinking conversation:`, error)
    res.status(500).json({ 
      error: 'Failed to unlink conversation',
      message: error.message 
    })
  }
})

export default router
