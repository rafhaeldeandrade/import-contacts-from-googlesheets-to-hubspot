import { Contact, FetchContactsFromGoogleSheets } from '@/usecases/contracts'

export class GoogleapisFetchContactsFromGoogleSheets
  implements FetchContactsFromGoogleSheets
{
  async fetch(spreadsheetId: string, pageName: string): Promise<Contact[]> {
    return []
  }
}
