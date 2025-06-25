// src/config/nodeConfig.js

import DisplayNode from '@/components/nodes/DisplayNode'
import OutputNode from '@/components/nodes/OutputNode'
import PromptNode from '@/components/nodes/PromptNode'

// 노드 타입 설정
export const nodeTypes = {
  display: DisplayNode,
  prompt_node: PromptNode,
  output_node: OutputNode
}

// 초기 노드 설정
export const initialNodes = [
  {
    id: '1',
    position: { x: 300, y: 400 },
    type: 'prompt_node',
    data: {
      modelValue: { role: 'system', context: 'Hello from PromptNode!' }
    },
    events: {},
    direction: 'right'
  },
  {
    id: '3',
    position: { x: 800, y: 400 },
    type: 'output_node',
    data: {
      modelValue: { context: '{"waiting": "for prompt data"}' }
    },
    events: {},
    direction: 'left'
  }
]

// 초기 엣지 설정
export const initialEdges = [
  { id: 'e1-3', source: '1', target: '3', type: 'default' }
]
