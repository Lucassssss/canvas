import { HistoryEntry, HistoryOptions, EditorState } from './types'

export type HistoryChangeListener = () => void

export class HistoryManager {
  private history: HistoryEntry[] = []
  private historyIndex: number = -1
  private maxHistory: number
  private listeners: Set<HistoryChangeListener> = new Set()

  constructor(options?: HistoryOptions) {
    this.maxHistory = options?.maxHistory ?? 50
  }

  push(state: EditorState): void {
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1)
    }

    const entry: HistoryEntry = {
      shapes: this.deepClone(state.shapes),
      selectedIds: [...state.selectedIds],
    }

    this.history.push(entry)
    this.historyIndex = this.history.length - 1

    if (this.history.length > this.maxHistory) {
      this.history.shift()
      this.historyIndex--
    }

    this.notifyListeners()
  }

  undo(): HistoryEntry | null {
    if (!this.canUndo()) {
      return null
    }

    this.historyIndex--
    this.notifyListeners()
    return this.getCurrentEntry()
  }

  redo(): HistoryEntry | null {
    if (!this.canRedo()) {
      return null
    }

    this.historyIndex++
    this.notifyListeners()
    return this.getCurrentEntry()
  }

  canUndo(): boolean {
    return this.historyIndex > 0
  }

  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1
  }

  clear(): void {
    this.history = []
    this.historyIndex = -1
    this.notifyListeners()
  }

  getCurrentEntry(): HistoryEntry | null {
    if (this.historyIndex < 0 || this.historyIndex >= this.history.length) {
      return null
    }
    return this.deepClone(this.history[this.historyIndex])
  }

  getHistoryLength(): number {
    return this.history.length
  }

  getHistoryIndex(): number {
    return this.historyIndex
  }

  subscribe(listener: HistoryChangeListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  toJSON(): string {
    return JSON.stringify({
      history: this.history,
      historyIndex: this.historyIndex,
      maxHistory: this.maxHistory,
    })
  }

  static fromJSON(json: string): HistoryManager {
    const data = JSON.parse(json)
    const manager = new HistoryManager({ maxHistory: data.maxHistory })
    manager.history = data.history
    manager.historyIndex = data.historyIndex
    return manager
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener())
  }
}
