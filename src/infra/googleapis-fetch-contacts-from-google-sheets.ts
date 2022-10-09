import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

import { Contact, FetchContactsFromGoogleSheets } from '@/usecases/contracts'

export class GoogleapisFetchContactsFromGoogleSheets
  implements FetchContactsFromGoogleSheets
{
  constructor(private readonly oauth2client: OAuth2Client) {}

  async fetch(spreadsheetId: string, pageName: string): Promise<Contact[]> {
    try {
      const googleSheets = google.sheets({
        version: 'v4',
        auth: this.oauth2client,
      })
      const {
        data: { values },
      } = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: pageName,
      })
      const hasValuesAndHeaders = values && values.length > 1
      if (hasValuesAndHeaders) {
        return this.mappedValues(values)
      }
      return []
    } catch (e) {
      throw new Error(
        'Something went wrong while fetching contacts from Google Sheets, try again later and be sure to have first row with the following headers: Nome da empresa, Nome completo, Email, Telefone, Website and subsequent rows filled with related data'
      )
    }
  }

  mappedValues(values: any[][]): Contact[] {
    const valueIndexMap = {
      company: values[0].indexOf('Nome da empresa'),
      name: values[0].indexOf('Nome completo'),
      email: values[0].indexOf('Email'),
      phone: values[0].indexOf('Telefone'),
      website: values[0].indexOf('Website'),
    }
    const valuesArrWithoutFirstElement = values.slice(1)
    return valuesArrWithoutFirstElement.map((value) => ({
      company: value[valueIndexMap.company],
      name: value[valueIndexMap.name],
      email: value[valueIndexMap.email],
      phone: value[valueIndexMap.phone],
      website: value[valueIndexMap.website],
    }))
  }
}
