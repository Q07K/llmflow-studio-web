<script setup>
import { Background } from '@vue-flow/background'
import styles from '@/assets/scss/AppBackground.module.css'
</script>

<template>
    <div :class="styles['vue-flow-background']">
        <Background :size="2" :gap="20" pattern-color="#BDBDBD" />
    </div>
</template>