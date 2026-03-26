import { EventHandler } from './types'

type EventMap = Map<string, Set<EventHandler>>

export class EventEmitter<Events extends Record<string, unknown>> {
  private listeners: EventMap = new Map()

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): () => void {
    const eventName = event as string
    let handlers = this.listeners.get(eventName)

    if (!handlers) {
      handlers = new Set()
      this.listeners.set(eventName, handlers)
    }

    handlers.add(handler as EventHandler)

    return () => {
      this.off(event, handler)
    }
  }

  once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): () => void {
    const wrappedHandler: EventHandler<Events[K]> = (payload: Events[K]) => {
      this.off(event, wrappedHandler)
      handler(payload)
    }

    return this.on(event, wrappedHandler)
  }

  off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    const eventName = event as string
    const handlers = this.listeners.get(eventName)

    if (handlers) {
      handlers.delete(handler as EventHandler)
    }
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const eventName = event as string
    const handlers = this.listeners.get(eventName)

    if (handlers) {
      handlers.forEach((handler) => {
        handler(payload)
      })
    }
  }

  clear(): void {
    this.listeners.clear()
  }

  listenerCount(event: keyof Events): number {
    const eventName = event as string
    const handlers = this.listeners.get(eventName)
    return handlers ? handlers.size : 0
  }
}
