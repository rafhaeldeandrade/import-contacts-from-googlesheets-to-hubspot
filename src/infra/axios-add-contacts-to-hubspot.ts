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
    try {
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
    } catch (e) {
      throw new Error(
        'Something went wrong while adding contacts to Hubspot, verify your hubspot api key and try again'
      )
    }
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
