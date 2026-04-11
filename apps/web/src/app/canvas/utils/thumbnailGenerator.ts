import type { ShapeProps } from '../shapes/types'

const THUMB_SIZE = 200 // request 200px wide optimized thumbnails

/**
 * Score a shape by how "interesting" it is as a thumbnail candidate.
 * Higher = better candidate.
 */
function scoreShape(shape: ShapeProps): number {
  if (shape.type === 'ai-combination' && shape.combinationResults?.length) {
    return 99999
  }
  if (shape.type === 'custom-combination' && shape.customOutputSlots) {
    const hasOutput = shape.customOutputSlots.some(s => s.imageUrl)
    if (hasOutput) return 88888
  }
  if (shape.type === 'image' && shape.imageUrl) {
    return (shape.width * shape.height) / 1000
  }
  return -1
}

/**
 * Given a shape, return the best image URL to use for thumbnailing.
 */
function extractUrl(shape: ShapeProps): string | null {
  if (shape.type === 'ai-combination' && shape.combinationResults?.length) {
    return shape.combinationResults[0]
  }
  if (shape.type === 'custom-combination' && shape.customOutputSlots) {
    const first = shape.customOutputSlots.find(s => s.imageUrl)
    if (first?.imageUrl) return first.imageUrl
  }
  if (shape.type === 'image' && shape.imageUrl) {
    return shape.imageUrl
  }
  if (shape.type === 'ai-combination' && shape.slotContents) {
    const firstSlot = Object.values(shape.slotContents).find(s => s.imageUrl)
    if (firstSlot?.imageUrl) return firstSlot.imageUrl
  }
  return null
}

function optimizeThumbnailUrl(url: string): string {
  try {
    const u = new URL(url)
    u.searchParams.set('w', THUMB_SIZE.toString())
    u.searchParams.set('fmt', 'webp')
    return u.toString()
  } catch {
    return url
  }
}

/**
 * Extract up to 2 thumbnail URLs from the current canvas shapes.
 * Returns a JSON-serialized string array for storage in the single `thumbnail` DB field.
 * Returns null if no image content exists on canvas.
 */
export function extractThumbnailFromShapes(shapes: ShapeProps[]): string | null {
  if (!shapes.length) return null

  // Score all shapes and sort descending
  const candidates = shapes
    .map(shape => ({ shape, score: scoreShape(shape), url: extractUrl(shape) }))
    .filter(c => c.score >= 0 && c.url)
    .sort((a, b) => b.score - a.score)

  if (!candidates.length) return null

  // Deduplicate URLs and take top 2
  const seen = new Set<string>()
  const urls: string[] = []
  for (const c of candidates) {
    const optimized = optimizeThumbnailUrl(c.url!)
    if (!seen.has(optimized)) {
      seen.add(optimized)
      urls.push(optimized)
    }
    if (urls.length === 2) break
  }

  if (!urls.length) return null

  // Store as JSON array so ProjectCard can render 1 or 2 images
  return JSON.stringify(urls)
}
