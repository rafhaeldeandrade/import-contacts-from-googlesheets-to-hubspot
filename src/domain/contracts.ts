export interface ImportContactsFromGoogleSheetsToHubspotUseCaseInput {
  spreadsheetId: string
  pageName: string
}

export interface ImportContactsFromGoogleSheetsToHubspotUseCase {
  execute(
    params: ImportContactsFromGoogleSheetsToHubspotUseCaseInput
  ): Promise<void>
}
