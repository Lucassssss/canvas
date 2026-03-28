import type { ShapeProps } from '@/app/canvas/shapes/types'
import type { ProjectSnapshot, HistorySnapshot, UserPreferences, CanvasHistoryEntry } from '@/types/canvas/mvp'

const STORAGE_KEYS = {
  PROJECT_META: 'joii_project_meta',
  PROJECT_SNAPSHOT: 'joii_project_snapshot',
  HISTORY: 'joii_history',
  USER_PREFERENCES: 'joii_user_preferences',
  CLIPBOARD: 'joii_clipboard',
} as const

const MAX_STORAGE_SIZE = 4.5 * 1024 * 1024

const isBrowser = typeof window !== 'undefined'

class LocalStorageManager {
  saveProjectSnapshot(project: ProjectSnapshot): boolean {
    if (!isBrowser) return false
    try {
      const data = JSON.stringify(project)
      if (data.length > MAX_STORAGE_SIZE) {
        console.warn('Project snapshot too large for localStorage')
        return false
      }
      localStorage.setItem(STORAGE_KEYS.PROJECT_SNAPSHOT, data)
      return true
    } catch (e) {
      console.error('Failed to save project snapshot:', e)
      return false
    }
  }

  loadProjectSnapshot(): ProjectSnapshot | null {
    if (!isBrowser) return null
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECT_SNAPSHOT)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error('Failed to load project snapshot:', e)
      return null
    }
  }

  saveHistory(entries: CanvasHistoryEntry[], currentIndex: number): void {
    if (!isBrowser) return
    const snapshot: HistorySnapshot = {
      entries: entries.slice(-50),
      currentIndex: Math.min(currentIndex, entries.length - 1),
      maxEntries: 50,
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(snapshot))
  }

  loadHistory(): HistorySnapshot | null {
    if (!isBrowser) return null
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  saveUserPreferences(prefs: UserPreferences): void {
    if (!isBrowser) return
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs))
  }

  loadUserPreferences(): UserPreferences | null {
    if (!isBrowser) return null
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  saveClipboard(shapes: ShapeProps[]): void {
    if (!isBrowser) return
    const data = JSON.stringify({
      shapes,
      timestamp: Date.now(),
    })
    if (data.length > MAX_STORAGE_SIZE) {
      console.warn('Clipboard too large')
      return
    }
    localStorage.setItem(STORAGE_KEYS.CLIPBOARD, data)
  }

  loadClipboard(): { shapes: ShapeProps[]; timestamp: number } | null {
    if (!isBrowser) return null
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLIPBOARD)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  clearClipboard(): void {
    if (!isBrowser) return
    localStorage.removeItem(STORAGE_KEYS.CLIPBOARD)
  }

  saveProjectMeta(meta: Omit<ProjectSnapshot, 'shapes' | 'viewport' | 'selectedIds'>): void {
    if (!isBrowser) return
    localStorage.setItem(STORAGE_KEYS.PROJECT_META, JSON.stringify(meta))
  }

  loadProjectMeta(): Omit<ProjectSnapshot, 'shapes' | 'viewport' | 'selectedIds'> | null {
    if (!isBrowser) return null
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECT_META)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  clearAll(): void {
    if (!isBrowser) return
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  getStorageUsage(): { used: number; available: number } {
    if (!isBrowser) return { used: 0, available: MAX_STORAGE_SIZE * 2 }
    let used = 0
    Object.values(STORAGE_KEYS).forEach((key) => {
      const data = localStorage.getItem(key)
      if (data) {
        used += data.length * 2
      }
    })
    return {
      used,
      available: MAX_STORAGE_SIZE * 2 - used,
    }
  }
}

export const localStorageManager = new LocalStorageManager()
