import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

import env from '@/main/config/env'
import { MissingParamError } from '@/usecases/errors'
import { makeOAuth2Client } from '@/main/config/googleapis/oauth2-client'
import { makeImportContactsFromGoogleSheetsToHubspot } from '@/main/factories/makeImportContactsFromGoogleSheetsToHubspot'

async function getArgs() {
  const args = await yargs(hideBin(process.argv)).argv
  const code = args['code'] as string
  const spreadsheetId = args['spreadsheetId'] as string
  const pageName = args['pageName'] as string
  if (!code) throw new MissingParamError('code')
  if (!spreadsheetId) throw new MissingParamError('spreadsheetId')
  if (!pageName) throw new MissingParamError('pageName')
  return { code, spreadsheetId, pageName }
}

async function main() {
  try {
    const { code, spreadsheetId, pageName } = await getArgs()
    const oauth2Client = makeOAuth2Client({
      clientId: env.oauth2.clientId,
      clientSecret: env.oauth2.clientSecret,
    })
    const tokenResponse = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokenResponse.tokens)
    const importContactsFromGoogleSheetsToHubspot =
      makeImportContactsFromGoogleSheetsToHubspot(oauth2Client)
    await importContactsFromGoogleSheetsToHubspot.execute({
      spreadsheetId,
      pageName,
    })
    console.log('Contatos importados com sucesso!')
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERRO!')
      console.log(`${error.name}: ${error.message}`)
    }
  }
}

main()
