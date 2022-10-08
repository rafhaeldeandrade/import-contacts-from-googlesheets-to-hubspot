import { GoogleapisFetchContactsFromGoogleSheets } from '@/infra/googleapis-fetch-contacts-from-google-sheets'

interface SutTypes {
  sut: GoogleapisFetchContactsFromGoogleSheets
}

function makeSut(): SutTypes {
  const sut = new GoogleapisFetchContactsFromGoogleSheets()
  return {
    sut,
  }
}

describe('GoogleapisFetchContactsFromGoogleSheets', () => {
  it('should be defined', async () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })
})
