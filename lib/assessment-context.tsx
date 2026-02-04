"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Assessment } from "./api-types";

interface AssessmentContextType {
  currentAssessment: Assessment | null;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  assessmentId: string | null;
  setAssessmentId: (id: string | null) => void;
  clearAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined,
);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(
    null,
  );
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  // Load assessment ID from sessionStorage on mount
  useEffect(() => {
    const savedId = sessionStorage.getItem("tbrac_assessment_id");
    if (savedId) {
      setAssessmentId(savedId);
    }
  }, []);

  // Save assessment ID to sessionStorage when it changes
  useEffect(() => {
    if (assessmentId) {
      sessionStorage.setItem("tbrac_assessment_id", assessmentId);
    } else {
      sessionStorage.removeItem("tbrac_assessment_id");
    }
  }, [assessmentId]);

  const clearAssessment = () => {
    setCurrentAssessment(null);
    setAssessmentId(null);
    sessionStorage.removeItem("tbrac_assessment_id");
  };

  return (
    <AssessmentContext.Provider
      value={{
        currentAssessment,
        setCurrentAssessment,
        assessmentId,
        setAssessmentId,
        clearAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessmentContext() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error(
      "useAssessmentContext must be used within an AssessmentProvider",
    );
  }
  return context;
}
