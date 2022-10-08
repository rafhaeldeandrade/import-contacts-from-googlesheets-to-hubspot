import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { faker } from '@faker-js/faker'

import { GoogleapisFetchContactsFromGoogleSheets } from '@/infra/googleapis-fetch-contacts-from-google-sheets'

class OAuth2ClientStub extends OAuth2Client {}
interface SutTypes {
  sut: GoogleapisFetchContactsFromGoogleSheets
}

function makeSut(): SutTypes {
  const oauth2ClientStub = new OAuth2ClientStub()
  const sut = new GoogleapisFetchContactsFromGoogleSheets(oauth2ClientStub)
  return {
    sut,
  }
}

function makeProps() {
  return {
    spreadsheetId: faker.datatype.uuid(),
    pageName: faker.lorem.words(1),
  }
}

describe('GoogleapisFetchContactsFromGoogleSheets', () => {
  it('should be defined', async () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should call google.sheets with correct params', async () => {
    const { sut } = makeSut()
    const sheetsSpy = jest.spyOn(google, 'sheets')
    const { spreadsheetId, pageName } = makeProps()
    await sut.fetch(spreadsheetId, pageName)
    expect(sheetsSpy).toHaveBeenCalledWith({
      auth: expect.any(OAuth2Client),
    })
  })
})
