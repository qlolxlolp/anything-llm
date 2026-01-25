"use client"

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Report to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // You can integrate with error reporting services here
      console.error('Production error:', { error, errorInfo })
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} retry={this.retry} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-4 p-6 bg-card rounded-lg border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <h2 className="text-lg font-semibold text-card-foreground">
                خطایی رخ داده است
              </h2>
            </div>
            
            <p className="text-muted-foreground mb-4">
              متأسفانه مشکلی در برنامه پیش آمده است. لطفاً دوباره تلاش کنید.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-3 bg-muted rounded text-sm">
                <summary className="cursor-pointer font-medium">جزئیات خطا</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-2">
              <Button onClick={this.retry} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                تلاش مجدد
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                بارگذاری مجدد صفحه
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('[useErrorHandler]', error, errorInfo)
    
    if (process.env.NODE_ENV === 'production') {
      // Report to monitoring service
      console.error('Production error:', { error, errorInfo })
    }
  }
}
