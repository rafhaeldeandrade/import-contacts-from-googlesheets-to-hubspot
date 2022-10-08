import { faker } from '@faker-js/faker'
import { ImportContactsFromGoogleSheetsToHubspot } from '@/usecases/import-contacts-from-googlesheets-to-hubspot'
import { MissingParamError } from '@/usecases/errors'
import { Contact, FetchContactsFromGoogleSheets } from '@/usecases/contracts'

class FetchContactsFromGoogleSheetsStub
  implements FetchContactsFromGoogleSheets
{
  async fetch(spreadsheetId: string, pageName: string): Promise<Contact[]> {
    return [
      {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        website: faker.internet.url(),
        phone: faker.phone.number(),
      },
    ]
  }
}

interface Props {
  spreadsheetId: string
  pageName: string
}

function makeProps(): Props {
  return {
    spreadsheetId: faker.datatype.uuid(),
    pageName: faker.datatype.string(),
  }
}

interface SutTypes {
  sut: ImportContactsFromGoogleSheetsToHubspot
  fetchContactsFromGoogleSheetsStub: FetchContactsFromGoogleSheets
}

function makeSut(): SutTypes {
  const fetchContactsFromGoogleSheetsStub =
    new FetchContactsFromGoogleSheetsStub()
  const sut = new ImportContactsFromGoogleSheetsToHubspot(
    fetchContactsFromGoogleSheetsStub
  )
  return {
    sut,
    fetchContactsFromGoogleSheetsStub,
  }
}

describe('ImportContactsFromGoogleSheetsToHubspot Unit Test', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should throw MissingParamError if spreadsheetId isnt provided', async () => {
    const { sut } = makeSut()
    const props = makeProps()
    const { spreadsheetId, ...rest } = props
    const result = sut.execute(rest as any)
    await expect(result).rejects.toThrow(new MissingParamError('spreadsheetId'))
  })

  it('should throw MissingParamError if pageName isnt provided', async () => {
    const { sut } = makeSut()
    const props = makeProps()
    const { pageName, ...rest } = props
    const result = sut.execute(rest as any)
    await expect(result).rejects.toThrow(new MissingParamError('pageName'))
  })

  it('should call fetchContactsFromGoogleSheets.fetch with correct params', async () => {
    const { sut, fetchContactsFromGoogleSheetsStub } = makeSut()
    const props = makeProps()
    const fetchSpy = jest.spyOn(fetchContactsFromGoogleSheetsStub, 'fetch')
    await sut.execute(props)
    expect(fetchSpy).toHaveBeenCalledWith(props.spreadsheetId, props.pageName)
  })
})
