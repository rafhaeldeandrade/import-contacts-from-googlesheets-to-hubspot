import { MissingParamError } from '@/usecases/errors'
import {
  Contact,
  FetchContactsFromGoogleSheets,
  RetrieveWebsiteDomain,
} from '@/usecases/contracts'

interface ImportContactsFromGoogleSheetsToHubspotInput {
  spreadsheetId: string
  pageName: string
}

export class ImportContactsFromGoogleSheetsToHubspot {
  contacts: (Contact | undefined)[] = []

  constructor(
    private readonly fetchContactsFromGoogleSheets: FetchContactsFromGoogleSheets,
    private readonly retrieveWebsiteDomain: RetrieveWebsiteDomain
  ) {}

  async execute(
    params: ImportContactsFromGoogleSheetsToHubspotInput
  ): Promise<void> {
    this.validateParams(params)
    const { spreadsheetId, pageName } = params
    const contacts = await this.fetchContactsFromGoogleSheets.fetch(
      spreadsheetId,
      pageName
    )
    this.cleanContacts(contacts)
  }

  validateParams(params: ImportContactsFromGoogleSheetsToHubspotInput): void {
    const { spreadsheetId, pageName } = params
    if (!spreadsheetId) throw new MissingParamError('spreadsheetId')
    if (!pageName) throw new MissingParamError('pageName')
  }

  cleanContacts(contacts: Contact[]): void {
    this.contacts = contacts.map((contact) => {
      const emailDomain = contact.email.split('@')[1]
      const websiteDomain = this.retrieveWebsiteDomain.retrieve(contact.website)
      if (websiteDomain !== emailDomain) return
      return {
        name: contact.name,
        email: contact.email,
        company: contact.company,
        website: contact.website,
        phone: contact.phone,
      }
    })
  }
}
