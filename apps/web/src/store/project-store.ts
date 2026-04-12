/**
 * 项目管理 Zustand Store
 * 
 * 职责：
 * 1. 管理当前项目状态
 * 2. 管理项目列表
 * 3. 处理项目的 CRUD 操作
 * 4. 管理项目的会话列表
 * 
 * 注意：这是纯前端 Store，所有数据操作通过 API 与后端通信
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { projectApi, ApiError } from '@/lib/api/project-api'
import type { ProjectMetadata, Conversation, CanvasData } from '@/types/project'

interface ProjectStore {
  // ========== 当前项目状态 ==========
  
  /** 当前项目 ID */
  currentProjectId: string | null
  /** 当前项目名称 */
  currentProjectName: string
  /** 是否有未保存的更改 */
  isDirty: boolean
  /** 最后保存时间 */
  lastSavedAt: number | null
  /** 是否正在保存 */
  isSaving: boolean
  
  // ========== 项目列表 ==========
  
  /** 项目列表 */
  projects: ProjectMetadata[]
  /** 是否正在加载项目列表 */
  isLoadingProjects: boolean
  /** 项目列表加载错误 */
  projectsError: string | null
  
  // ========== 会话管理 ==========
  
  /** 当前项目的会话列表 */
  projectConversations: Conversation[]
  /** 是否正在加载会话列表 */
  isLoadingConversations: boolean
  /** 会话列表加载错误 */
  conversationsError: string | null
  
  // ========== 操作方法 ==========
  
  /** 设置当前项目 */
  setCurrentProject: (id: string, name: string) => void
  /** 标记为有未保存的更改 */
  markDirty: () => void
  /** 标记为已保存 */
  markSaved: () => void
  
  /** 加载项目列表 */
  loadProjects: () => Promise<void>
  /** 创建新项目 */
  createProject: (name?: string, canvasData?: CanvasData) => Promise<string>
  /** 保存当前项目 */
  saveProject: (canvasData: CanvasData) => Promise<void>
  /** 更新项目名称 */
  updateProjectName: (id: string, name: string) => Promise<void>
  /** 删除项目 */
  deleteProject: (id: string) => Promise<void>
  /** 加载项目详情 */
  loadProject: (id: string) => Promise<CanvasData | null>
  /** 更新内存中项目的缩略图（不发起 API 请求，仅同步 store） */
  updateProjectThumbnail: (id: string, thumbnail: string) => void
  
  /** 加载项目的会话列表 */
  loadProjectConversations: (projectId: string) => Promise<void>
  /** 为当前项目创建新会话 */
  createConversation: (title?: string, model?: string) => Promise<string>
  /** 关联会话到项目 */
  linkConversation: (conversationId: string) => Promise<void>
  /** 取消会话关联 */
  unlinkConversation: (conversationId: string) => Promise<void>
  
  /** 重置状态 */
  reset: () => void
}

const initialState = {
  currentProjectId: null,
  currentProjectName: 'Untitled Project',
  isDirty: false,
  lastSavedAt: null,
  isSaving: false,
  projects: [],
  isLoadingProjects: false,
  projectsError: null,
  projectConversations: [],
  isLoadingConversations: false,
  conversationsError: null,
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========== 基础状态管理 ==========

      setCurrentProject: (id, name) => {
        set({ 
          currentProjectId: id, 
          currentProjectName: name,
          isDirty: false,
          lastSavedAt: null
        })
      },

      markDirty: () => {
        const { isDirty } = get()
        if (!isDirty) {
          set({ isDirty: true })
        }
      },

      markSaved: () => {
        set({ isDirty: false, lastSavedAt: Date.now() })
      },

      // ========== 项目列表管理 ==========

      loadProjects: async () => {
        if (get().isLoadingProjects) return

        set({ isLoadingProjects: true, projectsError: null })

        try {
          const projects = await projectApi.getProjects()
          set({ projects, isLoadingProjects: false })
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Failed to load projects'
          console.error('[Project Store] Failed to load projects:', error)
          set({ projectsError: message, isLoadingProjects: false })
        }
      },

      createProject: async (name, canvasData) => {
        try {
          const result = await projectApi.createProject({ name, canvasData })
          
          // 重新加载项目列表
          await get().loadProjects()
          
          return result.id
        } catch (error) {
          console.error('[Project Store] Failed to create project:', error)
          throw error
        }
      },

      saveProject: async (canvasData) => {
        const { currentProjectId, isSaving } = get()
        
        if (!currentProjectId) {
          console.warn('[Project Store] No current project to save')
          return
        }

        if (isSaving) {
          return
        }

        set({ isSaving: true })

        try {
          await projectApi.saveCanvasData(currentProjectId, canvasData)
          get().markSaved()
        } catch (error) {
          console.error('[Project Store] Failed to save project:', error)
          throw error
        } finally {
          set({ isSaving: false })
        }
      },

      updateProjectName: async (id, name) => {



        try {
          await projectApi.updateProject(id, { name })
          
          // 更新列表中的项目名称
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, name, updatedAt: Date.now() } : p
            ),
            currentProjectName: state.currentProjectId === id ? name : state.currentProjectName
          }))
        } catch (error) {
          console.error('[Project Store] Failed to update project name:', error)
          throw error
        }
      },

      deleteProject: async (id) => {
        try {
          await projectApi.deleteProject(id)
          
          // 从列表中移除
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            // 如果删除的是当前项目，清空当前项目
            currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
            currentProjectName: state.currentProjectId === id ? 'Untitled Project' : state.currentProjectName
          }))
        } catch (error) {
          console.error('[Project Store] Failed to delete project:', error)
          throw error
        }
      },

      loadProject: async (id) => {
        try {
          const project = await projectApi.getProject(id)
          
          // 设置为当前项目
          get().setCurrentProject(project.id, project.name)
          
          return project.canvasData
        } catch (error) {
          console.error('[Project Store] Failed to load project:', error)
          throw error
        }
      },

      updateProjectThumbnail: (id, thumbnail) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, thumbnail } : p
          ),
        }))
      },

      // ========== 会话管理 ==========

      loadProjectConversations: async (projectId) => {
        set({ isLoadingConversations: true, conversationsError: null })
        try {
          const conversations = await projectApi.getProjectConversations(projectId)
          set({ projectConversations: conversations, isLoadingConversations: false })
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Failed to load conversations'
          console.error('[Project Store] Failed to load conversations:', error)
          set({ conversationsError: message, isLoadingConversations: false })
        }
      },

      createConversation: async (title, model) => {
        const { currentProjectId } = get()
        
        if (!currentProjectId) {
          throw new Error('No current project')
        }
        try {
          const result = await projectApi.createConversation(currentProjectId, title, model)
          // 重新加载会话列表
          await get().loadProjectConversations(currentProjectId)
          
          return result.id
        } catch (error) {
          console.error('[Project Store] Failed to create conversation:', error)
          throw error
        }
      },

      linkConversation: async (conversationId) => {
        const { currentProjectId } = get()
        
        if (!currentProjectId) {
          throw new Error('No current project')
        }
        try {
          await projectApi.linkConversation(currentProjectId, conversationId)          
          // 重新加载会话列表
          await get().loadProjectConversations(currentProjectId)
        } catch (error) {
          console.error('[Project Store] Failed to link conversation:', error)
          throw error
        }
      },

      unlinkConversation: async (conversationId) => {
        const { currentProjectId } = get()
        
        if (!currentProjectId) {
          throw new Error('No current project')
        }
        try {
          await projectApi.unlinkConversation(currentProjectId, conversationId)
          
          // 从列表中移除
          set((state) => ({
            projectConversations: state.projectConversations.filter(
              (c) => c.id !== conversationId
            )
          }))
        } catch (error) {
          console.error('[Project Store] Failed to unlink conversation:', error)
          throw error
        }
      },

      // ========== 重置 ==========

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'joii-project-state',
      // 只持久化基本信息，不持久化列表数据
      partialize: (state) => ({
        currentProjectId: state.currentProjectId,
        currentProjectName: state.currentProjectName,
      }),
    }
  )
)
