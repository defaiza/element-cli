<template>
  <div class="api-data">
    <button @click="fetchData" :disabled="loading">
      {{ loading ? 'Loading...' : 'Fetch Data' }}
    </button>
    
    <div v-if="error" class="error">
      Error: {{ error }}
    </div>
    
    <div v-if="data" class="data">
      <h3>API Response:</h3>
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    data.value = {
      timestamp: new Date().toISOString(),
      message: 'Hello from DEFAI API',
      status: 'success',
      randomValue: Math.floor(Math.random() * 100)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.api-data {
  text-align: center;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #42b883;
  background: #42b883;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

button:hover:not(:disabled) {
  background: #35a372;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  padding: 1rem;
  background: #fee;
  border-radius: 4px;
  margin-top: 1rem;
}

.data {
  margin-top: 1rem;
  text-align: left;
}

.data h3 {
  margin-bottom: 0.5rem;
}

pre {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}
</style>