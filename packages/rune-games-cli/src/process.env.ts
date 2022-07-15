export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LOCALAPPDATA?: string
    }
  }
}
