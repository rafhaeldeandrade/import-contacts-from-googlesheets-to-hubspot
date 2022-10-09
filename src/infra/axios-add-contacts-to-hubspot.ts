import { AddContactsToHubspot, Contact } from '@/usecases/contracts'

export class AxiosAddContactsToHubspot implements AddContactsToHubspot {
  async add(contacts: Contact[]): Promise<void> {
    return Promise.resolve()
  }
}
