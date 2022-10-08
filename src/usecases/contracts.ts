export type Contact = {
  name: string
  email: string
  company: string
  website: string
  phone: string
}

export interface FetchContactsFromGoogleSheets {
  fetch(spreadsheetId: string, pageName: string): Promise<Contact[]>
}

export interface RetrieveWebsiteDomain {
  retrieve(websiteUrl: string): string
}
