import { flatten } from "array-flatten"

export const nested = flatten([["nested"], "string"]).join("-")
