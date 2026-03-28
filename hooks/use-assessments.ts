import { useState, useCallback, useEffect } from "react";
import { api, APIError } from "@/lib/api-client";
import type {
  Assessment,
  AssessmentListItem,
  AssessmentCreate,
  AssessmentModule,
  AssessmentModuleSummary,
  SaveModuleAnswersRequest,
  PaginatedResponse,
} from "@/lib/api-types";

export function useCreateAssessment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: AssessmentCreate): Promise<Assessment | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.assessments.create(data);
      return result;
    } catch (err) {
      setError(err instanceof APIError ? err.message : "Failed to create assessment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useAssessment(id: string | null) {
  const [data, setData] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.assessments.get(id);
      setData(result);
    } catch (err) {
      setError(err instanceof APIError ? err.message : "Failed to load assessment");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}

export function useSubmitAssessment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (assessmentId: string): Promise<Assessment | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.assessments.submit(assessmentId);
      return result;
    } catch (err) {
      setError(err instanceof APIError ? err.message : "Failed to submit assessment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}

export function useCustomerAssessments(
  customerId: string | null,
  params?: { page?: number; pageSize?: number; status?: string },
) {
  const [data, setData] = useState<PaginatedResponse<AssessmentListItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.assessments.listByCustomer(customerId, {
        page: params?.page,
        page_size: params?.pageSize,
        status: params?.status,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof APIError ? err.message : "Failed to load assessments");
    } finally {
      setLoading(false);
    }
  }, [customerId, params?.page, params?.pageSize, params?.status]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}

export function useAssessmentModule(
  assessmentId: string | null,
  moduleKey: string | null,
) {
  const [data, setData] = useState<AssessmentModule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!assessmentId || !moduleKey) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.assessments.getModule(assessmentId, moduleKey);
      setData(result);
    } catch (err) {
      setError(err instanceof APIError ? err.message : "Failed to load module");
    } finally {
      setLoading(false);
    }
  }, [assessmentId, moduleKey]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}

export function useSaveModuleAnswers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (
    assessmentId: string,
    moduleKey: string,
    data: SaveModuleAnswersRequest,
  ): Promise<AssessmentModule | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.assessments.saveModuleAnswers(assessmentId, moduleKey, data);
      return result;
    } catch (err) {
      setError(err instanceof APIError ? err.message : "Failed to save answers");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { save, loading, error };
}
