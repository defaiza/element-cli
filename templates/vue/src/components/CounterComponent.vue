<template>
  <div class="counter">
    <p>Count: {{ count }}</p>
    <div class="button-group">
      <button @click="decrement">-</button>
      <button @click="reset">Reset</button>
      <button @click="increment">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}

const reset = () => {
  count.value = 0
}
</script>

<style scoped>
.counter {
  text-align: center;
}

.counter p {
  font-size: 1.5rem;
  margin: 1rem 0;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #42b883;
  background: white;
  color: #42b883;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #42b883;
  color: white;
}
</style>