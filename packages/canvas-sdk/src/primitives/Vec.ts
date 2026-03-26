export class Vec {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  clone(): Vec {
    return new Vec(this.x, this.y)
  }

  set(x: number, y: number): Vec {
    this.x = x
    this.y = y
    return this
  }

  add(v: Vec): Vec {
    return new Vec(this.x + v.x, this.y + v.y)
  }

  sub(v: Vec): Vec {
    return new Vec(this.x - v.x, this.y - v.y)
  }

  mul(scalar: number): Vec {
    return new Vec(this.x * scalar, this.y * scalar)
  }

  div(scalar: number): Vec {
    if (scalar === 0) {
      throw new Error('Division by zero')
    }
    return new Vec(this.x / scalar, this.y / scalar)
  }

  dot(v: Vec): number {
    return this.x * v.x + this.y * v.y
  }

  cross(v: Vec): number {
    return this.x * v.y - this.y * v.x
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y
  }

  normalize(): Vec {
    const len = this.length()
    if (len === 0) {
      return new Vec(0, 0)
    }
    return this.div(len)
  }

  negate(): Vec {
    return new Vec(-this.x, -this.y)
  }

  rotate(angle: number): Vec {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return new Vec(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    )
  }

  angle(): number {
    return Math.atan2(this.y, this.x)
  }

  angleTo(v: Vec): number {
    return Math.atan2(v.y - this.y, v.x - this.x)
  }

  distanceTo(v: Vec): number {
    const dx = v.x - this.x
    const dy = v.y - this.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  distanceToSq(v: Vec): number {
    const dx = v.x - this.x
    const dy = v.y - this.y
    return dx * dx + dy * dy
  }

  lerp(v: Vec, t: number): Vec {
    return new Vec(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t
    )
  }

  equals(v: Vec, epsilon: number = 0.0001): boolean {
    return Math.abs(this.x - v.x) < epsilon && Math.abs(this.y - v.y) < epsilon
  }

  static fromObject(obj: { x: number; y: number }): Vec {
    return new Vec(obj.x, obj.y)
  }

  static fromAngle(angle: number, length: number = 1): Vec {
    return new Vec(Math.cos(angle) * length, Math.sin(angle) * length)
  }

  static zero(): Vec {
    return new Vec(0, 0)
  }

  static one(): Vec {
    return new Vec(1, 1)
  }

  toJSON(): { x: number; y: number } {
    return { x: this.x, y: this.y }
  }
}
