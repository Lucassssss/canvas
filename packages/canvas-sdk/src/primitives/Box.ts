import { Vec } from './Vec'

export class Box {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 0,
    public height: number = 0
  ) {}

  get minX(): number {
    return this.x
  }

  get minY(): number {
    return this.y
  }

  get maxX(): number {
    return this.x + this.width
  }

  get maxY(): number {
    return this.y + this.height
  }

  get centerX(): number {
    return this.x + this.width / 2
  }

  get centerY(): number {
    return this.y + this.height / 2
  }

  get center(): Vec {
    return new Vec(this.centerX, this.centerY)
  }

  get topLeft(): Vec {
    return new Vec(this.x, this.y)
  }

  get topRight(): Vec {
    return new Vec(this.maxX, this.y)
  }

  get bottomLeft(): Vec {
    return new Vec(this.x, this.maxY)
  }

  get bottomRight(): Vec {
    return new Vec(this.maxX, this.maxY)
  }

  clone(): Box {
    return new Box(this.x, this.y, this.width, this.height)
  }

  set(x: number, y: number, width: number, height: number): Box {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    return this
  }

  containsPoint(point: Vec): boolean {
    return (
      point.x >= this.x &&
      point.x <= this.maxX &&
      point.y >= this.y &&
      point.y <= this.maxY
    )
  }

  containsBox(box: Box): boolean {
    return (
      box.x >= this.x &&
      box.y >= this.y &&
      box.maxX <= this.maxX &&
      box.maxY <= this.maxY
    )
  }

  intersects(box: Box): boolean {
    return (
      this.x < box.maxX &&
      this.maxX > box.x &&
      this.y < box.maxY &&
      this.maxY > box.y
    )
  }

  union(box: Box): Box {
    const minX = Math.min(this.x, box.x)
    const minY = Math.min(this.y, box.y)
    const maxX = Math.max(this.maxX, box.maxX)
    const maxY = Math.max(this.maxY, box.maxY)
    return new Box(minX, minY, maxX - minX, maxY - minY)
  }

  intersection(box: Box): Box | null {
    const minX = Math.max(this.x, box.x)
    const minY = Math.max(this.y, box.y)
    const maxX = Math.min(this.maxX, box.maxX)
    const maxY = Math.min(this.maxY, box.maxY)

    if (minX >= maxX || minY >= maxY) {
      return null
    }

    return new Box(minX, minY, maxX - minX, maxY - minY)
  }

  expand(padding: number): Box {
    return new Box(
      this.x - padding,
      this.y - padding,
      this.width + padding * 2,
      this.height + padding * 2
    )
  }

  translate(dx: number, dy: number): Box {
    return new Box(this.x + dx, this.y + dy, this.width, this.height)
  }

  scale(sx: number, sy: number = sx): Box {
    return new Box(
      this.x * sx,
      this.y * sy,
      this.width * sx,
      this.height * sy
    )
  }

  equals(box: Box, epsilon: number = 0.0001): boolean {
    return (
      Math.abs(this.x - box.x) < epsilon &&
      Math.abs(this.y - box.y) < epsilon &&
      Math.abs(this.width - box.width) < epsilon &&
      Math.abs(this.height - box.height) < epsilon
    )
  }

  getArea(): number {
    return this.width * this.height
  }

  getPerimeter(): number {
    return (this.width + this.height) * 2
  }

  isEmpty(): boolean {
    return this.width <= 0 || this.height <= 0
  }

  static fromPoints(points: Vec[]): Box {
    if (points.length === 0) {
      return new Box()
    }

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (const point of points) {
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)
    }

    return new Box(minX, minY, maxX - minX, maxY - minY)
  }

  static fromCenter(center: Vec, width: number, height: number): Box {
    return new Box(
      center.x - width / 2,
      center.y - height / 2,
      width,
      height
    )
  }

  static fromCorners(topLeft: Vec, bottomRight: Vec): Box {
    const minX = Math.min(topLeft.x, bottomRight.x)
    const minY = Math.min(topLeft.y, bottomRight.y)
    const maxX = Math.max(topLeft.x, bottomRight.x)
    const maxY = Math.max(topLeft.y, bottomRight.y)
    return new Box(minX, minY, maxX - minX, maxY - minY)
  }

  toJSON(): { x: number; y: number; width: number; height: number } {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }
}
