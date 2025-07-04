import { createApp } from 'vue'
import App from './App.vue'
import type { DEFAIConfig } from './types/defai'

export function mountElement(rootElement: HTMLElement, config?: DEFAIConfig) {
  const app = createApp(App, {
    config
  })
  
  app.mount(rootElement)
  
  return {
    app,
    unmount: () => app.unmount()
  }
}

// Auto-mount if root element exists
const rootElement = document.getElementById('defai-element-root')
if (rootElement) {
  mountElement(rootElement)
}