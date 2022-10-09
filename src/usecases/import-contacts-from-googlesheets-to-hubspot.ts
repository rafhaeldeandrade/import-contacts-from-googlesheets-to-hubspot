import { MissingParamError } from '@/usecases/errors'
import {
  AddContactsToHubspot,
  Contact,
  FetchContactsFromGoogleSheets,
  RetrieveWebsiteDomain,
} from '@/usecases/contracts'
import {
  ImportContactsFromGoogleSheetsToHubspotUseCase,
  ImportContactsFromGoogleSheetsToHubspotUseCaseInput,
} from '@/domain/contracts'

export class ImportContactsFromGoogleSheetsToHubspot
  implements ImportContactsFromGoogleSheetsToHubspotUseCase
{
  contacts: (Contact | undefined)[] = []

  constructor(
    private readonly fetchContactsFromGoogleSheets: FetchContactsFromGoogleSheets,
    private readonly retrieveWebsiteDomain: RetrieveWebsiteDomain,
    private readonly addContactsToHubspot: AddContactsToHubspot
  ) {}

  async execute(
    params: ImportContactsFromGoogleSheetsToHubspotUseCaseInput
  ): Promise<void> {
    this.validateParams(params)
    const { spreadsheetId, pageName } = params
    const contacts = await this.fetchContactsFromGoogleSheets.fetch(
      spreadsheetId,
      pageName
    )
    this.validateContacts(contacts)
    this.removeContactsWithoutCorporativeEmail(contacts)
    await this.addContactsToHubspot.add(this.contacts)
  }

  validateParams(
    params: ImportContactsFromGoogleSheetsToHubspotUseCaseInput
  ): void {
    const { spreadsheetId, pageName } = params
    if (!spreadsheetId) throw new MissingParamError('spreadsheetId')
    if (!pageName) throw new MissingParamError('pageName')
  }

  validateContacts(contact: Contact[]): void {
    if (contact.length === 0) {
      throw new Error('Spreadsheet is empty! Populate it and try again later.')
    }
  }

  removeContactsWithoutCorporativeEmail(contacts: Contact[]): void {
    this.contacts = contacts.flatMap((contact) => {
      const emailDomain = contact.email.split('@')[1]
      const websiteUrlWithoutProtocol = contact.website.replace(
        /(^\w+:|^)\/\//,
        ''
      )
      const websiteDomain = this.retrieveWebsiteDomain.retrieve(
        websiteUrlWithoutProtocol
      )
      if (websiteDomain !== emailDomain) return []
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
