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

const apiUrls: Record<string, string> = {
  production: "https://forge-api.rune.ai/cli/graphql",
  launchpad: "https://forge-api-launchpad.rune.ai/cli/graphql",
  local: "http://localhost:3000/cli/graphql",
}

const stage = process.env.STAGE ?? "production"
if (!apiUrls[stage]) throw new Error(`Unsupported STAGE "${stage}"`)

export const uploadLink = createUploadLink({
  uri: apiUrls[stage],
  fetch,
  ...(options as any),
})
