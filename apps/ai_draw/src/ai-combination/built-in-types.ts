import { combinationRegistry } from './registry'

export function registerBuiltInTypes(): void {
  combinationRegistry.register({
    id: 'simple-tryon',
    name: '服装换装',
    icon: 'shirt',
    description: '模特图 + 服装图 = 换装结果',
    slots: [
      {
        id: 'model',
        name: '模特图',
        type: 'image',
        role: 'input',
        placeholder: '拖入或上传模特图',
        acceptDrop: true,
      },
      {
        id: 'clothing',
        name: '服装图',
        type: 'image',
        role: 'input',
        placeholder: '拖入或上传服装图',
        acceptDrop: true,
      },
      {
        id: 'result',
        name: '结果图',
        type: 'image',
        role: 'output',
        placeholder: '生成结果',
      },
    ],
    aiConfig: {
      model: 'tryon-v1',
      promptTemplate: '将{{clothing}}服装应用到{{model}}人物身上，保持人物面部特征和姿势自然',
      supportedResolutions: [
        { width: 512, height: 512, label: '512×512' },
        { width: 768, height: 1024, label: '768×1024' },
        { width: 1024, height: 1024, label: '1024×1024' },
      ],
    },
  })

  combinationRegistry.register({
    id: 'fixed-face-tryon',
    name: '固定面部换衣',
    icon: 'user-check',
    description: '保持固定面部特征进行换装',
    slots: [
      {
        id: 'model',
        name: '模特图',
        type: 'image',
        role: 'input',
        placeholder: '拖入模特图',
        acceptDrop: true,
      },
      {
        id: 'face',
        name: '面部参考',
        type: 'image',
        role: 'input',
        placeholder: '拖入面部参考图',
        acceptDrop: true,
      },
      {
        id: 'clothing',
        name: '服装图',
        type: 'image',
        role: 'input',
        placeholder: '拖入服装图',
        acceptDrop: true,
      },
      {
        id: 'result',
        name: '结果图',
        type: 'image',
        role: 'output',
        placeholder: '生成结果',
      },
    ],
    aiConfig: {
      model: 'tryon-fixed-face-v1',
      promptTemplate: '将{{clothing}}服装应用到人物身上，使用{{face}}作为面部参考，保持面部特征不变',
      supportedResolutions: [
        { width: 512, height: 512, label: '512×512' },
        { width: 768, height: 1024, label: '768×1024' },
        { width: 1024, height: 1024, label: '1024×1024' },
      ],
    },
  })

  combinationRegistry.register({
    id: 'fixed-face-bg-tryon',
    name: '固定面部背景换衣',
    icon: 'image',
    description: '保持固定面部和背景进行换装',
    slots: [
      {
        id: 'model',
        name: '模特图',
        type: 'image',
        role: 'input',
        placeholder: '拖入模特图',
        acceptDrop: true,
      },
      {
        id: 'face',
        name: '面部参考',
        type: 'image',
        role: 'input',
        placeholder: '拖入面部参考图',
        acceptDrop: true,
      },
      {
        id: 'background',
        name: '背景参考',
        type: 'image',
        role: 'input',
        placeholder: '拖入背景参考图',
        acceptDrop: true,
      },
      {
        id: 'clothing',
        name: '服装图',
        type: 'image',
        role: 'input',
        placeholder: '拖入服装图',
        acceptDrop: true,
      },
      {
        id: 'result',
        name: '结果图',
        type: 'image',
        role: 'output',
        placeholder: '生成结果',
      },
    ],
    aiConfig: {
      model: 'tryon-fixed-face-bg-v1',
      promptTemplate: '将{{clothing}}服装应用到人物身上，使用{{face}}作为面部参考，使用{{background}}作为背景，保持面部特征和背景不变',
      supportedResolutions: [
        { width: 512, height: 512, label: '512×512' },
        { width: 768, height: 1024, label: '768×1024' },
        { width: 1024, height: 1024, label: '1024×1024' },
      ],
    },
  })

  combinationRegistry.register({
    id: 'fixed-face-bg-pose-tryon',
    name: '固定面部背景姿势换衣',
    icon: 'scan',
    description: '保持固定面部、背景和参考姿势进行换装',
    slots: [
      {
        id: 'model',
        name: '模特图',
        type: 'image',
        role: 'input',
        placeholder: '拖入模特图',
        acceptDrop: true,
      },
      {
        id: 'face',
        name: '面部参考',
        type: 'image',
        role: 'input',
        placeholder: '拖入面部参考图',
        acceptDrop: true,
      },
      {
        id: 'background',
        name: '背景参考',
        type: 'image',
        role: 'input',
        placeholder: '拖入背景参考图',
        acceptDrop: true,
      },
      {
        id: 'pose',
        name: '姿势参考',
        type: 'image',
        role: 'input',
        placeholder: '拖入姿势参考图',
        acceptDrop: true,
      },
      {
        id: 'clothing',
        name: '服装图',
        type: 'image',
        role: 'input',
        placeholder: '拖入服装图',
        acceptDrop: true,
      },
      {
        id: 'result',
        name: '结果图',
        type: 'image',
        role: 'output',
        placeholder: '生成结果',
      },
    ],
    aiConfig: {
      model: 'tryon-fixed-face-bg-pose-v1',
      promptTemplate: '将{{clothing}}服装应用到人物身上，使用{{face}}作为面部参考，使用{{background}}作为背景，参考{{pose}}的姿势',
      supportedResolutions: [
        { width: 512, height: 512, label: '512×512' },
        { width: 768, height: 1024, label: '768×1024' },
        { width: 1024, height: 1024, label: '1024×1024' },
      ],
    },
  })

  combinationRegistry.register({
    id: 'pose-fission',
    name: '姿势裂变',
    icon: 'copy-plus',
    description: '一个输入图片，生成5个不同的姿势',
    slots: [
      {
        id: 'source',
        name: '输入图',
        type: 'image',
        role: 'input',
        placeholder: '拖入参考图片',
        acceptDrop: true,
      },
      {
        id: 'result1',
        name: '姿势1',
        type: 'image',
        role: 'output',
        placeholder: '姿势1',
      },
      {
        id: 'result2',
        name: '姿势2',
        type: 'image',
        role: 'output',
        placeholder: '姿势2',
      },
      {
        id: 'result3',
        name: '姿势3',
        type: 'image',
        role: 'output',
        placeholder: '姿势3',
      },
      {
        id: 'result4',
        name: '姿势4',
        type: 'image',
        role: 'output',
        placeholder: '姿势4',
      },
      {
        id: 'result5',
        name: '姿势5',
        type: 'image',
        role: 'output',
        placeholder: '姿势5',
      },
    ],
    aiConfig: {
      model: 'pose-fission-v1',
      promptTemplate: '基于{{source}}人物，生成5种不同姿势的变体',
      supportedResolutions: [
        { width: 512, height: 512, label: '512×512' },
        { width: 768, height: 768, label: '768×768' },
      ],
    },
  })
}
