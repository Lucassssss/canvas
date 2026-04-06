import { nanoid } from 'nanoid'
import { db, projects, conversations, projectConversations, type CanvasData, CanvasDataSchema } from '../db/index.js'
import { eq, desc, sql, and } from 'drizzle-orm'
import type { 
  Project, 
  ProjectMetadata, 
  CreateProjectParams,
  UpdateProjectParams
} from '../types/index.js'

function generateId(): string {
  return nanoid()
}

export async function createProject(params: CreateProjectParams = {}): Promise<Project> {
  const id = generateId()
  const name = params.name || 'Untitled Project'
  
  const defaultCanvasData: CanvasData = {
    shapes: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    selectedIds: []
  }
  
  const canvasData = params.canvasData || defaultCanvasData
  const validatedCanvasData = CanvasDataSchema.parse(canvasData)

  console.log(`[Project Service] Creating project: ${name} (${id})`)

  try {
    await db.insert(projects).values({
      id,
      name,
      canvasData: validatedCanvasData,
    })

    console.log(`[Project Service] Project created successfully: ${id}`)

    const [row] = await db.select().from(projects).where(eq(projects.id, id))

    return {
      id: row.id,
      name: row.name,
      version: row.version,
      canvasData: row.canvasData,
      thumbnail: row.thumbnail ?? undefined,
<<<<<<< HEAD
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
=======
      createdAt: row.createdAt.getTime(),
      updatedAt: row.updatedAt.getTime(),
>>>>>>> f7e873ab38e83ee7e1a16d1443497857c815bc76
    }
  } catch (error) {
    console.error(`[Project Service] Failed to create project:`, error)
    throw error
  }
}

export async function getProjects(): Promise<ProjectMetadata[]> {
  console.log('[Project Service] Fetching all projects')

  try {
    const rows = await db.select({
      id: projects.id,
      name: projects.name,
      thumbnail: projects.thumbnail,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      conversationCount: sql<number>`count(${projectConversations.conversationId})`.as('conversationCount'),
    })
    .from(projects)
    .leftJoin(projectConversations, eq(projects.id, projectConversations.projectId))
    .groupBy(projects.id)
    .orderBy(desc(projects.updatedAt))

    console.log(`[Project Service] Found ${rows.length} projects`)
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      thumbnail: row.thumbnail ?? undefined,
<<<<<<< HEAD
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
=======
      createdAt: row.createdAt.getTime(),
      updatedAt: row.updatedAt.getTime(),
>>>>>>> f7e873ab38e83ee7e1a16d1443497857c815bc76
      conversationCount: Number(row.conversationCount),
    }))
  } catch (error) {
    console.error('[Project Service] Failed to fetch projects:', error)
    throw error
  }
}

export async function getProject(id: string): Promise<Project | null> {
  console.log(`[Project Service] Fetching project: ${id}`)

  try {
    const [row] = await db.select().from(projects).where(eq(projects.id, id))

    if (!row) {
      console.log(`[Project Service] Project not found: ${id}`)
      return null
    }

    const convRows = await db.select({
      id: conversations.id,
      title: conversations.title,
      model: conversations.model,
      mode: conversations.mode,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
    })
    .from(conversations)
    .innerJoin(projectConversations, eq(conversations.id, projectConversations.conversationId))
    .where(eq(projectConversations.projectId, id))
    .orderBy(desc(conversations.updatedAt))

    console.log(`[Project Service] Project found with ${convRows.length} conversations`)

    return {
      id: row.id,
      name: row.name,
      version: row.version,
      canvasData: row.canvasData,
      thumbnail: row.thumbnail ?? undefined,
<<<<<<< HEAD
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
=======
      createdAt: row.createdAt.getTime(),
      updatedAt: row.updatedAt.getTime(),
>>>>>>> f7e873ab38e83ee7e1a16d1443497857c815bc76
      conversations: convRows,
    }
  } catch (error) {
    console.error(`[Project Service] Failed to fetch project ${id}:`, error)
    throw error
  }
}

export async function updateProject(id: string, params: UpdateProjectParams): Promise<void> {
  console.log(`[Project Service] Updating project: ${id}`, {
    hasName: !!params.name,
    hasCanvasData: !!params.canvasData,
    hasThumbnail: !!params.thumbnail
  })

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
    await db.update(projects)
      .set(updateData)
      .where(eq(projects.id, id))

    console.log(`[Project Service] Project updated: ${id}`)
  } catch (error) {
    console.error(`[Project Service] Failed to update project ${id}:`, error)
    throw error
  }
}

export async function deleteProject(id: string): Promise<void> {
  console.log(`[Project Service] Deleting project: ${id}`)

  try {
    await db.delete(projectConversations)
      .where(eq(projectConversations.projectId, id))
    
    await db.delete(projects)
      .where(eq(projects.id, id))

    console.log(`[Project Service] Project deleted: ${id}`)
  } catch (error) {
    console.error(`[Project Service] Failed to delete project ${id}:`, error)
    throw error
  }
}

export async function saveCanvasData(projectId: string, canvasData: CanvasData): Promise<void> {
  console.log(`[Project Service] Saving canvas data for project: ${projectId}`)

  try {
    const validatedData = CanvasDataSchema.parse(canvasData)
    
    await db.update(projects)
      .set({ canvasData: validatedData })
      .where(eq(projects.id, projectId))

    console.log(`[Project Service] Canvas data saved: ${projectId}`)
  } catch (error) {
    console.error(`[Project Service] Failed to save canvas data for ${projectId}:`, error)
    throw error
  }
}

export async function getProjectConversations(projectId: string): Promise<any[]> {
  console.log(`[Project Service] Fetching conversations for project: ${projectId}`)

  try {
    const rows = await db.select({
      id: conversations.id,
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
  projectId: string,
  title?: string,
  model?: string
): Promise<string> {
  const conversationId = generateId()

  console.log(`[Project Service] Creating conversation for project ${projectId}: ${title || 'New Conversation'}`)

  try {
    await db.insert(conversations).values({
      id: conversationId,
      title: title || 'New Conversation',
      model: model || 'deepseek/deepseek-chat',
    })

    const linkId = generateId()
    await db.insert(projectConversations).values({
      id: linkId,
      projectId,
      conversationId,
    })

    console.log(`[Project Service] Conversation created and linked: ${conversationId}`)
    return conversationId
  } catch (error) {
    console.error(`[Project Service] Failed to create conversation for ${projectId}:`, error)
    throw error
  }
}

export async function linkConversationToProject(
  projectId: string,
  conversationId: string
): Promise<void> {
  console.log(`[Project Service] Linking conversation ${conversationId} to project ${projectId}`)

  try {
    const id = generateId()
    await db.insert(projectConversations).values({
      id,
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
  projectId: string,
  conversationId: string
): Promise<void> {
  console.log(`[Project Service] Unlinking conversation ${conversationId} from project ${projectId}`)

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
