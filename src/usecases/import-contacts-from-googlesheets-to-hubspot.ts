import { MissingParamError } from '@/usecases/errors'
import { FetchContactsFromGoogleSheets } from '@/usecases/contracts'

interface ImportContactsFromGoogleSheetsToHubspotInput {
  spreadsheetId: string
  pageName: string
}

export class ImportContactsFromGoogleSheetsToHubspot {
  constructor(
    private readonly fetchContactsFromGoogleSheets: FetchContactsFromGoogleSheets
  ) {}

  async execute(
    params: ImportContactsFromGoogleSheetsToHubspotInput
  ): Promise<void> {
    this.validateParams(params)
    const { spreadsheetId, pageName } = params
    await this.fetchContactsFromGoogleSheets.fetch(spreadsheetId, pageName)
  }

  validateParams(params: ImportContactsFromGoogleSheetsToHubspotInput): void {
    const { spreadsheetId, pageName } = params
    if (!spreadsheetId) throw new MissingParamError('spreadsheetId')
    if (!pageName) throw new MissingParamError('pageName')
  }
}
