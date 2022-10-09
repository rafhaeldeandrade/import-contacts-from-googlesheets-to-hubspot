import { OAuth2Client } from 'google-auth-library'

import { ImportContactsFromGoogleSheetsToHubspot } from '@/usecases/import-contacts-from-googlesheets-to-hubspot'
import { GoogleapisFetchContactsFromGoogleSheets } from '@/infra/googleapis-fetch-contacts-from-google-sheets'
import { PslRetrieveWebsiteDomain } from '@/infra/psl-retrieve-website-domain'
import { AxiosAddContactsToHubspot } from '@/infra/axios-add-contacts-to-hubspot'
import { ImportContactsFromGoogleSheetsToHubspotUseCase } from '@/domain/contracts'

export function makeImportContactsFromGoogleSheetsToHubspot(
  oauth2Client: OAuth2Client
): ImportContactsFromGoogleSheetsToHubspotUseCase {
  const fetchContactsFromGoogleSheets =
    new GoogleapisFetchContactsFromGoogleSheets(oauth2Client)
  const retrieveWebsiteDomain = new PslRetrieveWebsiteDomain()
  const AddContactsToHubspot = new AxiosAddContactsToHubspot()
  return new ImportContactsFromGoogleSheetsToHubspot(
    fetchContactsFromGoogleSheets,
    retrieveWebsiteDomain,
    AddContactsToHubspot
  )
}
