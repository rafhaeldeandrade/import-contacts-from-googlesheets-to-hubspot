import psl from 'psl'
import { faker } from '@faker-js/faker'

import { PslRetrieveWebsiteDomain } from '@/infra/psl-retrieve-website-domain'

describe('PslRetrieveWebsiteDomain', () => {
  it('should be defined', () => {
    const sut = new PslRetrieveWebsiteDomain()
    expect(sut).toBeDefined()
  })

  it('should call psl.parse with correct param', () => {
    const sut = new PslRetrieveWebsiteDomain()
    const websiteUrl = faker.internet.url()
    const parseSpy = jest.spyOn(psl, 'parse')
    sut.retrieve(websiteUrl)
    expect(parseSpy).toHaveBeenCalledTimes(1)
    expect(parseSpy).toHaveBeenCalledWith(websiteUrl)
  })

  it('should throw if psl.parse throws', () => {
    const sut = new PslRetrieveWebsiteDomain()
    const websiteUrl = faker.internet.url()
    jest.spyOn(psl, 'parse').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(() => sut.retrieve(websiteUrl)).toThrow(
      new Error('Something went wrong, check your url and try again')
    )
  })

  it('should return domain on success', () => {
    const sut = new PslRetrieveWebsiteDomain()
    const websiteUrl = faker.internet.url()
    const domain = faker.internet.domainName()
    jest.spyOn(psl, 'parse').mockReturnValueOnce({ domain } as any)
    const result = sut.retrieve(websiteUrl)
    expect(result).toBe(domain)
  })
})
