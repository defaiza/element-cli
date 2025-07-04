<template>
  <div class="defai-element">
    <h1>{{ title }}</h1>
    <p class="description">{{ description }}</p>
    
    <div class="demo-section">
      <h2>Counter Demo</h2>
      <CounterComponent />
    </div>
    
    <div class="demo-section">
      <h2>API Data Demo</h2>
      <ApiDataComponent />
    </div>
    
    <div class="demo-section">
      <h2>Composable Demo</h2>
      <ComposableDemo />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CounterComponent from './components/CounterComponent.vue'
import ApiDataComponent from './components/ApiDataComponent.vue'
import ComposableDemo from './components/ComposableDemo.vue'
import type { DEFAIConfig } from './types/defai'

interface Props {
  config?: DEFAIConfig
}

const props = defineProps<Props>()

const title = computed(() => props.config?.title || 'DEFAI Vue Element')
const description = computed(() => props.config?.description || 'A Vue 3 element with TypeScript support')
</script>

<style scoped>
.defai-element {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #42b883;
  margin-bottom: 0.5rem;
}

.description {
  color: #666;
  margin-bottom: 2rem;
}

.demo-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.demo-section h2 {
  margin-top: 0;
  color: #35495e;
}
</style>