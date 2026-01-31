import { z } from "zod"

// Rating answer (0-10)
export const ratingAnswerSchema = z.number().min(0).max(10)

// Boolean answer
export const booleanAnswerSchema = z.boolean()

// Multiple choice answer
export const multipleChoiceAnswerSchema = z.string()

// Text answer
export const textAnswerSchema = z.string().min(1, "This field is required")

// Assessment answer (can be any of the above)
export const assessmentAnswerSchema = z.union([
  ratingAnswerSchema,
  booleanAnswerSchema,
  multipleChoiceAnswerSchema,
  textAnswerSchema,
])

// Full assessment responses
export const assessmentResponsesSchema = z.record(z.string(), assessmentAnswerSchema)

// Company information
export const companyInfoSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  countryOfOrigin: z.string().min(2, "Country is required"),
  industry: z.string().min(2, "Industry is required"),
  companySize: z.string().min(1, "Company size is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactName: z.string().min(2, "Contact name is required"),
})

export type CompanyInfo = z.infer<typeof companyInfoSchema>
export type AssessmentResponses = z.infer<typeof assessmentResponsesSchema>
