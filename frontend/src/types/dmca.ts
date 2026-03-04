export interface DmcaReportRequest {
  reporterName: string;
  reporterEmail: string;
  reporterCompany?: string;
  contentUrl: string;
  originalWorkDescription: string;
  ownershipStatement: string;
  goodFaithStatement: boolean;
  accuracyStatement: boolean;
}
