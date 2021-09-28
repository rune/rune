/*
Helper functions to ease testing.
*/

export async function extractErrMsg(fn: Function) {
  let errMsg
  try {
    await fn()
  } catch (err: any) {
    errMsg = err.message
  }
  return errMsg
}
