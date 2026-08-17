import { createUploadLink } from "apollo-upload-client"
import fetch from "cross-fetch"
import FormData from "form-data"

import { Scalars } from "../generated/types.js"

const options = {
  isExtractableFile: (file: any) => Buffer.isBuffer(file?.content),
  FormData,
  formDataAppendFile: (
    formData: FormData,
    fieldName: string,
    file: Scalars["Upload"]
  ) => {
    formData.append(fieldName, file.content, {
      filename: file.name,
      contentType: file.type,
    })
  },
}

function apiUrl() {
  switch (process.env.STAGE) {
    case undefined:
    case "production":
      return "https://forge-api.rune.ai/cli/graphql"
    case "launchpad":
      return "https://forge-api-launchpad.rune.ai/cli/graphql"
    case "local":
      return "http://localhost:3000/cli/graphql"
    default:
      // Refuse rather than quietly send the request to production
      throw new Error(`Unsupported STAGE "${process.env.STAGE}"`)
  }
}

export const uploadLink = createUploadLink({
  uri: apiUrl(),
  fetch,
  ...(options as any),
})
