import { roundProps } from './operation-buffer'

export interface TransformSnapshot {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
}

interface Delta {
  dx: number
  dy: number
  dRotation: number
  dScaleX: number
  dScaleY: number
}

export class IncrementalTransform {
  private snapshots: Map<string, TransformSnapshot> = new Map()
  private deltas: Map<string, Delta> = new Map()

  beginTransform(id: string, state: TransformSnapshot): void {
    this.snapshots.set(id, { ...state })
    this.deltas.set(id, {
      dx: 0,
      dy: 0,
      dRotation: 0,
      dScaleX: 1,
      dScaleY: 1,
    })
  }

  recordDelta(
    id: string,
    dx: number = 0,
    dy: number = 0,
    dRotation: number = 0,
    dScaleX: number = 1,
    dScaleY: number = 1
  ): void {
    const delta = this.deltas.get(id)
    if (!delta) return

    delta.dx += dx
    delta.dy += dy
    delta.dRotation += dRotation
    delta.dScaleX *= dScaleX
    delta.dScaleY *= dScaleY
  }

  getFinalTransform(id: string): TransformSnapshot | null {
    const snapshot = this.snapshots.get(id)
    const delta = this.deltas.get(id)
    if (!snapshot || !delta) return null

    const result = roundProps({
      id,
      x: snapshot.x + delta.dx,
      y: snapshot.y + delta.dy,
      width: snapshot.width * delta.dScaleX,
      height: snapshot.height * delta.dScaleY,
      rotation: snapshot.rotation + delta.dRotation,
      scaleX: snapshot.scaleX * delta.dScaleX,
      scaleY: snapshot.scaleY * delta.dScaleY,
    })

    return result as TransformSnapshot
  }

  commit(id: string): void {
    this.snapshots.delete(id)
    this.deltas.delete(id)
  }

  rollback(id: string): TransformSnapshot | null {
    const snapshot = this.snapshots.get(id)
    this.commit(id)
    return snapshot || null
  }

  hasActive(id: string): boolean {
    return this.snapshots.has(id)
  }
}
