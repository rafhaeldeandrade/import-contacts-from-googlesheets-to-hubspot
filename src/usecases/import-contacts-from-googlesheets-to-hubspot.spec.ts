import { faker } from '@faker-js/faker'
import { ImportContactsFromGoogleSheetsToHubspot } from '@/usecases/import-contacts-from-googlesheets-to-hubspot'
import { MissingParamError } from '@/usecases/errors'
import {
  Contact,
  FetchContactsFromGoogleSheets,
  RetrieveWebsiteDomain,
} from '@/usecases/contracts'

class RetrieveWebsiteDomainStub implements RetrieveWebsiteDomain {
  retrieve(websiteUrl: string): string {
    return faker.internet.domainName()
  }
}

const fetchContactsFromGoogleSheetsStubReturn = Array.from({
  length: faker.datatype.number(10),
}).map(() => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  company: faker.company.name(),
  website: faker.internet.url(),
  phone: faker.phone.number(),
}))
class FetchContactsFromGoogleSheetsStub
  implements FetchContactsFromGoogleSheets
{
  async fetch(spreadsheetId: string, pageName: string): Promise<Contact[]> {
    return fetchContactsFromGoogleSheetsStubReturn
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
  retrieveWebsiteDomainStub: RetrieveWebsiteDomain
}

function makeSut(): SutTypes {
  const fetchContactsFromGoogleSheetsStub =
    new FetchContactsFromGoogleSheetsStub()
  const retrieveWebsiteDomainStub = new RetrieveWebsiteDomainStub()
  const sut = new ImportContactsFromGoogleSheetsToHubspot(
    fetchContactsFromGoogleSheetsStub,
    retrieveWebsiteDomainStub
  )
  return {
    sut,
    fetchContactsFromGoogleSheetsStub,
    retrieveWebsiteDomainStub,
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

  it('should call retrieveWebsiteDomain.retrieve to remove entries where domain name is different from email domain name, with correct params', async () => {
    const { sut, retrieveWebsiteDomainStub } = makeSut()
    const props = makeProps()
    const retrieveSpy = jest.spyOn(retrieveWebsiteDomainStub, 'retrieve')
    await sut.execute(props)
    expect(retrieveSpy).toHaveBeenCalledTimes(
      fetchContactsFromGoogleSheetsStubReturn.length
    )
    expect(retrieveSpy).toHaveBeenCalledWith(
      fetchContactsFromGoogleSheetsStubReturn[0].website
    )
    const lastFetchContactsIndex =
      fetchContactsFromGoogleSheetsStubReturn.length - 1
    expect(retrieveSpy).toHaveBeenLastCalledWith(
      fetchContactsFromGoogleSheetsStubReturn[lastFetchContactsIndex].website
    )
  })
})
