export interface BufferedUpdate {
  id: string
  props: Record<string, number | string | undefined>
  timestamp: number
}

type FlushCallback = (updates: Map<string, Record<string, number | string | undefined>>) => void

export class OperationBuffer {
  private buffer: Map<string, Record<string, number | string | undefined>> = new Map()
  private pendingIds: Set<string> = new Set()
  private flushScheduled: boolean = false
  private onFlush: FlushCallback

  constructor(onFlush: FlushCallback) {
    this.onFlush = onFlush
  }

  record(id: string, props: Record<string, number | string | undefined>): void {
    this.pendingIds.add(id)

    const existing = this.buffer.get(id) || {}
    this.buffer.set(id, { ...existing, ...props })

    this.scheduleFlush()
  }

  private scheduleFlush(): void {
    if (this.flushScheduled) return

    this.flushScheduled = true
    requestAnimationFrame(() => {
      this.flush()
    })
  }

  flush(): void {
    if (this.buffer.size === 0) {
      this.flushScheduled = false
      return
    }

    this.onFlush(new Map(this.buffer))
    this.buffer.clear()
    this.pendingIds.clear()
    this.flushScheduled = false
  }

  forceFlush(): void {
    if (this.flushScheduled) {
      cancelAnimationFrame(this.flushScheduled as unknown as number)
    }
    this.flush()
  }

  hasPending(id?: string): boolean {
    if (id) {
      return this.pendingIds.has(id)
    }
    return this.buffer.size > 0
  }
}

export function roundProps<T extends Record<string, number | string | undefined>>(
  props: T,
  decimals: number = 2
): T {
  const result: Record<string, number | string | undefined> = {}
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'number') {
      result[key] = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
    } else {
      result[key] = value
    }
  }
  return result as T
}
