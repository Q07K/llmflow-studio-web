<template>
  <div
    :class="[styles['node-bg'], { [styles['node-bg-expanded']]: isExpanded }]"
  >
    <div :class="styles['node-wrapper']">
      <img :class="styles['node-icon']" :src="promptNodeIcon" />

      <div :class="styles['vertical-line']"></div>
      <div :class="styles['node-title-wrapper']">
        <div :class="styles['node-title']">PROMPT</div>
        <div :class="styles['node-subtitle']">
          {{ currentRole }}
        </div>
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

      <div :class="styles['dropdown-wrapper']">
        <div :class="styles['dropdown-container']" @click.stop="toggleDropdown">
          <div :class="styles['dropdown-header']">
            <span :class="styles['dropdown-selected']">{{ currentRole }}</span>
            <img
              :style="{
                transform: isDropdownOpen ? 'scaleY(-1)' : 'scaleY(1)'
              }"
              :class="styles['dropdown-icon']"
              :src="nodeExpandedButtonIcon"
            />
          </div>
          <hr
            v-if="isDropdownOpen"
            :class="styles['dropdown-horizontal-line']"
          />
          <ul
            v-if="isDropdownOpen"
            ref="dropdownMenu"
            :class="styles['dropdown-menu-list']"
          >
            <li
              :class="[
                styles['dropdown-item'],
                { [styles['selected']]: option === currentRole }
              ]"
              v-for="option in options"
              :key="option"
              @click.stop="selectOption(option)"
            >
              {{ option }}
            </li>
          </ul>
        </div>
      </div>

      <div :class="styles['text-field-wrapper']">
        <div :class="styles['text-field-title']">TEXT *</div>

        <textarea
          type="prompt"
          v-model="inputText"
          :class="styles['text-field-input']"
        ></textarea>
      </div>
    </div>
    <Handle
      type="source"
      position="right"
      id="nodeRight"
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
    nextTick
  } from 'vue'
  import styles from './PromptNode.module.css'
  import promptNodeIcon from '@/assets/icons/nodes/promptNodeIcon.svg'
  import nodeExpandedButtonIcon from '@/assets/icons/nodes/nodeExpandedButtonIcon.svg'
  import { Handle } from '@vue-flow/core'

  const props = defineProps({
    // VueFlow에서 전달되는 data 객체
    data: {
      type: Object,
      default: () => ({})
    },
    // VueFlow 노드의 기본 props들
    id: {
      type: String,
      default: ''
    },
    // 직접 전달되는 modelValue (fallback용)
    modelValue: {
      type: Object,
      default: () => ({ role: 'system', context: '' })
    }
  })

  // data.modelValue가 있으면 우선 사용하고, 없으면 props.modelValue 사용
  const getModelValue = () => {
    return (
      props.data?.modelValue ||
      props.modelValue || { role: 'system', context: '' }
    )
  }

  // 이벤트 핸들러를 data에서 가져오기
  const getEventHandlers = () => {
    return {
      onUpdateModelValue: props.data?.onUpdateModelValue,
      onNodeDataChanged: props.data?.onNodeDataChanged
    }
  }

  const emit = defineEmits(['update:modelValue', 'node-data-changed'])

  const isExpanded = ref(false)
  const isDropdownOpen = ref(false)
  const inputText = ref(getModelValue().context)
  const currentRole = ref(getModelValue().role)
  const options = ref(['system', 'assistant', 'user'])
  const dropdownMenu = ref(null)
  const dropdownHeight = ref(0)

  // 초기값 설정
  onMounted(() => {
    const modelValue = getModelValue()
    currentRole.value = modelValue.role
    inputText.value = modelValue.context
  })

  // 모델 값이 외부에서 변경되었을 때 로컬 상태 업데이트
  watch(
    () => getModelValue(),
    (newValue) => {
      currentRole.value = newValue.role
      inputText.value = newValue.context
    },
    { deep: true }
  )

  const toggleExpansion = () => {
    isExpanded.value = !isExpanded.value
  }

  const toggleDropdown = async (e) => {
    e.stopPropagation()
    isDropdownOpen.value = !isDropdownOpen.value

    if (isDropdownOpen.value) {
      // 드롭다운이 열린 후 다음 틱에 높이 계산
      await nextTick()
      updateDropdownHeight()
    } else {
      // 드롭다운이 닫히면 높이 초기화
      dropdownHeight.value = 0
    }
  }

  const updateDropdownHeight = () => {
    if (dropdownMenu.value) {
      dropdownHeight.value = dropdownMenu.value.offsetHeight
    }
  }

  const selectOption = (option) => {
    // 로컬 상태 업데이트
    currentRole.value = option

    // 부모 컴포넌트에 알림
    const updatedValue = { role: option, context: inputText.value }
    console.log('PromptNode selectOption:', updatedValue)

    // 이벤트 핸들러 가져오기
    const eventHandlers = getEventHandlers()
    console.log('Event handlers:', eventHandlers)

    // data에 정의된 이벤트 핸들러가 있으면 사용
    if (eventHandlers.onUpdateModelValue) {
      console.log('Calling onUpdateModelValue')
      eventHandlers.onUpdateModelValue(updatedValue)
    }

    // VueFlow 노드 ID 사용 (data.id 우선, 없으면 props.id)
    const nodeId = props.data?.id || props.id
    console.log('Node ID:', nodeId)
    if (nodeId && eventHandlers.onNodeDataChanged) {
      console.log('Calling onNodeDataChanged')
      eventHandlers.onNodeDataChanged({ id: nodeId, data: updatedValue })
    }

    // fallback으로 emit도 실행
    emit('update:modelValue', updatedValue)
    if (nodeId) {
      emit('node-data-changed', { id: nodeId, data: updatedValue })
    }

    isDropdownOpen.value = false
    dropdownHeight.value = 0 // 드롭다운이 닫히면 높이 초기화
  }

  // 텍스트 변경 감지
  watch(inputText, (newValue) => {
    const updatedValue = { role: currentRole.value, context: newValue }

    // 이벤트 핸들러 가져오기
    const eventHandlers = getEventHandlers()

    // data에 정의된 이벤트 핸들러가 있으면 사용
    if (eventHandlers.onUpdateModelValue) {
      eventHandlers.onUpdateModelValue(updatedValue)
    }

    // VueFlow 노드 ID 사용 (data.id 우선, 없으면 props.id)
    const nodeId = props.data?.id || props.id
    if (nodeId && eventHandlers.onNodeDataChanged) {
      eventHandlers.onNodeDataChanged({ id: nodeId, data: updatedValue })
    }

    // fallback으로 emit도 실행
    emit('update:modelValue', updatedValue)
    if (nodeId) {
      emit('node-data-changed', { id: nodeId, data: updatedValue })
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
</script>
