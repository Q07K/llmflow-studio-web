<template>
  <img
    :src="iconComponent"
    :width="size"
    :height="size"
    :alt="name + ' icon'"
    v-bind="$attrs"
  />
</template>

<script setup>
  import { computed, defineProps } from 'vue'
  import SunIcon from '@/assets/icons/sun.svg'
  import MoonIcon from '@/assets/icons/moon.svg'
  import promptNodeIcon from '@/assets/icons/nodes/promptNodeIcon.svg'
  import nodeExpandedButtonIcon from '@/assets/icons/nodes/nodeExpandedButtonIcon.svg'
  // 필요한 SVG 아이콘을 위에 import해서 추가하세요

  const props = defineProps({
    name: { type: String, required: true },
    size: { type: [String, Number], default: 24 },
    color: { type: String, default: 'currentColor' }
  })

  const icons = {
    sun: SunIcon,
    moon: MoonIcon,
    promptNode: promptNodeIcon,
    expandedButton: nodeExpandedButtonIcon
    // '다른아이콘이름': OtherIcon
  }

  const iconComponent = computed(() => icons[props.name] || null)
</script>
