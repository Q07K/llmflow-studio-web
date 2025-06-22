<template>
  <div :class="styles['vue-flow-background']">
    <Background :size="2" :gap="20" pattern-color="#BDBDBD" />
  </div>
</template>

<script setup>
  import styles from '@/assets/scss/AppBackground.module.css'
  import { Background } from '@vue-flow/background'
</script>
