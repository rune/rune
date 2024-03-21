import { flatten } from "array-flatten"

export const flattened = flatten([["nested"], "string"]).join("-")

export const nested = "nested-string"
