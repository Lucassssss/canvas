export class TransformMatrix {
  private static DEG_TO_RAD = Math.PI / 180
  private static DECIMALS = 2

  private static round(value: number): number {
    return Math.round(value * Math.pow(10, this.DECIMALS)) / Math.pow(10, this.DECIMALS)
  }

  static compose(
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number,
    scaleX: number = 1,
    scaleY: number = 1
  ): Float32Array {
    const cx = width / 2
    const cy = height / 2
    const rad = rotation * this.DEG_TO_RAD
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    const a = this.round(cos * scaleX)
    const b = this.round(sin * scaleX)
    const c = this.round(-sin * scaleY)
    const d = this.round(cos * scaleY)

    const e = this.round(x - cx)
    const f = this.round(y - cy)

    return new Float32Array([a, b, c, d, e, f])
  }

  static toCssString(matrix: Float32Array): string {
    return `matrix(${matrix[0]}, ${matrix[1]}, ${matrix[2]}, ${matrix[3]}, ${matrix[4]}, ${matrix[5]})`
  }

  static getTranslation(matrix: Float32Array): { x: number; y: number } {
    return { x: matrix[4], y: matrix[5] }
  }

  static getRotation(matrix: Float32Array): number {
    return Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI)
  }

  static multiply(a: Float32Array, b: Float32Array): Float32Array {
    return new Float32Array([
      a[0] * b[0] + a[2] * b[1],
      a[1] * b[0] + a[3] * b[1],
      a[0] * b[2] + a[2] * b[3],
      a[1] * b[2] + a[3] * b[3],
      a[0] * b[4] + a[2] * b[5] + a[4],
      a[1] * b[4] + a[3] * b[5] + a[5],
    ])
  }

  static translate(matrix: Float32Array, dx: number, dy: number): Float32Array {
    return new Float32Array([
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[3],
      matrix[4] + dx,
      matrix[5] + dy,
    ])
  }

  static rotate(matrix: Float32Array, angle: number, cx: number, cy: number): Float32Array {
    const rad = angle * this.DEG_TO_RAD
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    const translateToCenter = new Float32Array([1, 0, 0, 1, -cx, -cy])
    const rotate = new Float32Array([cos, sin, -sin, cos, 0, 0])
    const translateBack = new Float32Array([1, 0, 0, 1, cx, cy])

    const result = this.multiply(this.multiply(translateBack, rotate), translateToCenter)
    return this.multiply(result, matrix)
  }

  static decompose(matrix: Float32Array): {
    x: number
    y: number
    rotation: number
    scaleX: number
    scaleY: number
  } {
    const a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3]
    const e = matrix[4], f = matrix[5]

    const scaleX = Math.sqrt(a * a + b * b)
    const scaleY = Math.sqrt(c * c + d * d)

    const rotation = Math.atan2(b, a) * (180 / Math.PI)

    return {
      x: e,
      y: f,
      rotation,
      scaleX,
      scaleY,
    }
  }
}
