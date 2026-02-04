// Enums
export enum IndustrySector {
  TECHNOLOGY = "technology",
  TELECOMMUNICATIONS = "telecommunications",
  SEMICONDUCTORS = "semiconductors",
  DEFENSE = "defense",
  HEALTHCARE = "healthcare",
  FINANCIAL_SERVICES = "financial_services",
  ENERGY = "energy",
  MANUFACTURING = "manufacturing",
  CONSUMER_GOODS = "consumer_goods",
  RETAIL = "retail",
  AGRICULTURE = "agriculture",
  OTHER = "other",
}

export enum OwnershipType {
  PRIVATE = "private",
  STATE_OWNED = "state_owned",
  MIXED = "mixed",
  PUBLIC_LISTED = "public_listed",
  JOINT_VENTURE = "joint_venture",
}

export enum DocumentType {
  BUSINESS_LICENSE = "business_license",
  OWNERSHIP_CERTIFICATE = "ownership_certificate",
  FINANCIAL_STATEMENT = "financial_statement",
  ARTICLES_OF_ASSOCIATION = "articles_of_association",
  BOARD_RESOLUTION = "board_resolution",
  REGULATORY_APPROVAL = "regulatory_approval",
  LEGAL_FILING = "legal_filing",
  TAX_REGISTRATION = "tax_registration",
  BANK_REFERENCE = "bank_reference",
  OTHER = "other",
}

export enum ProcessingStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  REQUIRES_REVIEW = "requires_review",
}

// Customer types
export interface CustomerBase {
  name: string;
  chinese_name?: string;
  industry_sector: IndustrySector;
  ownership_type: OwnershipType;
  state_ownership_percentage?: number;
  headquarters_country: string;
  headquarters_city?: string;
  us_presence?: string;
  us_subsidiary_name?: string;
  parent_company_id?: string;
  website?: string;
  notes?: string;
}

export interface CustomerCreate extends CustomerBase {}

export interface CustomerUpdate extends Partial<CustomerBase> {}

export interface Customer extends CustomerBase {
  id: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface CustomerListItem {
  id: string;
  name: string;
  chinese_name?: string;
  industry_sector: IndustrySector;
  ownership_type: OwnershipType;
  headquarters_country: string;
  headquarters_city?: string;
  created_at: string;
}

// Document types
export interface Document {
  id: string;
  customer_id: string;
  original_filename: string;
  file_path: string;
  file_size_bytes: number;
  mime_type: string;
  file_hash: string;
  document_type?: DocumentType;
  document_type_confidence?: number;
  document_type_override?: DocumentType;
  processing_status: ProcessingStatus;
  processing_started_at?: string;
  processing_completed_at?: string;
  processing_error?: string;
  page_count?: number;
  ocr_applied: boolean;
  language?: string;
  extraction_confidence?: number;
  uploaded_at: string;
  uploaded_by?: string;
}

export interface DocumentListItem {
  id: string;
  customer_id: string;
  original_filename: string;
  file_size_bytes: number;
  mime_type: string;
  document_type?: DocumentType;
  processing_status: ProcessingStatus;
  uploaded_at: string;
}

export interface DocumentUploadResponse {
  document_id: string;
  filename: string;
  file_size_bytes: number;
  status: ProcessingStatus;
}

export interface DocumentDownloadResponse {
  download_url: string;
  expires_at: string;
  filename: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Assessment types
export interface CompanyInfo {
  company_name: string;
  country: string;
  industry: string;
  company_size: string;
  contact_name: string;
  contact_email: string;
}

export type AssessmentStatus = "in_progress" | "completed" | "submitted";

export interface Assessment {
  id: string;
  customer_id: string;
  status: AssessmentStatus;
  progress_percentage: number;
  company_info: CompanyInfo;
  responses: Record<string, any>;
  last_category_viewed: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentListItem {
  id: string;
  customer_id: string;
  status: AssessmentStatus;
  progress_percentage: number;
  company_name: string;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentCreate {
  customer_id: string;
  company_info: CompanyInfo;
}

export interface SaveAnswersRequest {
  responses: Record<string, any>;
  category?: string;
  progress_percentage?: number;
}
