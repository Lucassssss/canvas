import React from 'react'
import {
  Canvas,
  createEditor,
  EditorProvider,
  useEditor,
  useSelection,
  useViewport,
} from '@gke/canvas-sdk'
import { ClothingShapeUtil } from './shapes/ClothingShape'

const editor = createEditor()

editor.registerShape(new ClothingShapeUtil())

function App() {
  return (
    <EditorProvider editor={editor}>
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, position: 'relative' }}>
          <Canvas editor={editor} />
        </div>
        <Toolbar />
      </div>
    </EditorProvider>
  )
}

function Header() {
  const editor = useEditor()
  const { selectedIds } = useSelection(editor)
  const viewport = useViewport(editor)

  return React.createElement('div', {
    style: {
      height: 48,
      borderBottom: '1px solid #e5e5e5',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 16,
      backgroundColor: '#fff',
    },
  }, [
    React.createElement('h1', {
      key: 'title',
      style: { fontSize: 16, fontWeight: 600, margin: 0 },
    }, 'AI Draw'),
    React.createElement('div', {
      key: 'info',
      style: { marginLeft: 'auto', fontSize: 12, color: '#666' },
    }, `Zoom: ${(viewport.zoom * 100).toFixed(0)}% | Selected: ${selectedIds.length}`),
  ])
}

function Toolbar() {
  const editor = useEditor()

  const handleAddRect = () => {
    editor.createShape('rectangle', {
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 150,
      height: 100,
      fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
      stroke: '#333',
      strokeWidth: 2,
    })
  }

  const handleAddEllipse = () => {
    editor.createShape('ellipse', {
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 120,
      height: 120,
      fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
      stroke: '#333',
      strokeWidth: 2,
    })
  }

  const handleAddText = () => {
    editor.createShape('text', {
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 200,
      height: 50,
      text: 'Hello World',
      fontSize: 24,
      color: '#333',
    })
  }

  const handleAddClothing = () => {
    editor.createShape('clothing', {
      x: 100,
      y: 100,
      width: 400,
      height: 400,
      clothingView: 'front',
      clothingColors: {
        body: '#191919',
        sleeveLeft: '#8C8C8E',
        sleeveRight: '#8C8C8E',
        collar: '#8C8C8E',
      },
      logoAreas: [
        { id: 'logo_chest', x: 800, y: 500, width: 400, height: 400 },
        { id: 'logo_back', x: 800, y: 1200, width: 500, height: 400 },
      ],
    })
  }

  const handleDelete = () => {
    const selected = editor.getSelectedIds()
    selected.forEach(id => editor.deleteShape(id))
  }

  const handleZoomIn = () => editor.zoomIn()
  const handleZoomOut = () => editor.zoomOut()
  const handleZoomFit = () => editor.zoomToFit()

  return React.createElement('div', {
    style: {
      height: 48,
      borderTop: '1px solid #e5e5e5',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 8,
      backgroundColor: '#fff',
    },
  }, [
    React.createElement('button', {
      key: 'rect',
      onClick: handleAddRect,
      style: buttonStyle,
    }, '矩形'),
    React.createElement('button', {
      key: 'ellipse',
      onClick: handleAddEllipse,
      style: buttonStyle,
    }, '椭圆'),
    React.createElement('button', {
      key: 'text',
      onClick: handleAddText,
      style: buttonStyle,
    }, '文本'),
    React.createElement('button', {
      key: 'clothing',
      onClick: handleAddClothing,
      style: { ...buttonStyle, backgroundColor: '#3B82F6', color: '#fff' },
    }, '服装'),
    React.createElement('div', {
      key: 'sep1',
      style: { width: 1, height: 24, backgroundColor: '#e5e5e5', margin: '0 8px' },
    }),
    React.createElement('button', {
      key: 'delete',
      onClick: handleDelete,
      style: { ...buttonStyle, color: '#EF4444' },
    }, '删除'),
    React.createElement('div', {
      key: 'sep2',
      style: { width: 1, height: 24, backgroundColor: '#e5e5e5', margin: '0 8px' },
    }),
    React.createElement('button', {
      key: 'zoomIn',
      onClick: handleZoomIn,
      style: buttonStyle,
    }, '+'),
    React.createElement('button', {
      key: 'zoomOut',
      onClick: handleZoomOut,
      style: buttonStyle,
    }, '-'),
    React.createElement('button', {
      key: 'zoomFit',
      onClick: handleZoomFit,
      style: buttonStyle,
    }, '适应'),
  ])
}

const buttonStyle: React.CSSProperties = {
  padding: '6px 12px',
  border: '1px solid #e5e5e5',
  borderRadius: 6,
  backgroundColor: '#fff',
  cursor: 'pointer',
  fontSize: 13,
}

export default App
