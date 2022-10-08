import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

import { Contact, FetchContactsFromGoogleSheets } from '@/usecases/contracts'

export class GoogleapisFetchContactsFromGoogleSheets
  implements FetchContactsFromGoogleSheets
{
  constructor(private readonly oauth2client: OAuth2Client) {}

  async fetch(spreadsheetId: string, pageName: string): Promise<Contact[]> {
    google.sheets({
      version: 'v4',
      auth: this.oauth2client,
    })
    return []
  }
}
