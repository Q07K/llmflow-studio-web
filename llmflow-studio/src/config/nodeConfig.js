// src/config/nodeConfig.js

import DisplayNode from '@/components/nodes/DisplayNode'
import PromptNode from '@/components/nodes/PromptNode'

// 노드 타입 설정
export const nodeTypes = {
  display: DisplayNode,
  prompt_node: PromptNode
}

// 초기 노드 설정
export const initialNodes = [
  {
    id: '1',
    position: { x: 300, y: 400 },
    type: 'prompt_node',
    data: {
      modelValue: { role: 'user', context: 'Node 1의 초기 텍스트' }
    },
    events: {}
  },
  {
    id: '2',
    position: { x: 600, y: 400 },
    type: 'display_node',
    data: {
      modelValue: { role: 'system', context: 'Output Node의 초기 텍스트' }
    },
    events: {}
  }
]

// 초기 엣지 설정
export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'default' }
]
