export const loginToolDescription = `This tool allows users to log into their Rune developer account.
It will send a verification email and check if the user has clicked the magic link.
Once authenticated, the user can upload games and access other Rune developer features.

AGENT INSTRUCTIONS:
Use this tool when instructed to by the response from another tool.`

export const emailParameterDescription = `Email address of the developer's Rune account.
If you do not have a Rune account, please create one in the Rune app using your email address.
If you have a Rune account but it is not linked to an email address, you can link it in the app from the settings page.`

export const resendEmailParameterDescription =
  "Boolean flag to indicate whether to resend the verification email if one is already in progress."

export const verificationEmailSentResponse = (
  email: string
) => `A verification email has been sent to ${email}.
Please check your inbox and click the link to verify your account. 
If you don't see the email, please check your spam folder.
Once you have visited the link, run this login tool again to complete the login process.`

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
