import {
  IndustrySector,
  OwnershipType,
  DocumentType,
  ProcessingStatus,
} from './api-types'

const industrySectorLabels: Record<IndustrySector, string> = {
  [IndustrySector.TECHNOLOGY]: 'Technology',
  [IndustrySector.TELECOMMUNICATIONS]: 'Telecommunications',
  [IndustrySector.SEMICONDUCTORS]: 'Semiconductors',
  [IndustrySector.DEFENSE]: 'Defense',
  [IndustrySector.HEALTHCARE]: 'Healthcare',
  [IndustrySector.FINANCIAL_SERVICES]: 'Financial Services',
  [IndustrySector.ENERGY]: 'Energy',
  [IndustrySector.MANUFACTURING]: 'Manufacturing',
  [IndustrySector.CONSUMER_GOODS]: 'Consumer Goods',
  [IndustrySector.RETAIL]: 'Retail',
  [IndustrySector.AGRICULTURE]: 'Agriculture',
  [IndustrySector.OTHER]: 'Other',
}

const ownershipTypeLabels: Record<OwnershipType, string> = {
  [OwnershipType.PRIVATE]: 'Private',
  [OwnershipType.STATE_OWNED]: 'State Owned',
  [OwnershipType.MIXED]: 'Mixed',
  [OwnershipType.PUBLIC_LISTED]: 'Public Listed',
  [OwnershipType.JOINT_VENTURE]: 'Joint Venture',
}

const documentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.BUSINESS_LICENSE]: 'Business License',
  [DocumentType.OWNERSHIP_CERTIFICATE]: 'Ownership Certificate',
  [DocumentType.FINANCIAL_STATEMENT]: 'Financial Statement',
  [DocumentType.ARTICLES_OF_ASSOCIATION]: 'Articles of Association',
  [DocumentType.BOARD_RESOLUTION]: 'Board Resolution',
  [DocumentType.REGULATORY_APPROVAL]: 'Regulatory Approval',
  [DocumentType.LEGAL_FILING]: 'Legal Filing',
  [DocumentType.TAX_REGISTRATION]: 'Tax Registration',
  [DocumentType.BANK_REFERENCE]: 'Bank Reference',
  [DocumentType.OTHER]: 'Other',
}

const processingStatusLabels: Record<ProcessingStatus, string> = {
  [ProcessingStatus.PENDING]: 'Pending',
  [ProcessingStatus.PROCESSING]: 'Processing',
  [ProcessingStatus.COMPLETED]: 'Completed',
  [ProcessingStatus.FAILED]: 'Failed',
  [ProcessingStatus.REQUIRES_REVIEW]: 'Requires Review',
}

export function formatIndustrySector(sector: IndustrySector): string {
  return industrySectorLabels[sector] || sector
}

export function formatOwnershipType(type: OwnershipType): string {
  return ownershipTypeLabels[type] || type
}

export function formatDocumentType(type?: DocumentType): string {
  if (!type) return 'Unclassified'
  return documentTypeLabels[type] || type
}

export function formatProcessingStatus(status: ProcessingStatus): string {
  return processingStatusLabels[status] || status
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
