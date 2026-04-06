import { nanoid } from 'nanoid'
import { db, projects, conversations, projectConversations, type CanvasData, CanvasDataSchema } from '../db/index.js'
import { eq, desc, sql, and } from 'drizzle-orm'
import type { 
  Project, 
  ProjectMetadata, 
  CreateProjectParams,
  UpdateProjectParams,
  Conversation
} from '../types/index.js'

function generateId(): string {
  return nanoid()
}

export async function createProject(userId: string, params: CreateProjectParams = {}): Promise<Project> {
  const id = generateId()
  const name = params.name || 'Untitled Project'
  
  const defaultCanvasData: CanvasData = {
    shapes: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    selectedIds: []
  }
  
  const canvasData = params.canvasData || defaultCanvasData
  const validatedCanvasData = CanvasDataSchema.parse(canvasData)

  console.log(`[Project Service] Creating project for user ${userId}: ${name} (${id})`)

  try {
    const [row] = await db.insert(projects).values({
      id,
      userId,
      name,
      canvasData: validatedCanvasData,
    }).returning()

    console.log(`[Project Service] Project created successfully: ${id}`)
    return {
      ...row,
      thumbnail: row.thumbnail ?? undefined,
    }
  } catch (error) {
    console.error(`[Project Service] Failed to create project:`, error)
    throw error
  }
}

export async function getProjects(userId: string): Promise<ProjectMetadata[]> {
  console.log(`[Project Service] Fetching projects for user ${userId}`)

  try {
    const rows = await db
      .select({
        id: projects.id,
        userId: projects.userId,
        name: projects.name,
        thumbnail: projects.thumbnail,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        conversationCount: sql<number>`count(${projectConversations.conversationId})`.as('conversationCount'),
      })
      .from(projects)
      .leftJoin(projectConversations, eq(projects.id, projectConversations.projectId))
      .where(eq(projects.userId, userId))
      .groupBy(projects.id)
      .orderBy(desc(projects.updatedAt))

    console.log(`[Project Service] Found ${rows.length} projects for user ${userId}`)
    return rows.map(row => ({
      id: row.id,
      userId: row.userId,
      name: row.name,
      thumbnail: row.thumbnail ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      conversationCount: Number(row.conversationCount),
    }))
  } catch (error) {
    console.error(`[Project Service] Failed to fetch projects:`, error)
    throw error
  }
}

export async function getProject(userId: string, projectId: string): Promise<Project | null> {
  console.log(`[Project Service] Fetching project ${projectId} for user ${userId}`)

  try {
    const [row] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))

    if (!row) {
      console.log(`[Project Service] Project not found: ${projectId}`)
      return null
    }

    const convRows = await db
      .select({
        id: conversations.id,
        userId: conversations.userId,
        title: conversations.title,
        model: conversations.model,
        mode: conversations.mode,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
      })
      .from(conversations)
      .innerJoin(projectConversations, eq(conversations.id, projectConversations.conversationId))
      .where(eq(projectConversations.projectId, projectId))
      .orderBy(desc(conversations.updatedAt))

    console.log(`[Project Service] Project found with ${convRows.length} conversations`)

    return {
      ...row,
      thumbnail: row.thumbnail ?? undefined,
      conversations: convRows,
    }
  } catch (error) {
    console.error(`[Project Service] Failed to fetch project ${projectId}:`, error)
    throw error
  }
}

export async function updateProject(
  userId: string, 
  projectId: string, 
  params: UpdateProjectParams
): Promise<void> {
  console.log(`[Project Service] Updating project ${projectId} for user ${userId}`, {
    hasName: !!params.name,
    hasCanvasData: !!params.canvasData,
    hasThumbnail: !!params.thumbnail
  })

  const project = await getProject(userId, projectId)
  if (!project) {
    throw new Error('Project not found')
  }

  const updateData: Record<string, unknown> = {}

  if (params.name !== undefined) {
    updateData.name = params.name
  }

  if (params.canvasData !== undefined) {
    updateData.canvasData = CanvasDataSchema.parse(params.canvasData)
  }

  if (params.thumbnail !== undefined) {
    updateData.thumbnail = params.thumbnail
  }

  if (Object.keys(updateData).length === 0) {
    console.log('[Project Service] No updates to apply')
    return
  }

  try {
    await db
      .update(projects)
      .set(updateData)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))

    console.log(`[Project Service] Project updated: ${projectId}`)
  } catch (error) {
    console.error(`[Project Service] Failed to update project ${projectId}:`, error)
    throw error
  }
}

export async function deleteProject(userId: string, projectId: string): Promise<void> {
  console.log(`[Project Service] Deleting project ${projectId} for user ${userId}`)

  const project = await getProject(userId, projectId)
  if (!project) {
    throw new Error('Project not found')
  }

  try {
    await db.delete(projects).where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    console.log(`[Project Service] Project deleted: ${projectId}`)
  } catch (error) {
    console.error(`[Project Service] Failed to delete project ${projectId}:`, error)
    throw error
  }
}

export async function saveCanvasData(userId: string, projectId: string, canvasData: CanvasData): Promise<void> {
  console.log(`[Project Service] Saving canvas data for project ${projectId}`)

  const project = await getProject(userId, projectId)
  if (!project) {
    throw new Error('Project not found')
  }

  try {
    const validatedData = CanvasDataSchema.parse(canvasData)
    
    await db
      .update(projects)
      .set({ canvasData: validatedData })
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))

    console.log(`[Project Service] Canvas data saved: ${projectId}`)
  } catch (error) {
    console.error(`[Project Service] Failed to save canvas data for ${projectId}:`, error)
    throw error
  }
}

export async function getProjectConversations(
  userId: string, 
  projectId: string
): Promise<Conversation[]> {
  console.log(`[Project Service] Fetching conversations for project ${projectId}`)

  const project = await getProject(userId, projectId)
  if (!project) {
    throw new Error('Project not found')
  }

  try {
    const rows = await db
      .select({
        id: conversations.id,
        userId: conversations.userId,
        title: conversations.title,
        model: conversations.model,
        mode: conversations.mode,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
      })
      .from(conversations)
      .innerJoin(projectConversations, eq(conversations.id, projectConversations.conversationId))
      .where(eq(projectConversations.projectId, projectId))
      .orderBy(desc(conversations.updatedAt))

    console.log(`[Project Service] Found ${rows.length} conversations`)
    return rows
  } catch (error) {
    console.error(`[Project Service] Failed to fetch conversations for ${projectId}:`, error)
    throw error
  }
}

export async function createProjectConversation(
  userId: string,
  projectId: string,
  title?: string,
  model?: string
): Promise<Conversation> {
  console.log(`[Project Service] Creating conversation for project ${projectId}`)

  const project = await getProject(userId, projectId)
  if (!project) {
    throw new Error('Project not found')
  }

  const conversationId = generateId()

  try {
    const [conversation] = await db.insert(conversations).values({
      id: conversationId,
      userId,
      title: title || 'New Conversation',
      model: model || 'deepseek/deepseek-chat',
    }).returning()

    await db.insert(projectConversations).values({
      id: generateId(),
      projectId,
      conversationId,
    })

    console.log(`[Project Service] Conversation created and linked: ${conversationId}`)
    return conversation
  } catch (error) {
    console.error(`[Project Service] Failed to create conversation for ${projectId}:`, error)
    throw error
  }
}

export async function linkConversationToProject(
  userId: string,
  projectId: string,
  conversationId: string
): Promise<void> {
  console.log(`[Project Service] Linking conversation ${conversationId} to project ${projectId}`)

  const project = await getProject(userId, projectId)
  if (!project) {
    throw new Error('Project not found')
  }

  const [conversation] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)))
  
  if (!conversation) {
    throw new Error('Conversation not found')
  }

  try {
    await db.insert(projectConversations).values({
      id: generateId(),
      projectId,
      conversationId,
    })

    console.log('[Project Service] Conversation linked successfully')
  } catch (error) {
    console.error(`[Project Service] Failed to link conversation:`, error)
    throw error
  }
}

export async function unlinkConversationFromProject(
  userId: string,
  projectId: string,
  conversationId: string
): Promise<void> {
  console.log(`[Project Service] Unlinking conversation ${conversationId} from project ${projectId}`)

  const project = await getProject(userId, projectId)
  if (!project) {
    throw new Error('Project not found')
  }

  try {
    await db.delete(projectConversations)
      .where(
        and(
          eq(projectConversations.projectId, projectId),
          eq(projectConversations.conversationId, conversationId)
        )
      )

    console.log('[Project Service] Conversation unlinked')
  } catch (error) {
    console.error(`[Project Service] Failed to unlink conversation:`, error)
    throw error
  }
}
