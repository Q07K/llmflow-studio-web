<template>
  <div class="display-node">
    <label>Output (JSON)</label>
    <pre>{{ jsonData }}</pre>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'

  defineProps({
    jsonData: {
      type: Object,
      default: () => ({})
    }
  })
</script>

<style scoped>
  .display-node {
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    width: 300px;
  }

  .display-node label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
  }

  .display-node pre {
    font-family: monospace;
    background-color: #eee;
    padding: 8px;
    border-radius: 3px;
    overflow: auto;
    white-space: pre-wrap;
  }
</style>
