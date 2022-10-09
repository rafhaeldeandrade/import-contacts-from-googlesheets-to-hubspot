import { AxiosAddContactsToHubspot } from '@/infra/axios-add-contacts-to-hubspot'

describe('AxiosAddContactsToHubspot', () => {
  it('should be defined', async () => {
    const sut = new AxiosAddContactsToHubspot()
    expect(sut).toBeDefined()
  })
})
