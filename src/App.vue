<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div>
    <h1>VArch</h1>
    <button @click="count++">Count is {{ count }}</button>
  </div>
</template>

<style scoped>
</style>

