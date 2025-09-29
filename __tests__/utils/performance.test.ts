import { debounce, throttle, memoize, PerformanceMonitor } from '../../src/utils/performance'

describe('Performance Utils', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('debounce', () => {
    it('should delay function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('should limit function execution frequency', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('memoize', () => {
    it('should cache function results', () => {
      const mockFn = jest.fn((x) => x * 2)
      const memoizedFn = memoize(mockFn)

      const result1 = memoizedFn(5)
      const result2 = memoizedFn(5)

      expect(result1).toBe(10)
      expect(result2).toBe(10)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('PerformanceMonitor', () => {
    it('should measure execution time', () => {
      PerformanceMonitor.start('test')
      
      // Simulate some work
      jest.advanceTimersByTime(100)
      
      const duration = PerformanceMonitor.end('test')
      expect(duration).toBe(100)
    })

    it('should measure function execution', () => {
      const mockFn = jest.fn(() => 'result')
      
      const result = PerformanceMonitor.measure('test', mockFn)
      
      expect(result).toBe('result')
      expect(mockFn).toHaveBeenCalled()
    })
  })
})
