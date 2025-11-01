// Performance optimization utilities

// Debounce function for search and input handling
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for scroll and resize events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Memoization for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(
  func: T
): T => {
  const cache = new Map()
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = func(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Performance monitoring
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map()
  
  static start(label: string): void {
    this.timers.set(label, Date.now())
  }
  
  static end(label: string): number {
    const startTime = this.timers.get(label)
    if (!startTime) {
      // eslint-disable-next-line no-console
console.warn(`Timer "${label}" was not started`)
      return 0
    }
    
    const duration = Date.now() - startTime
    this.timers.delete(label)
    
    if (__DEV__) {
      // eslint-disable-next-line no-console
console.log(`⏱️ ${label}: ${duration}ms`)
    }
    
    return duration
  }
  
  static measure<T>(label: string, fn: () => T): T {
    this.start(label)
    const result = fn()
    this.end(label)
    return result
  }
}

// Image optimization utilities
export const optimizeImageSize = (width: number, height: number, maxSize: number = 1920): {
  width: number
  height: number
} => {
  if (width <= maxSize && height <= maxSize) {
    return { width, height }
  }
  
  const ratio = Math.min(maxSize / width, maxSize / height)
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  }
}

// Memory management
export const clearCache = (): void => {
  if (global.gc) {
    global.gc()
  }
}

// Bundle size optimization
export const lazyImport = <T>(importFn: () => Promise<T>): (() => Promise<T>) => {
  let promise: Promise<T> | null = null
  
  return () => {
    if (!promise) {
      promise = importFn()
    }
    return promise
  }
}
