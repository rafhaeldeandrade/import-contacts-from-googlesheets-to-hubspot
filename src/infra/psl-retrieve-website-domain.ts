import { RetrieveWebsiteDomain } from '@/usecases/contracts'
import psl, { ParsedDomain } from 'psl'

export class PslRetrieveWebsiteDomain implements RetrieveWebsiteDomain {
  retrieve(websiteUrl: string): string {
    try {
      psl.parse(websiteUrl) as ParsedDomain
      return ''
    } catch (e) {
      throw new Error('Something went wrong, check your url and try again')
    }
  }
}
