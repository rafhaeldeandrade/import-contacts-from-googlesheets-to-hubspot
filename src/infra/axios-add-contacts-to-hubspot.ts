import axios from 'axios'

import env from '@/main/config/env'
import { AddContactsToHubspot, Contact } from '@/usecases/contracts'

type HubspotContactProperties = {
  property: string
  value: string
}
interface HubspotContact {
  email: string
  properties: HubspotContactProperties[]
}

export class AxiosAddContactsToHubspot implements AddContactsToHubspot {
  async add(contacts: Contact[]): Promise<void> {
    const hubspotContacts = this.generateRequestBody(contacts)
    await axios.post(
      'https://api.hubapi.com/contacts/v1/contact/batch/',
      hubspotContacts,
      {
        headers: {
          Authorization: `Bearer ${env.hubspotApiKey}`,
        },
      }
    )
  }

  generateRequestBody(contacts: Contact[]): HubspotContact[] {
    return contacts.map((contact) => ({
      email: contact.email,
      properties: [
        {
          property: 'firstname',
          value: contact.name,
        },
        {
          property: 'website',
          value: contact.website,
        },
        {
          property: 'phone',
          value: contact.phone,
        },
        {
          property: 'company',
          value: contact.company,
        },
      ],
    }))
  }
}
