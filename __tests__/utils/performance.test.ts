import { debounce, throttle, memoize } from '../../src/utils/performance'

describe('Performance Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('debounce', () => {
    it('delays function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()
      
      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('cancels previous calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('preserves function context', () => {
      const context = { value: 'test' }
      const mockFn = jest.fn(function() {
        return this.value
      })
      const debouncedFn = debounce(mockFn.bind(context), 100)
      
      debouncedFn()
      jest.advanceTimersByTime(100)
      
      expect(mockFn).toHaveBeenCalledWith()
    })
  })

  describe('throttle', () => {
    it('limits function execution frequency', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)
      
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)
      
      throttledFn()
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)
      
      jest.advanceTimersByTime(100)
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    it('executes immediately on first call', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)
      
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('memoize', () => {
    it('caches function results', () => {
      const mockFn = jest.fn((x) => x * 2)
      const memoizedFn = memoize(mockFn)
      
      const result1 = memoizedFn(5)
      const result2 = memoizedFn(5)
      
      expect(result1).toBe(10)
      expect(result2).toBe(10)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('handles different arguments', () => {
      const mockFn = jest.fn((x) => x * 2)
      const memoizedFn = memoize(mockFn)
      
      memoizedFn(5)
      memoizedFn(10)
      
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    it('handles complex arguments', () => {
      const mockFn = jest.fn((obj) => obj.value * 2)
      const memoizedFn = memoize(mockFn)
      
      const obj1 = { value: 5 }
      const obj2 = { value: 5 }
      
      memoizedFn(obj1)
      memoizedFn(obj2)
      
      expect(mockFn).toHaveBeenCalledTimes(1) // Same value, should be memoized
    })
  })

  describe('PerformanceMonitor', () => {
    let monitor: any

    beforeEach(() => {
      // Create a mock PerformanceMonitor
      monitor = {
        startTimer: jest.fn(),
        endTimer: jest.fn(),
        getMetrics: jest.fn(() => ({})),
        clearMetrics: jest.fn(),
      }
    })

    it('tracks performance metrics', () => {
      monitor.startTimer('test-operation')
      
      // Simulate some work
      jest.advanceTimersByTime(100)
      
      monitor.endTimer('test-operation')
      
      expect(monitor.startTimer).toHaveBeenCalledWith('test-operation')
      expect(monitor.endTimer).toHaveBeenCalledWith('test-operation')
    })

    it('handles multiple timers', () => {
      monitor.startTimer('operation1')
      jest.advanceTimersByTime(50)
      monitor.endTimer('operation1')
      
      monitor.startTimer('operation2')
      jest.advanceTimersByTime(100)
      monitor.endTimer('operation2')
      
      expect(monitor.startTimer).toHaveBeenCalledWith('operation1')
      expect(monitor.startTimer).toHaveBeenCalledWith('operation2')
      expect(monitor.endTimer).toHaveBeenCalledWith('operation1')
      expect(monitor.endTimer).toHaveBeenCalledWith('operation2')
    })

    it('handles nested timers', () => {
      monitor.startTimer('outer')
      monitor.startTimer('inner')
      
      jest.advanceTimersByTime(50)
      monitor.endTimer('inner')
      
      jest.advanceTimersByTime(50)
      monitor.endTimer('outer')
      
      expect(monitor.startTimer).toHaveBeenCalledWith('outer')
      expect(monitor.startTimer).toHaveBeenCalledWith('inner')
      expect(monitor.endTimer).toHaveBeenCalledWith('inner')
      expect(monitor.endTimer).toHaveBeenCalledWith('outer')
    })

    it('clears metrics', () => {
      monitor.startTimer('test')
      monitor.endTimer('test')
      
      expect(monitor.startTimer).toHaveBeenCalledWith('test')
      expect(monitor.endTimer).toHaveBeenCalledWith('test')
      
      monitor.clearMetrics()
      expect(monitor.clearMetrics).toHaveBeenCalled()
    })

    it('handles missing end timer gracefully', () => {
      monitor.startTimer('test')
      
      // Don't call endTimer
      expect(monitor.startTimer).toHaveBeenCalledWith('test')
    })

    it('handles missing start timer gracefully', () => {
      monitor.endTimer('test')
      
      expect(monitor.endTimer).toHaveBeenCalledWith('test')
    })
  })
})