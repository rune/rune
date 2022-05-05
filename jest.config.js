module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testTimeout: 10000,
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: process.env.JEST_WATCH_TESTS === "1",
        ignoreCodes: ["TS151001"], //Disable warning about esModules interlop (we don't want it on to reduce the bundle size)
      },
    },
  },
}
