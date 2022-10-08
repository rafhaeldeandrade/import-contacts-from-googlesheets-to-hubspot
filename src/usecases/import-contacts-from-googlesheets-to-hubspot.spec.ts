import { faker } from '@faker-js/faker'
import { ImportContactsFromGoogleSheetsToHubspot } from '@/usecases/import-contacts-from-googlesheets-to-hubspot'
import { MissingParamError } from '@/usecases/errors'

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
}

function makeSut(): SutTypes {
  const sut = new ImportContactsFromGoogleSheetsToHubspot()
  return {
    sut,
  }
}

describe('ImportContactsFromGoogleSheetsToHubspot Unit Test', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should throw MissingParamError if spreadsheetId isnt provided', () => {
    const { sut } = makeSut()
    const props = makeProps()
    const { spreadsheetId, ...rest } = props
    expect(() => sut.execute(rest as any)).toThrow(
      new MissingParamError('spreadsheetId')
    )
  })

  it('should throw MissingParamError if pageName isnt provided', () => {
    const { sut } = makeSut()
    const props = makeProps()
    const { pageName, ...rest } = props
    expect(() => sut.execute(rest as any)).toThrow(
      new MissingParamError('pageName')
    )
  })
})
