import { supabase } from "./supabase";
import type {
  Customer,
  CustomerCreate,
  CustomerUpdate,
  CustomerListItem,
  Document,
  DocumentListItem,
  DocumentUploadResponse,
  DocumentDownloadResponse,
  PaginatedResponse,
  Assessment,
  AssessmentListItem,
  AssessmentCreate,
  SaveAnswersRequest,
} from "./api-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public errorCode?: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new APIError("Not authenticated", 401);
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new APIError(
        error.detail || `HTTP ${response.status}`,
        response.status,
        error.error_code,
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError("Network error", 0);
  }
}

async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const authHeaders = await getAuthHeaders();

  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });
}

export const api = {
  // Health checks (no auth required)
  health: () => apiRequest<{ message: string }>("/health"),

  healthReady: () =>
    apiRequest<{
      database: string;
      storage: string;
      overall: string;
    }>("/health/ready"),

  // Customers
  customers: {
    list: async (params?: {
      page?: number;
      page_size?: number;
      search?: string;
      industry_sector?: string;
      ownership_type?: string;
      sort_by?: string;
      sort_order?: "asc" | "desc";
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.page_size)
        searchParams.set("page_size", params.page_size.toString());
      if (params?.search) searchParams.set("search", params.search);
      if (params?.industry_sector)
        searchParams.set("industry_sector", params.industry_sector);
      if (params?.ownership_type)
        searchParams.set("ownership_type", params.ownership_type);
      if (params?.sort_by) searchParams.set("sort_by", params.sort_by);
      if (params?.sort_order) searchParams.set("sort_order", params.sort_order);

      const query = searchParams.toString();
      return authenticatedRequest<PaginatedResponse<CustomerListItem>>(
        `/api/v1/customers${query ? `?${query}` : ""}`,
      );
    },

    get: (id: string) =>
      authenticatedRequest<Customer>(`/api/v1/customers/${id}`),

    create: (data: CustomerCreate) =>
      authenticatedRequest<Customer>("/api/v1/customers", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: CustomerUpdate) =>
      authenticatedRequest<Customer>(`/api/v1/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      authenticatedRequest<void>(`/api/v1/customers/${id}`, {
        method: "DELETE",
      }),

    documents: (id: string, params?: { page?: number; page_size?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.page_size)
        searchParams.set("page_size", params.page_size.toString());

      const query = searchParams.toString();
      return authenticatedRequest<PaginatedResponse<DocumentListItem>>(
        `/api/v1/customers/${id}/documents${query ? `?${query}` : ""}`,
      );
    },
  },

  // Documents
  documents: {
    get: (id: string) =>
      authenticatedRequest<Document>(`/api/v1/documents/${id}`),

    upload: async (customerId: string, files: File[]) => {
      const authHeaders = await getAuthHeaders();
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      return apiRequest<DocumentUploadResponse[]>(
        `/api/v1/customers/${customerId}/documents`,
        {
          method: "POST",
          headers: {
            Authorization: authHeaders.Authorization,
            // Don't set Content-Type for FormData - browser sets it with boundary
          },
          body: formData,
        },
      );
    },

    getDownloadUrl: (id: string) =>
      authenticatedRequest<DocumentDownloadResponse>(
        `/api/v1/documents/${id}/download`,
      ),

    download: async (id: string): Promise<Blob> => {
      const { download_url } =
        await authenticatedRequest<DocumentDownloadResponse>(
          `/api/v1/documents/${id}/download`,
        );

      // Fetch the actual file from the signed URL
      const response = await fetch(download_url);
      if (!response.ok) {
        throw new APIError("Failed to download file", response.status);
      }
      return await response.blob();
    },

    updateClassification: (id: string, documentType: string) =>
      authenticatedRequest<Document>(`/api/v1/documents/${id}/classification`, {
        method: "PUT",
        body: JSON.stringify({ document_type: documentType }),
      }),

    delete: (id: string) =>
      authenticatedRequest<void>(`/api/v1/documents/${id}`, {
        method: "DELETE",
      }),
  },

  // Assessments
  assessments: {
    create: (data: AssessmentCreate) =>
      authenticatedRequest<Assessment>("/api/v1/assessments", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    get: (id: string) =>
      authenticatedRequest<Assessment>(`/api/v1/assessments/${id}`),

    saveAnswers: (id: string, data: SaveAnswersRequest) =>
      authenticatedRequest<Assessment>(`/api/v1/assessments/${id}/answers`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    submit: (id: string) =>
      authenticatedRequest<Assessment>(`/api/v1/assessments/${id}/submit`, {
        method: "POST",
      }),

    listByCustomer: async (
      customerId: string,
      params?: {
        page?: number;
        page_size?: number;
        status?: string;
      },
    ) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.page_size)
        searchParams.set("page_size", params.page_size.toString());
      if (params?.status) searchParams.set("status", params.status);

      const query = searchParams.toString();
      return authenticatedRequest<PaginatedResponse<AssessmentListItem>>(
        `/api/v1/customers/${customerId}/assessments${query ? `?${query}` : ""}`,
      );
    },
  },
};
