export interface VerificationResult {
  name: string;
  name_confidence: number;
  surname: string;
  surname_confidence: number;
  date_of_birth: string;
  date_of_birth_confidence: number;
}
export interface UploadedDocuments {
  file: File;
  preview: string;
}
