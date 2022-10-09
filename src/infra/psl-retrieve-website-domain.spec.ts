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
    const parseSpy = jest.spyOn(psl, 'parse').mockReturnValueOnce(null as any)
    sut.retrieve(websiteUrl)
    expect(parseSpy).toHaveBeenCalledTimes(1)
    expect(parseSpy).toHaveBeenCalledWith(websiteUrl)
  })
})
