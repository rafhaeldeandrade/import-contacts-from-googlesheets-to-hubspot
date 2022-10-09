import env from '@/main/config/env'
import { makeOAuth2Client } from '@/main/config/googleapis/oauth2-client'

const oauth2Client = makeOAuth2Client({
  clientId: env.oauth2.clientId,
  clientSecret: env.oauth2.clientSecret,
})

async function getAuthUrl() {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  console.log(`Vá até essa URL para conseguir um token de acesso:\n\n${url}\n`)
}

export async function getToken(code: string) {
  const token = await oauth2Client.getToken(code)
  console.log(token)
}

getAuthUrl()
