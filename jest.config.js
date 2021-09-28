module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 10000,
  setupFilesAfterEnv: ["./test/setup.ts"],
}
