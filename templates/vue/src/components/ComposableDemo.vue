<template>
  <div class="composable-demo">
    <h3>Mouse Position Tracker</h3>
    <p>Move your mouse over this area</p>
    
    <div 
      class="tracking-area"
      @mouseenter="startTracking"
      @mouseleave="stopTracking"
    >
      <div v-if="isTracking" class="position">
        X: {{ x }}, Y: {{ y }}
      </div>
      <div v-else class="hint">
        Hover to track mouse position
      </div>
    </div>
    
    <div class="storage-demo">
      <h3>Local Storage Demo</h3>
      <input 
        v-model="storageValue" 
        @input="updateStorage"
        placeholder="Type something..."
      />
      <p>Stored value: {{ storedValue || '(empty)' }}</p>
      <button @click="clearStorage">Clear Storage</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMouse } from '../composables/useMouse'
import { useLocalStorage } from '../composables/useLocalStorage'

const { x, y, startTracking, stopTracking, isTracking } = useMouse()

const storageValue = ref('')
const { value: storedValue, setValue, clear } = useLocalStorage('defai-demo-value', '')

const updateStorage = () => {
  setValue(storageValue.value)
}

const clearStorage = () => {
  clear()
  storageValue.value = ''
}

// Initialize input with stored value
storageValue.value = storedValue.value
</script>

<style scoped>
.composable-demo {
  text-align: center;
}

.tracking-area {
  position: relative;
  height: 200px;
  background: #f0f0f0;
  border: 2px dashed #42b883;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  cursor: crosshair;
}

.position {
  font-size: 1.2rem;
  font-weight: bold;
  color: #42b883;
}

.hint {
  color: #999;
}

.storage-demo {
  margin-top: 2rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
  margin-bottom: 1rem;
}

.storage-demo p {
  margin: 1rem 0;
  color: #666;
}

button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: 1px solid #e74c3c;
  background: white;
  color: #e74c3c;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #e74c3c;
  color: white;
}
</style>