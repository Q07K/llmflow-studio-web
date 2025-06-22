<template>
  <div style="width: 800px; height: 600px">
    <VueFlow :nodes="basicNodes" :edges="edges"> </VueFlow>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import VueFlow from '@vue-flow/core'
  import '@vue-flow/core/dist/style.css'
  import '@vue-flow/core/dist/theme-default.css'

  const basicNodes = ref([
    { id: '1', position: { x: 100, y: 100 }, data: { label: 'Basic Node 1' } },
    { id: '2', position: { x: 300, y: 100 }, data: { label: 'Basic Node 2' } }
  ])

  const edges = ref([{ id: 'e1-2', source: '1', target: '2' }])
</script>

<style scoped>
  .vue-flow {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
  }
</style>
