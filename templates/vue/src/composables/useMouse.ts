import { ref, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  const isTracking = ref(false)

  const updatePosition = (event: MouseEvent) => {
    if (!isTracking.value) return
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    x.value = Math.round(event.clientX - rect.left)
    y.value = Math.round(event.clientY - rect.top)
  }

  const startTracking = (event: MouseEvent) => {
    isTracking.value = true
    const target = event.currentTarget as HTMLElement
    target.addEventListener('mousemove', updatePosition)
    updatePosition(event)
  }

  const stopTracking = (event: MouseEvent) => {
    isTracking.value = false
    const target = event.currentTarget as HTMLElement
    target.removeEventListener('mousemove', updatePosition)
    x.value = 0
    y.value = 0
  }

  onUnmounted(() => {
    isTracking.value = false
  })

  return {
    x,
    y,
    startTracking,
    stopTracking,
    isTracking
  }
}