// Performance Monitoring and Optimization
const isBrowser = typeof window !== "undefined"

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()
  private observers: PerformanceObserver[] = []

  constructor() {
    if (isBrowser) {
      this.initializeObservers()
    }
  }

  private initializeObservers(): void {
    // Monitor Long Tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn(`[Performance] Long task detected: ${entry.duration}ms`)
              this.recordMetric('longTasks', entry.duration)
            }
          }
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })
        this.observers.push(longTaskObserver)
      } catch (e) {
        console.log('[Performance] Long task observer not supported')
      }

      // Monitor Layout Shifts
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue
            this.recordMetric('layoutShifts', (entry as any).value)
          }
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(clsObserver)
      } catch (e) {
        console.log('[Performance] Layout shift observer not supported')
      }
    }
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    const values = this.metrics.get(name)!
    values.push(value)
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
  }

  getMetrics(): Record<string, { avg: number; max: number; count: number }> {
    const result: Record<string, { avg: number; max: number; count: number }> = {}
    
    this.metrics.forEach((values, name) => {
      if (values.length > 0) {
        result[name] = {
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          max: Math.max(...values),
          count: values.length
        }
      }
    })
    
    return result
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    return fn().finally(() => {
      const duration = performance.now() - start
      this.recordMetric(name, duration)
    })
  }

  measure<T>(name: string, fn: () => T): T {
    const start = performance.now()
    try {
      return fn()
    } finally {
      const duration = performance.now() - start
      this.recordMetric(name, duration)
    }
  }

  getMemoryUsage(): { used: number; total: number; percentage: number } | null {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      }
    }
    return null
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics.clear()
  }
}

export const performanceMonitor = new PerformanceMonitor()
