module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testTimeout: 10000,
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: {
          warnOnly: process.env.JEST_WATCH_TESTS === "1",
        },
      },
    ],
  },
}
