export const loginToolDescription = `Authenticates user with Rune platform for game uploads.

AGENT INSTRUCTIONS:
Use when user wants to:
- Upload or update games on Rune platform
- Authenticate before using upload tools
- Login to their Rune account`

export const emailParameterDescription =
  "Email address for Rune account authentication."

export const resendEmailParameterDescription =
  "Boolean flag to indicate whether to resend the verification email if one is already in progress."

export const loginToolInitiatingResponse = (email: string) =>
  `Sending login verification to ${email}...
You'll receive an email with a verification link. Please click it to continue.`

export const loginToolEmailSentResponse = `Verification email sent.
Please check your inbox and click the verification link.
Then confirm here when you've completed verification.`

export const loginToolSuccessResponse = (email: string) =>
  `Successfully logged in as ${email}.
You can now upload games to the Rune platform.`

export const loginToolFailureResponse = (error: string) =>
  `Login failed: ${error}
Please try again with a valid email address.`

export const alreadyLoggedInResponse = `You are already logged in to the Rune platform.`

export const loginErrorResponse =
  "Error logging in. Please check your email and try again."

export const emailRequiredResponse =
  "Please provide your Rune developer account email address to log in."

export const verificationInProgressResponse = `A verification email has already been sent. 
Please check your inbox and click the link to verify your account. 
If you need another email sent, use the resendEmail parameter set to true.
Once you have visited the link, run this login tool again to complete the login process.`

export const verificationSuccessResponse =
  "Successfully verified! You are now logged in to the Rune platform."
