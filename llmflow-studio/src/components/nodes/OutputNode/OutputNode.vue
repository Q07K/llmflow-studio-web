<template>
  <div
    :class="[styles['node-bg'], { [styles['node-bg-expanded']]: isExpanded }]"
  >
    <div :class="styles['node-wrapper']">
      <AppIcon name="outputNode" :class="styles['node-icon']" />

      <div :class="styles['vertical-line']"></div>
      <div :class="styles['node-title-wrapper']">
        <div :class="styles['node-title']">OUTPUT</div>
        <div :class="styles['node-subtitle']">Display NODE Response</div>
      </div>

      <div :class="styles['node-button']" @click="toggleExpansion">
        <img
          :style="{ transform: isExpanded ? 'scaleY(-1)' : 'scaleY(1)' }"
          :class="styles['dropdown-icon']"
          :src="nodeExpandedButtonIcon"
        />
      </div>
    </div>

    <div v-if="isExpanded">
      <hr :class="styles['horizontal-line']" />
      <div :class="styles['text-field-wrapper']">
        <div :class="styles['text-field-title']">Response</div>
        <pre :class="styles['text-field-input']">{{ formattedResponse }}</pre>
      </div>
    </div>
    <Handle
      type="source"
      position="left"
      id="nodeLeft"
      :class="styles['node-handle']"
    />
  </div>
</template>

<script setup>
  import {
    ref,
    watch,
    defineProps,
    defineEmits,
    onMounted,
    onUnmounted,
    computed
  } from 'vue'
  import styles from './/OutputNode.module.css'
  import nodeExpandedButtonIcon from '@/assets/icons/nodes/nodeExpandedButtonIcon.svg'
  import { Handle, useVueFlow } from '@vue-flow/core'
  import AppIcon from '@/components/AppIcon.vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({ context: '{"none": 1}' })
    },
    id: {
      type: String,
      default: ''
    }
  })

  const { nodes, edges } = useVueFlow()

  const emit = defineEmits(['update:modelValue', 'node-data-changed'])

  const isExpanded = ref(false)
  const isDropdownOpen = ref(false)
  const input = ref(props.modelValue.context)
  const currentRole = ref(props.modelValue.role)
  const dropdownMenu = ref(null)
  const dropdownHeight = ref(0)

  // 초기값 설정
  onMounted(() => {
    input.value = props.modelValue.context
  })

  // 모델 값이 외부에서 변경되었을 때 로컬 상태 업데이트
  watch(
    () => props.modelValue,
    (newValue) => {
      input.value = newValue.context
    },
    { deep: true }
  )

  const toggleExpansion = () => {
    isExpanded.value = !isExpanded.value
  }

  const updateDropdownHeight = () => {
    if (dropdownMenu.value) {
      dropdownHeight.value = dropdownMenu.value.offsetHeight
    }
  }

  // 텍스트 변경 감지
  watch(input, (newValue) => {
    const updatedValue = { role: currentRole.value, context: newValue }
    emit('update:modelValue', updatedValue)

    if (props.id) {
      emit('node-data-changed', { id: props.id, data: updatedValue })
    }
  })

  // 드롭다운 외부 클릭 감지하여 닫기
  const handleClickOutside = () => {
    if (isDropdownOpen.value) {
      isDropdownOpen.value = false
      dropdownHeight.value = 0 // 드롭다운이 닫히면 높이 초기화
    }
  }

  // 윈도우 리사이즈 이벤트 핸들러
  const handleResize = () => {
    if (isDropdownOpen.value) {
      updateDropdownHeight()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', handleResize)
  })

  const formattedResponse = computed(() => {
    // 연결된 PromptNode의 데이터를 찾기
    const connectedPromptNodes = []

    if (edges.value && nodes.value) {
      // 현재 노드로 들어오는 엣지 찾기
      const incomingEdges = edges.value.filter(
        (edge) => edge.target === props.id
      )

      // 각 들어오는 엣지의 소스 노드 중 PromptNode 찾기
      incomingEdges.forEach((edge) => {
        const sourceNode = nodes.value.find((node) => node.id === edge.source)
        if (sourceNode && sourceNode.type === 'prompt_node') {
          connectedPromptNodes.push({
            id: sourceNode.id,
            data: sourceNode.data,
            props: {
              modelValue: sourceNode.data?.modelValue || {
                role: 'system',
                context: ''
              },
              id: sourceNode.id
            }
          })
        }
      })
    }

    // PromptNode의 props 정보를 포맷팅해서 표시
    if (connectedPromptNodes.length > 0) {
      const promptData = {
        connectedPromptNodes: connectedPromptNodes.map((node) => ({
          nodeId: node.id,
          defineProps: {
            modelValue: {
              type: 'Object',
              default: '() => ({ role: "system", context: "" })',
              currentValue: node.props.modelValue
            },
            id: {
              type: 'String',
              default: '""',
              currentValue: node.props.id
            }
          }
        }))
      }
      return JSON.stringify(promptData, null, 2)
    }

    // 연결된 PromptNode가 없으면 기본 context 표시
    if (props.modelValue.context == null) return ''
    try {
      const obj =
        typeof props.modelValue.context === 'string'
          ? JSON.parse(props.modelValue.context)
          : props.modelValue.context
      return JSON.stringify(obj, null, 4)
    } catch (e) {
      return String(props.modelValue.context)
    }
  })
</script>
