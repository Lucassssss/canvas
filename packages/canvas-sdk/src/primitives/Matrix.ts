import { Vec } from './Vec'

export class Matrix {
  constructor(
    public a: number = 1,
    public b: number = 0,
    public c: number = 0,
    public d: number = 1,
    public e: number = 0,
    public f: number = 0
  ) {}

  translate(x: number, y: number): Matrix {
    return this.multiply(new Matrix(1, 0, 0, 1, x, y))
  }

  scale(sx: number, sy?: number): Matrix {
    const scaleY = sy !== undefined ? sy : sx
    return this.multiply(new Matrix(sx, 0, 0, scaleY, 0, 0))
  }

  rotate(angle: number): Matrix {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return this.multiply(new Matrix(cos, sin, -sin, cos, 0, 0))
  }

  rotateDeg(angle: number): Matrix {
    return this.rotate((angle * Math.PI) / 180)
  }

  multiply(m: Matrix): Matrix {
    return new Matrix(
      this.a * m.a + this.c * m.b,
      this.b * m.a + this.d * m.b,
      this.a * m.c + this.c * m.d,
      this.b * m.c + this.d * m.d,
      this.a * m.e + this.c * m.f + this.e,
      this.b * m.e + this.d * m.f + this.f
    )
  }

  inverse(): Matrix {
    const det = this.a * this.d - this.b * this.c
    if (det === 0) {
      throw new Error('Matrix is not invertible')
    }
    const invDet = 1 / det
    return new Matrix(
      this.d * invDet,
      -this.b * invDet,
      -this.c * invDet,
      this.a * invDet,
      (this.c * this.f - this.d * this.e) * invDet,
      (this.b * this.e - this.a * this.f) * invDet
    )
  }

  applyToPoint(point: Vec): Vec {
    return new Vec(
      this.a * point.x + this.c * point.y + this.e,
      this.b * point.x + this.d * point.y + this.f
    )
  }

  applyToPoints(points: Vec[]): Vec[] {
    return points.map((p) => this.applyToPoint(p))
  }

  clone(): Matrix {
    return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f)
  }

  equals(m: Matrix): boolean {
    return (
      this.a === m.a &&
      this.b === m.b &&
      this.c === m.c &&
      this.d === m.d &&
      this.e === m.e &&
      this.f === m.f
    )
  }

  toCSS(): string {
    return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`
  }

  static identity(): Matrix {
    return new Matrix(1, 0, 0, 1, 0, 0)
  }

  static fromTranslation(x: number, y: number): Matrix {
    return new Matrix(1, 0, 0, 1, x, y)
  }

  static fromScale(sx: number, sy?: number): Matrix {
    const scaleY = sy !== undefined ? sy : sx
    return new Matrix(sx, 0, 0, scaleY, 0, 0)
  }

  static fromRotation(angle: number): Matrix {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return new Matrix(cos, sin, -sin, cos, 0, 0)
  }
}
