<template>
  <div :class="[styles['node-bg'], { [styles['node-bg-expanded']]: isExpanded }]">

    <div :class="styles['node-wrapper']">

      <img :class="styles['node-icon']" :src="promptNodeIcon"/>

      <div :class="styles['vertical-line']"></div>
      <div :class="styles['node-title-wrapper']">
        <div :class="styles['node-title']">PROMPT</div>
        <div :class="styles['node-subtitle']" >
          {{ currentRole }}
        </div>
      </div>
      
      <div :class="styles['node-button']" @click="toggleExpansion">
        <img
        :style="{ transform: isExpanded ? 'scaleY(-1)' : 'scaleY(1)'}"
        :class="styles['dropdown-icon']"
        :src="nodeExpandedButtonIcon"
        />
      </div>

    </div>

    <div v-if="isExpanded">
      <hr :class="styles['horizontal-line']" />

      <div 
        :class="styles['dropdown-wrapper']"
      >
        <div :class="styles['dropdown-container']" @click.stop="toggleDropdown">
          <div :class="styles['dropdown-header']">
            <span :class="styles['dropdown-selected']">{{ currentRole }}</span>
            <img
            :style="{ transform: isDropdownOpen ? 'scaleY(-1)' : 'scaleY(1)'}"
            :class="styles['dropdown-icon']"
            :src="nodeExpandedButtonIcon"
            />
          </div>
          <hr v-if="isDropdownOpen" :class="styles['dropdown-horizontal-line']" />
          <ul 
            v-if="isDropdownOpen"
            ref="dropdownMenu"
            :class="styles['dropdown-menu-list']"
          >
            <li 
            :class="[styles['dropdown-item'], { [styles['selected']]: option === currentRole }]" 
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
import { ref, watch, defineProps, defineEmits, onMounted, onUnmounted, nextTick } from 'vue';
import styles from './PromptNode.module.css';
import promptNodeIcon from '@/assets/icons/nodes/promptNodeIcon.svg';
import nodeExpandedButtonIcon from '@/assets/icons/nodes/nodeExpandedButtonIcon.svg';
import { Handle } from '@vue-flow/core';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ role: 'system', context: '' }),
  },
  id: {
    type: String,
    default: '',
  }
});

const emit = defineEmits(['update:modelValue', 'node-data-changed']);

const isExpanded = ref(false);
const isDropdownOpen = ref(false);
const inputText = ref(props.modelValue.context);
const currentRole = ref(props.modelValue.role);
const options = ref(['system', 'assistant', 'user']);
const dropdownMenu = ref(null);
const dropdownHeight = ref(0);


// 초기값 설정
onMounted(() => {
  currentRole.value = props.modelValue.role;
  inputText.value = props.modelValue.context;
});

// 모델 값이 외부에서 변경되었을 때 로컬 상태 업데이트
watch(() => props.modelValue, (newValue) => {
  currentRole.value = newValue.role;
  inputText.value = newValue.context;
}, { deep: true });

const toggleExpansion = () => {
  isExpanded.value = !isExpanded.value;
};

const toggleDropdown = async (e) => {
  e.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
  
  if (isDropdownOpen.value) {
    // 드롭다운이 열린 후 다음 틱에 높이 계산
    await nextTick();
    updateDropdownHeight();
  } else {
    // 드롭다운이 닫히면 높이 초기화
    dropdownHeight.value = 0;
  }
};

const updateDropdownHeight = () => {
  if (dropdownMenu.value) {
    dropdownHeight.value = dropdownMenu.value.offsetHeight;
  }
};

const selectOption = (option) => {
  // 로컬 상태 업데이트
  currentRole.value = option;
  
  // 부모 컴포넌트에 알림
  const updatedValue = { role: option, context: inputText.value };
  emit('update:modelValue', updatedValue);
  
  if (props.id) {
    emit('node-data-changed', { id: props.id, data: updatedValue });
  }
  
  isDropdownOpen.value = false;
  dropdownHeight.value = 0; // 드롭다운이 닫히면 높이 초기화
};

// 텍스트 변경 감지
watch(inputText, (newValue) => {
  const updatedValue = { role: currentRole.value, context: newValue };
  emit('update:modelValue', updatedValue);
  
  if (props.id) {
    emit('node-data-changed', { id: props.id, data: updatedValue });
  }
});

// 드롭다운 외부 클릭 감지하여 닫기
const handleClickOutside = () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false;
    dropdownHeight.value = 0; // 드롭다운이 닫히면 높이 초기화
  }
};

// 윈도우 리사이즈 이벤트 핸들러
const handleResize = () => {
  if (isDropdownOpen.value) {
    updateDropdownHeight();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});
</script>