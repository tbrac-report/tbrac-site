import { useToast } from './use-toast'
import { APIError } from '@/lib/api-client'

export function useApiToast() {
  const { toast } = useToast()

  const handleError = (error: unknown) => {
    if (error instanceof APIError) {
      switch (error.status) {
        case 401:
          toast({
            title: 'Session expired',
            description: 'Please log in again',
            variant: 'destructive',
          })
          break
        case 403:
          toast({
            title: 'Access denied',
            description: 'You do not have permission to perform this action',
            variant: 'destructive',
          })
          break
        case 404:
          toast({
            title: 'Not found',
            description: error.message,
            variant: 'destructive',
          })
          break
        case 409:
          toast({
            title: 'Conflict',
            description: error.message,
            variant: 'destructive',
          })
          break
        case 422:
          toast({
            title: 'Validation error',
            description: error.message,
            variant: 'destructive',
          })
          break
        default:
          toast({
            title: 'Error',
            description: error.message || 'An unexpected error occurred',
            variant: 'destructive',
          })
      }
    } else if (error instanceof Error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Network error',
        description: 'Please check your connection and try again',
        variant: 'destructive',
      })
    }
  }

  const showSuccess = (message: string, description?: string) => {
    toast({
      title: message,
      description,
    })
  }

  return { handleError, showSuccess, toast }
}
