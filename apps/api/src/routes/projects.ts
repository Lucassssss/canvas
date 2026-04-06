/**
 * 项目管理 API 路由
 * 
 * 端点列表：
 * - GET    /api/projects              获取用户的所有项目列表
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

import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import * as projectService from '../services/project.js'

const router = Router()

function asyncHandler<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

router.use(authMiddleware)

/**
 * GET /api/projects
 * 获取当前用户的所有项目列表（元数据）
 */
router.get('/projects', asyncHandler(async (req: Request, res: Response) => {
  console.log('[API] GET /api/projects')
  
  const userId = req.user!.userId
  
  try {
    const projects = await projectService.getProjects(userId)
    res.json(projects)
  } catch (error: any) {
    console.error('[API] Error fetching projects:', error)
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      message: error.message 
    })
  }
}))

/**
 * GET /api/projects/:id
 * 获取单个项目详情（包含画布数据和会话列表）
 */
router.get('/projects/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = req.user!.userId
  console.log(`[API] GET /api/projects/${id}`)

  try {
    const project = await projectService.getProject(userId, id)
    
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
}))

/**
 * POST /api/projects
 * 创建新项目
 * 
 * Body: { name?: string, canvasData?: CanvasData }
 */
router.post('/projects', asyncHandler(async (req: Request, res: Response) => {
  console.log('[API] POST /api/projects', req.body)

  const userId = req.user!.userId

  try {
    const { name, canvasData } = req.body
    const project = await projectService.createProject(userId, { name, canvasData })
    
    res.status(201).json(project)
  } catch (error: any) {
    console.error('[API] Error creating project:', error)
    res.status(500).json({ 
      error: 'Failed to create project',
      message: error.message 
    })
  }
}))

/**
 * PUT /api/projects/:id
 * 更新项目
 * 
 * Body: { name?: string, canvasData?: CanvasData, thumbnail?: string }
 */
router.put('/projects/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = req.user!.userId
  console.log(`[API] PUT /api/projects/${id}`, {
    hasName: !!req.body.name,
    hasCanvasData: !!req.body.canvasData,
    hasThumbnail: !!req.body.thumbnail
  })

  try {
    const { name, canvasData, thumbnail } = req.body
    await projectService.updateProject(userId, id, { name, canvasData, thumbnail })
    
    res.json({ 
      success: true,
      id
    })
  } catch (error: any) {
    console.error(`[API] Error updating project ${id}:`, error)
    if (error.message === 'Project not found') {
      res.status(404).json({ error: 'Project not found' })
    } else {
      res.status(500).json({ 
        error: 'Failed to update project',
        message: error.message 
      })
    }
  }
}))

/**
 * DELETE /api/projects/:id
 * 删除项目
 */
router.delete('/projects/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = req.user!.userId
  console.log(`[API] DELETE /api/projects/${id}`)

  try {
    await projectService.deleteProject(userId, id)
    
    res.json({ 
      success: true,
      id
    })
  } catch (error: any) {
    console.error(`[API] Error deleting project ${id}:`, error)
    if (error.message === 'Project not found') {
      res.status(404).json({ error: 'Project not found' })
    } else {
      res.status(500).json({ 
        error: 'Failed to delete project',
        message: error.message 
      })
    }
  }
}))

/**
 * PUT /api/projects/:id/canvas
 * 保存画布数据（快速保存接口）
 * 
 * Body: { canvasData: CanvasData }
 */
router.put('/projects/:id/canvas', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = req.user!.userId
  console.log(`[API] PUT /api/projects/${id}/canvas`)

  try {
    const { canvasData } = req.body
    
    if (!canvasData) {
      return res.status(400).json({ 
        error: 'Missing canvasData in request body' 
      })
    }

    await projectService.saveCanvasData(userId, id, canvasData)
    
    res.json({ 
      success: true,
      id
    })
  } catch (error: any) {
    console.error(`[API] Error saving canvas data for ${id}:`, error)
    if (error.message === 'Project not found') {
      res.status(404).json({ error: 'Project not found' })
    } else {
      res.status(500).json({ 
        error: 'Failed to save canvas data',
        message: error.message 
      })
    }
  }
}))

/**
 * GET /api/projects/:id/conversations
 * 获取项目的会话列表
 */
router.get('/projects/:id/conversations', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = req.user!.userId
  console.log(`[API] GET /api/projects/${id}/conversations`)

  try {
    const conversations = await projectService.getProjectConversations(userId, id)
    res.json(conversations)
  } catch (error: any) {
    console.error(`[API] Error fetching conversations for ${id}:`, error)
    if (error.message === 'Project not found') {
      res.status(404).json({ error: 'Project not found' })
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch conversations',
        message: error.message 
      })
    }
  }
}))

/**
 * POST /api/projects/:id/conversations
 * 为项目创建新会话
 * 
 * Body: { title?: string, model?: string }
 */
router.post('/projects/:id/conversations', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = req.user!.userId
  console.log(`[API] POST /api/projects/${id}/conversations`, req.body)

  try {
    const { title, model } = req.body
    const conversation = await projectService.createProjectConversation(userId, id, title, model)
    
    res.status(201).json(conversation)
  } catch (error: any) {
    console.error(`[API] Error creating conversation for ${id}:`, error)
    if (error.message === 'Project not found') {
      res.status(404).json({ error: 'Project not found' })
    } else {
      res.status(500).json({ 
        error: 'Failed to create conversation',
        message: error.message 
      })
    }
  }
}))

/**
 * POST /api/projects/:id/conversations/:convId
 * 关联现有会话到项目
 */
router.post('/projects/:id/conversations/:convId', asyncHandler(async (req: Request, res: Response) => {
  const { id, convId } = req.params
  const userId = req.user!.userId
  console.log(`[API] POST /api/projects/${id}/conversations/${convId}`)

  try {
    await projectService.linkConversationToProject(userId, id, convId)
    
    res.json({ 
      success: true,
      projectId: id,
      conversationId: convId
    })
  } catch (error: any) {
    console.error(`[API] Error linking conversation:`, error)
    if (error.message === 'Project not found' || error.message === 'Conversation not found') {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ 
        error: 'Failed to link conversation',
        message: error.message 
      })
    }
  }
}))

/**
 * DELETE /api/projects/:id/conversations/:convId
 * 取消会话与项目的关联
 */
router.delete('/projects/:id/conversations/:convId', asyncHandler(async (req: Request, res: Response) => {
  const { id, convId } = req.params
  const userId = req.user!.userId
  console.log(`[API] DELETE /api/projects/${id}/conversations/${convId}`)

  try {
    await projectService.unlinkConversationFromProject(userId, id, convId)
    
    res.json({ 
      success: true,
      projectId: id,
      conversationId: convId
    })
  } catch (error: any) {
    console.error(`[API] Error unlinking conversation:`, error)
    if (error.message === 'Project not found') {
      res.status(404).json({ error: 'Project not found' })
    } else {
      res.status(500).json({ 
        error: 'Failed to unlink conversation',
        message: error.message 
      })
    }
  }
}))

export default router
