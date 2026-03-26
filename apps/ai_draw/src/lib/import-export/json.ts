import type { ShapeProps, ViewportState } from '../../canvas/shapes/types'

export interface ProjectExportV1 {
  version: '1.0'
  type: 'joii-project'
  metadata: {
    name: string
    exportedAt: number
    exportedBy: string
  }
  canvas: {
    viewport: ViewportState
    shapes: ShapeProps[]
  }
}

export interface ImportResult {
  success: boolean
  project?: ProjectExportV1
  error?: string
  warnings?: string[]
}

export interface ExportOptions {
  pretty?: boolean
  includeMetadata?: boolean
}

class JSONProjectExporter {
  export(
    state: { shapes: ShapeProps[]; viewport: ViewportState },
    name: string
  ): ProjectExportV1 {
    return {
      version: '1.0',
      type: 'joii-project',
      metadata: {
        name,
        exportedAt: Date.now(),
        exportedBy: 'Joii Canvas',
      },
      canvas: {
        viewport: state.viewport,
        shapes: state.shapes,
      },
    }
  }

  exportToString(
    state: { shapes: ShapeProps[]; viewport: ViewportState },
    name: string,
    options: ExportOptions = {}
  ): string {
    const project = this.export(state, name)
    return options.pretty ? JSON.stringify(project, null, 2) : JSON.stringify(project)
  }

  downloadAsFile(state: { shapes: ShapeProps[]; viewport: ViewportState }, name: string): void {
    const content = this.exportToString(state, name, { pretty: true, includeMetadata: true })
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${name.replace(/[^a-z0-9]/gi, '_')}.joii.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

class JSONProjectImporter {
  validate(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Invalid JSON structure'] }
    }

    const obj = data as Record<string, unknown>

    if (obj.version !== '1.0') {
      errors.push('Unsupported project version')
    }

    if (obj.type !== 'joii-project') {
      errors.push('Invalid project format: not a Joii project')
    }

    if (!obj.canvas || typeof obj.canvas !== 'object') {
      errors.push('Missing canvas data')
    } else {
      const canvas = obj.canvas as Record<string, unknown>
      if (!Array.isArray(canvas.shapes)) {
        errors.push('Invalid canvas: shapes must be an array')
      }
      if (!canvas.viewport || typeof canvas.viewport !== 'object') {
        errors.push('Invalid canvas: viewport is required')
      }
    }

    return { valid: errors.length === 0, errors }
  }

  import(jsonString: string): ImportResult {
    try {
      const data = JSON.parse(jsonString)
      const validation = this.validate(data)

      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join('; '),
        }
      }

      return { success: true, project: data as ProjectExportV1 }
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Failed to parse JSON',
      }
    }
  }

  importFromFile(file: File): Promise<ImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(this.import(result))
      }
      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to read file',
        })
      }
      reader.readAsText(file)
    })
  }

  extractCanvasState(project: ProjectExportV1): { shapes: ShapeProps[]; viewport: ViewportState } {
    return {
      shapes: project.canvas.shapes,
      viewport: project.canvas.viewport,
    }
  }
}

export const jsonExporter = new JSONProjectExporter()
export const jsonImporter = new JSONProjectImporter()