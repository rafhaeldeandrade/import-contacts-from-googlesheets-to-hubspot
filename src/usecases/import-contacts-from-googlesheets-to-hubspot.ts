import { MissingParamError } from '@/usecases/errors'

interface ImportContactsFromGoogleSheetsToHubspotInput {
  spreadsheetId: string
}

export class ImportContactsFromGoogleSheetsToHubspot {
  execute(params: ImportContactsFromGoogleSheetsToHubspotInput): void {
    const { spreadsheetId } = params
    if (!spreadsheetId) throw new MissingParamError('spreadsheetId')
  }
}
