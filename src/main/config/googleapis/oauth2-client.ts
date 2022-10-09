import { google } from 'googleapis'

interface OAuth2ClientInput {
  clientId: string
  clientSecret: string
}

export function makeOAuth2Client({
  clientId,
  clientSecret,
}: OAuth2ClientInput) {
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    'urn:ietf:wg:oauth:2.0:oob'
  )
}
