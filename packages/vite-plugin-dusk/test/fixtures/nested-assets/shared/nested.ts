import { flatten } from "array-flatten"

export const flattened = flatten([["nested"], "string"]).join("-")

export const nested = "nested-string"

import logo from './logo.svg'

export const image = new Image()
image.src = logo
