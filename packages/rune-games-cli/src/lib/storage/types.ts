import { Binary } from "bson"

export interface Storage {
  lastRandomAppPort: number
  lastRandomGamePort: number
  [key: string]: StorageValue<string | number | boolean | null | Date | Binary>
}

type StorageValue<T> =
  | T
  | StorageValue<T>[]
  | { [key: string]: StorageValue<T> }
