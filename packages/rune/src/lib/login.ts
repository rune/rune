import { storage } from "./storage/storage.js"

export const getAuthTokenFromStorage = () => storage.get("authToken")

export const setAuthTokenInStorage = (authToken: string) =>
  storage.set("authToken", authToken)

export const deleteAuthTokenFromStorage = () => storage.delete("authToken")
