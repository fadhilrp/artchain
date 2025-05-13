export interface Validator {
  id: string
  name: string
  avatar?: string
  decision?: "approve" | "reject"
  feedback?: string
  timestamp?: string
  reputation?: number // 1-100 score representing validator reputation
}

export interface ValidationStatus {
  required: number // Number of validators required (11)
  completed: number // Number of validators who have made a decision
  approved: number // Number of approve decisions
  rejected: number // Number of reject decisions
  status: "pending" | "in_progress" | "approved" | "rejected"
  validators: Validator[] // List of validators who have made a decision
  consensusReached: boolean // Whether consensus has been reached
  consensusDate?: string // Date when consensus was reached
}

export interface ArtworkValidation {
  artworkId: string
  validationStatus: ValidationStatus
}
