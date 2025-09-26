// utils/dom.ts
/**
 * Безопасная функция для получения bounding rect элемента
 * Возвращает null если элемент не существует или не в DOM
 */
export function safeGetBoundingClientRect(element: Element | null | undefined): DOMRect | null {
  if (!element || !element.parentNode) return null
  try {
    return element.getBoundingClientRect()
  } catch (error) {
    console.warn('Failed to get bounding rect:', error)
    return null
  }
}

/**
 * Безопасная функция для querySelector
 * Возвращает null если элемент не существует или не в DOM
 */
export function safeQuerySelector(element: Element | null | undefined, selector: string): Element | null {
  if (!element || !element.parentNode) return null
  try {
    return element.querySelector(selector)
  } catch (error) {
    console.warn('Failed to query selector:', error)
    return null
  }
}

/**
 * Безопасная функция для querySelectorAll
 * Возвращает пустой NodeList если элемент не существует или не в DOM
 */
export function safeQuerySelectorAll(element: Element | null | undefined, selector: string): NodeListOf<Element> {
  if (!element || !element.parentNode) return document.createDocumentFragment().childNodes as NodeListOf<Element>
  try {
    return element.querySelectorAll(selector)
  } catch (error) {
    console.warn('Failed to query selector all:', error)
    return document.createDocumentFragment().childNodes as NodeListOf<Element>
  }
}
