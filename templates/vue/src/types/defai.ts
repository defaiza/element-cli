export interface DEFAIConfig {
  title?: string
  description?: string
  apiEndpoint?: string
  theme?: 'light' | 'dark'
  [key: string]: any
}

export interface DEFAIElement {
  id: string
  name: string
  version: string
  mount: (rootElement: HTMLElement, config?: DEFAIConfig) => void
  unmount: () => void
}