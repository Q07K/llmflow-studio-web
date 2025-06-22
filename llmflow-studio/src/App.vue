<template>
  <div class="vue-flow-container">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :nodeTypes="nodeTypes"
      @connect="onConnect"
    >
      <AppBackground :dark="dark" />
      <Controls position="top-left">
        <ControlButton title="Toggle Dark Mode" @click="toggleDarkMode">
          <AppIcon :name="dark ? 'moon' : 'sun'" size="16" />
        </ControlButton>
      </Controls>
    </VueFlow>
  </div>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { VueFlow, useVueFlow } from '@vue-flow/core'
  import { Controls, ControlButton } from '@vue-flow/controls'
  import '@vue-flow/core/dist/style.css'
  import '@vue-flow/core/dist/theme-default.css'
  import AppBackground from './views/AppBackground.vue'
  import AppIcon from './components/AppIcon.vue'
  import { nodeTypes, initialNodes, initialEdges } from './config/nodeConfig.js'
  import '@/assets/scss/App.css'
  import '@/assets/scss/ControlsFix.css'

  const dark = ref(false)
  const { nodes, edges, setNodes, setEdges, addEdges } = useVueFlow()

  function toggleDarkMode() {
    dark.value = !dark.value
  }

  function onConnect(params) {
    const sourceNode = nodes.value.find((n) => n.id === params.source)
    const targetNode = nodes.value.find((n) => n.id === params.target)

    // 방향이 같으면 연결 막기
    if (sourceNode?.direction === targetNode?.direction) {
      alert('같은 방향 노드끼리는 연결할 수 없습니다.')
      return
    }

    addEdges([
      {
        id: `e${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        type: 'default'
      }
    ])
  }

  // 다크 모드 상태에 따라 body class 토글
  watch(dark, (val) => {
    if (val) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  })

  function updateNodeData(nodeId, newData) {
    const index = nodes.value.findIndex((node) => node.id === nodeId)
    if (index !== -1) {
      const updatedNodes = [...nodes.value]
      updatedNodes[index] = {
        ...updatedNodes[index],
        data: {
          ...updatedNodes[index].data,
          modelValue: newData
        }
      }
      setNodes(updatedNodes)
    } else {
      console.warn(
        `ID가 ${nodeId}인 노드를 찾을 수 없어 업데이트할 수 없습니다.`
      )
    }
  }

  function handleNodeDataChanged(event) {
    const { id, data } = event
    updateNodeData(id, data)
  }

  const nodesWithEvents = initialNodes.map((node) => ({
    ...node,
    events: {
      'update:modelValue': (newValue) => updateNodeData(node.id, newValue),
      'node-data-changed': handleNodeDataChanged
    }
  }))

  onMounted(() => {
    setNodes(nodesWithEvents)
    setEdges(initialEdges)
  })
</script>
