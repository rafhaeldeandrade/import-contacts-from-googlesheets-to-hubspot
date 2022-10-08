import psl, { ParsedDomain } from 'psl'
import { faker } from '@faker-js/faker'
import { ImportContactsFromGoogleSheetsToHubspot } from '@/usecases/import-contacts-from-googlesheets-to-hubspot'
import { MissingParamError } from '@/usecases/errors'
import {
  AddContactsToHubspot,
  Contact,
  FetchContactsFromGoogleSheets,
  RetrieveWebsiteDomain,
} from '@/usecases/contracts'

class AddContactsToHubspotStub implements AddContactsToHubspot {
  async add(contacts: Contact[]): Promise<void> {
    return Promise.resolve()
  }
}

class RetrieveWebsiteDomainStub implements RetrieveWebsiteDomain {
  retrieve(websiteUrl: string): string {
    const parsed = psl.parse(websiteUrl) as ParsedDomain
    return parsed.domain as string
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
  addContactsToHubspotStub: AddContactsToHubspot
}

function makeSut(): SutTypes {
  const fetchContactsFromGoogleSheetsStub =
    new FetchContactsFromGoogleSheetsStub()
  const retrieveWebsiteDomainStub = new RetrieveWebsiteDomainStub()
  const addContactsToHubspotStub = new AddContactsToHubspotStub()
  const sut = new ImportContactsFromGoogleSheetsToHubspot(
    fetchContactsFromGoogleSheetsStub,
    retrieveWebsiteDomainStub,
    addContactsToHubspotStub
  )
  return {
    sut,
    fetchContactsFromGoogleSheetsStub,
    retrieveWebsiteDomainStub,
    addContactsToHubspotStub,
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

  it('should throw if fetchContactsFromGoogleSheets throws', async () => {
    const { sut, fetchContactsFromGoogleSheetsStub } = makeSut()
    jest
      .spyOn(fetchContactsFromGoogleSheetsStub, 'fetch')
      .mockRejectedValueOnce(new Error())
    const result = sut.execute(makeProps())
    await expect(result).rejects.toThrow()
  })

  it('should call retrieveWebsiteDomain.retrieve to remove entries where domain name is different from email domain name, with correct params', async () => {
    const { sut, retrieveWebsiteDomainStub } = makeSut()
    const props = makeProps()
    const retrieveSpy = jest.spyOn(retrieveWebsiteDomainStub, 'retrieve')
    await sut.execute(props)
    expect(retrieveSpy).toHaveBeenCalledTimes(
      fetchContactsFromGoogleSheetsStubReturn.length
    )
    const firstElementWebsiteUrlWithoutProtocol =
      fetchContactsFromGoogleSheetsStubReturn[0].website.replace(
        /(^\w+:|^)\/\//,
        ''
      )
    expect(retrieveSpy).toHaveBeenCalledWith(
      firstElementWebsiteUrlWithoutProtocol
    )
    const lastFetchContactsIndex =
      fetchContactsFromGoogleSheetsStubReturn.length - 1
    const lastElementWebsiteUrlWithoutProtocol =
      fetchContactsFromGoogleSheetsStubReturn[
        lastFetchContactsIndex
      ].website.replace(/(^\w+:|^)\/\//, '')
    expect(retrieveSpy).toHaveBeenLastCalledWith(
      lastElementWebsiteUrlWithoutProtocol
    )
  })

  it('should throw if retrieveWebsiteDomain throws', async () => {
    const { sut, retrieveWebsiteDomainStub } = makeSut()
    jest
      .spyOn(retrieveWebsiteDomainStub, 'retrieve')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const result = sut.execute(makeProps())
    await expect(result).rejects.toThrow()
  })

  it('should call addContactsToHubspot.add with correct params', async () => {
    const { sut, fetchContactsFromGoogleSheetsStub, addContactsToHubspotStub } =
      makeSut()
    const props = makeProps()
    const contactsWithDomainsMatching = [
      {
        name: faker.name.fullName(),
        email: 'faker@faker.com',
        company: faker.company.name(),
        website: 'http://faker.com',
        phone: faker.phone.number(),
      },
      {
        name: faker.name.fullName(),
        email: 'any_email@anydomain.net',
        company: faker.company.name(),
        website: 'https://anydomain.net',
        phone: faker.phone.number(),
      },
    ]
    fetchContactsFromGoogleSheetsStub.fetch = jest
      .fn()
      .mockResolvedValueOnce([
        ...fetchContactsFromGoogleSheetsStubReturn,
        ...contactsWithDomainsMatching,
      ])
    const addSpy = jest.spyOn(addContactsToHubspotStub, 'add')
    await sut.execute(props)
    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith(contactsWithDomainsMatching)
  })

  it('should throw if addContactsToHubspot throws', async () => {
    const { sut, retrieveWebsiteDomainStub } = makeSut()
    jest
      .spyOn(retrieveWebsiteDomainStub, 'retrieve')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const result = sut.execute(makeProps())
    await expect(result).rejects.toThrow()
  })

  it('should return undefined on success', async () => {
    const { sut } = makeSut()
    const props = makeProps()
    const result = await sut.execute(props)
    expect(result).toBeUndefined()
  })
})
