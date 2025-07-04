import { ref, watch, Ref } from 'vue'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options?: {
    serializer?: (value: T) => string
    deserializer?: (value: string) => T
  }
): {
  value: Ref<T>
  setValue: (newValue: T) => void
  clear: () => void
} {
  const serializer = options?.serializer || JSON.stringify
  const deserializer = options?.deserializer || JSON.parse

  const storedValue = localStorage.getItem(key)
  const initial = storedValue !== null
    ? (() => {
        try {
          return deserializer(storedValue)
        } catch {
          return defaultValue
        }
      })()
    : defaultValue

  const value = ref<T>(initial)

  const setValue = (newValue: T) => {
    value.value = newValue
  }

  const clear = () => {
    localStorage.removeItem(key)
    value.value = defaultValue
  }

  watch(value, (newValue) => {
    if (newValue === undefined || newValue === null) {
      localStorage.removeItem(key)
    } else {
      try {
        localStorage.setItem(key, serializer(newValue))
      } catch (error) {
        console.error(`Error saving to localStorage:`, error)
      }
    }
  }, { deep: true })

  return {
    value,
    setValue,
    clear
  }
}