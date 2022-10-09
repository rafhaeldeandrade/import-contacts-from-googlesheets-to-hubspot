import axios from 'axios'
import { faker } from '@faker-js/faker'

import env from '@/main/config/env'
import { AxiosAddContactsToHubspot } from '@/infra/axios-add-contacts-to-hubspot'

describe('AxiosAddContactsToHubspot', () => {
  it('should be defined', async () => {
    const sut = new AxiosAddContactsToHubspot()
    expect(sut).toBeDefined()
  })

  it('should call axios.post with correct params', async () => {
    const sut = new AxiosAddContactsToHubspot()
    const postSpy = jest.spyOn(axios, 'post')
    const contacts = [
      {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        website: faker.internet.url(),
        company: faker.company.name(),
      },
    ]
    await sut.add(contacts)
    expect(postSpy).toHaveBeenCalledTimes(1)
    expect(postSpy).toHaveBeenCalledWith(
      'https://api.hubapi.com/contacts/v1/contact/batch/',
      [
        {
          email: contacts[0].email,
          properties: [
            {
              property: 'firstname',
              value: contacts[0].name,
            },
            {
              property: 'website',
              value: contacts[0].website,
            },
            {
              property: 'phone',
              value: contacts[0].phone,
            },
            {
              property: 'company',
              value: contacts[0].company,
            },
          ],
        },
      ],
      {
        headers: {
          Authorization: `Bearer ${env.hubspotApiKey}`,
        },
      }
    )
  })
})
