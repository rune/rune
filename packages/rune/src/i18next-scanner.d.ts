declare module "i18next-scanner" {
  export class Parser {
    constructor(options?: {
      lngs?: string[]
      func?: { list?: string[] }
      sort?: boolean
      defaultValue?: string
      keySeparator?: boolean | string
      nsSeparator?: boolean | string
    })
    parseFuncFromString(content: string, options?: { list?: string[] }): void
    get(): Record<string, { translation: Record<string, string> }>
  }
}
