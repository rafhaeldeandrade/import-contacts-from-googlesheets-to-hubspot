import * as dotenv from 'dotenv'
dotenv.config()

export default {
  hubspotApiKey: process.env.HUBSPOT_API_KEY,
  oauth2: {
    clientId: process.env.OAUTH2_CLIENT_ID || '',
    clientSecret: process.env.OAUTH2_CLIENT_SECRET || '',
  },
}
