export { RectangleShapeUtil, type RectangleShapeProps } from './RectangleShape'
export { EllipseShapeUtil, type EllipseShapeProps } from './EllipseShape'
export { TextShapeUtil, type TextShapeProps } from './TextShape'
export { ImageShapeUtil, type ImageShapeProps } from './ImageShape'
export { GroupShapeUtil, type GroupShapeProps } from './GroupShape'

import type { ShapeRegistry } from '../ShapeRegistry'
import { RectangleShapeUtil } from './RectangleShape'
import { EllipseShapeUtil } from './EllipseShape'
import { TextShapeUtil } from './TextShape'
import { ImageShapeUtil } from './ImageShape'
import { GroupShapeUtil } from './GroupShape'

export function registerDefaultShapes(registry: ShapeRegistry): void {
  registry.register(new RectangleShapeUtil())
  registry.register(new EllipseShapeUtil())
  registry.register(new TextShapeUtil())
  registry.register(new ImageShapeUtil())
  registry.register(new GroupShapeUtil())
}

export const defaultShapeUtils = [
  RectangleShapeUtil,
  EllipseShapeUtil,
  TextShapeUtil,
  ImageShapeUtil,
  GroupShapeUtil,
]
