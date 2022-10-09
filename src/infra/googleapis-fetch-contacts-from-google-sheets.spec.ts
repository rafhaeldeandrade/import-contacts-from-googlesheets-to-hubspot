import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { faker } from '@faker-js/faker'

import { GoogleapisFetchContactsFromGoogleSheets } from '@/infra/googleapis-fetch-contacts-from-google-sheets'
jest.mock('googleapis', () => ({
  google: {
    sheets: jest.fn().mockImplementation(() => ({
      spreadsheets: {
        values: {
          get: () => ({
            data: {
              values: [
                [
                  'Nome da empresa',
                  'Nome completo',
                  'Email',
                  'Telefone',
                  'Website',
                ],
                [
                  faker.company.name(),
                  faker.name.fullName(),
                  faker.internet.email(),
                  faker.phone.number(),
                  faker.internet.url(),
                ],
                [
                  faker.company.name(),
                  faker.name.fullName(),
                  faker.internet.email(),
                  faker.phone.number(),
                  faker.internet.url(),
                ],
              ],
            },
          }),
        },
      },
    })),
  },
}))

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
      version: 'v4',
    })
  })

  it('should return Contact[] on success', async () => {
    const { sut } = makeSut()
    const { spreadsheetId, pageName } = makeProps()
    const contacts = await sut.fetch(spreadsheetId, pageName)
    expect(contacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          company: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
          website: expect.any(String),
        }),
      ])
    )
  })

  it('should return empty array if values is empty', async () => {
    const { sut } = makeSut()
    jest.spyOn(google, 'sheets').mockImplementationOnce(
      () =>
        ({
          spreadsheets: {
            values: {
              get: () => ({
                data: {
                  values: [],
                },
              }),
            },
          },
        } as any)
    )
    const { spreadsheetId, pageName } = makeProps()
    const contacts = await sut.fetch(spreadsheetId, pageName)
    expect(contacts).toEqual([])
  })

  it('should throw if google.sheets throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(google, 'sheets').mockImplementationOnce(() => {
      throw new Error()
    })
    const { spreadsheetId, pageName } = makeProps()
    const promise = sut.fetch(spreadsheetId, pageName)
    await expect(promise).rejects.toThrow(
      new Error(
        'Something went wrong while fetching contacts from Google Sheets, try again later and be sure to have first row with the following headers: Nome da empresa, Nome completo, Email, Telefone, Website and subsequent rows filled with related data'
      )
    )
  })
})
