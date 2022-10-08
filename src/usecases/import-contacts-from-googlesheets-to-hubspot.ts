import { MissingParamError } from '@/usecases/errors'

interface ImportContactsFromGoogleSheetsToHubspotInput {
  spreadsheetId: string
  pageName: string
}

export class ImportContactsFromGoogleSheetsToHubspot {
  execute(params: ImportContactsFromGoogleSheetsToHubspotInput): void {
    this.validateParams(params)
  }

  validateParams(params: ImportContactsFromGoogleSheetsToHubspotInput): void {
    const { spreadsheetId, pageName } = params
    if (!spreadsheetId) throw new MissingParamError('spreadsheetId')
    if (!pageName) throw new MissingParamError('pageName')
  }
}
