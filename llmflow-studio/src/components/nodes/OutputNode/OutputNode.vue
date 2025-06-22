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
  import { Handle } from '@vue-flow/core'
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
    if (props.modelValue.context == null) return ''
    try {
      // context가 문자열이면 파싱 후 포맷팅, 아니면 그대로 포맷팅
      const obj =
        typeof props.modelValue.context === 'string'
          ? JSON.parse(props.modelValue.context)
          : props.modelValue.context
      return JSON.stringify(obj, null, 4)
    } catch (e) {
      // 파싱 실패 시 원본 문자열 반환
      return String(props.modelValue.context)
    }
  })
</script>
