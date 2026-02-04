import { useState, useCallback } from 'react'
import { api, APIError } from '@/lib/api-client'
import type {
  Document,
  DocumentUploadResponse,
  DocumentDownloadResponse,
} from '@/lib/api-types'

export function useDocumentUpload(customerId: string) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = async (
    files: File[]
  ): Promise<DocumentUploadResponse[] | null> => {
    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      const results = await api.documents.upload(customerId, files)
      setProgress(100)
      return results
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Upload failed')
      throw err
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, progress, error }
}

export function useDocumentDownload() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const download = async (
    documentId: string,
    filename: string
  ): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const { download_url } = await api.documents.getDownloadUrl(documentId)

      // Open in new tab
      window.open(download_url, '_blank')

      // Alternative: Trigger download directly
      // const link = document.createElement('a')
      // link.href = download_url
      // link.download = filename
      // link.click()
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Download failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { download, loading, error }
}

export function useDocument(id: string) {
  const [data, setData] = useState<Document | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)
    try {
      const result = await api.documents.get(id)
      setData(result)
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Failed to load document')
    } finally {
      setLoading(false)
    }
  }, [id])

  return { data, loading, error, refetch: load }
}

export function useUpdateDocumentClassification() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateClassification = async (
    documentId: string,
    documentType: string
  ): Promise<Document | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await api.documents.updateClassification(
        documentId,
        documentType
      )
      return result
    } catch (err) {
      setError(
        err instanceof APIError
          ? err.message
          : 'Failed to update classification'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateClassification, loading, error }
}

export function useDeleteDocument() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteDocument = async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      await api.documents.delete(id)
    } catch (err) {
      setError(
        err instanceof APIError ? err.message : 'Failed to delete document'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteDocument, loading, error }
}
