import { useState, useEffect, useCallback } from 'react'
import { api, APIError } from '@/lib/api-client'
import type {
  Customer,
  CustomerListItem,
  CustomerCreate,
  CustomerUpdate,
  PaginatedResponse,
} from '@/lib/api-types'

interface UseCustomersParams {
  page?: number
  pageSize?: number
  search?: string
  industrySector?: string
  ownershipType?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function useCustomers(params?: UseCustomersParams) {
  const [data, setData] = useState<PaginatedResponse<CustomerListItem> | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.customers.list({
        page: params?.page,
        page_size: params?.pageSize,
        search: params?.search,
        industry_sector: params?.industrySector,
        ownership_type: params?.ownershipType,
        sort_by: params?.sortBy,
        sort_order: params?.sortOrder,
      })
      setData(result)
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [
    params?.page,
    params?.pageSize,
    params?.search,
    params?.industrySector,
    params?.ownershipType,
    params?.sortBy,
    params?.sortOrder,
  ])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load }
}

export function useCustomer(id: string) {
  const [data, setData] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)
    try {
      const result = await api.customers.get(id)
      setData(result)
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Failed to load customer')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load }
}

export function useCreateCustomer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (data: CustomerCreate): Promise<Customer | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.customers.create(data)
      return result
    } catch (err) {
      setError(
        err instanceof APIError ? err.message : 'Failed to create customer'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

export function useUpdateCustomer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (
    id: string,
    data: CustomerUpdate
  ): Promise<Customer | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.customers.update(id, data)
      return result
    } catch (err) {
      setError(
        err instanceof APIError ? err.message : 'Failed to update customer'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

export function useDeleteCustomer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteCustomer = async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await api.customers.delete(id)
    } catch (err) {
      setError(
        err instanceof APIError ? err.message : 'Failed to delete customer'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteCustomer, loading, error }
}
