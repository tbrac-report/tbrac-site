'use client'

import { Component, ReactNode } from 'react'
import { APIError } from '@/lib/api-client'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: APIError | Error
}

export class APIErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('APIErrorBoundary caught error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const error = this.state.error
      const isAPIError = error instanceof APIError

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-red-900">
                  {isAPIError && error.status === 401
                    ? 'Authentication Required'
                    : isAPIError && error.status === 403
                      ? 'Access Denied'
                      : isAPIError && error.status === 404
                        ? 'Not Found'
                        : 'Something Went Wrong'}
                </CardTitle>
              </div>
              <CardDescription>
                {isAPIError
                  ? error.message
                  : error?.message || 'An unexpected error occurred'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isAPIError && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-1">Error Details:</p>
                    <p className="text-sm text-muted-foreground">
                      Status Code: {error.status}
                    </p>
                    {error.errorCode && (
                      <p className="text-sm text-muted-foreground">
                        Error Code: {error.errorCode}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={this.handleReset}
                    variant="default"
                    className="flex-1"
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1"
                  >
                    Reload Page
                  </Button>
                </div>

                {isAPIError && error.status === 401 && (
                  <Button
                    onClick={() => (window.location.href = '/evaluator-login')}
                    variant="secondary"
                    className="w-full"
                  >
                    Go to Login
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
