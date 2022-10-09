import { RetrieveWebsiteDomain } from '@/usecases/contracts'
import psl, { ParsedDomain } from 'psl'

export class PslRetrieveWebsiteDomain implements RetrieveWebsiteDomain {
  retrieve(websiteUrl: string): string {
    psl.parse(websiteUrl) as ParsedDomain
    return ''
  }
}
