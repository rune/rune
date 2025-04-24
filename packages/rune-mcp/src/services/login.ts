import { queryMe } from "rune/query/queryMe.js"
import { queryVerificationToken } from "rune/query/queryVerificationToken.js"
import { queryAuthToken } from "rune/query/queryAuthToken.js"
import { setAuthTokenInStorage } from "rune/lib/login.js"

export const isLoggedIn = async () => {
  const { me } = await queryMe()

  return !!me
}

let verificationEmail: string | null = null
let verificationToken: string | null = null

export const isVerificationInProgress = (email: string) =>
  email === verificationEmail && !!verificationToken

export const sendVerificationEmail = async (email: string) => {
  verificationEmail = email
  verificationToken = null

  const { verificationToken: token } = await queryVerificationToken({ email })

  if (token) {
    verificationToken = token
  }
  if (!verificationToken) {
    throw new Error("Failed to get verification token")
  }
}

export const checkAuthToken = async () => {
  if (!verificationToken) {
    throw new Error("No verification token found")
  }
  try {
    const { authToken } = await queryAuthToken({ verificationToken })

    if (authToken) {
      setAuthTokenInStorage(authToken)
      verificationToken = null
      verificationEmail = null
      return true
    }
    return false
  } catch {
    return false
  }
}
