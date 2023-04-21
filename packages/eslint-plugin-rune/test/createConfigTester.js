// @ts-check
const assert = require("assert")
const { ESLint } = require("eslint")

/**
 * @typedef InvalidCodeAssertion
 * @type {object}
 * @property {string} [ruleId]
 * @property {string} [messageId]
 * @property {1|2} [severity]
 */
/**
 * @typedef InvalidCodeTestNormalized
 * @type {object}
 * @property {string} code
 * @property {InvalidCodeAssertion[]} errors
 */
/**
 * @typedef InvalidCodeTest
 * @type {string|[string, string]|[string, string, 1|2]|InvalidCodeTestNormalized}
 */
/**
 * @typedef TestSuite
 * @type {object}
 * @property {string[]} [valid] - code that should pass.
 * @property {InvalidCodeTest[]} [invalid] - code that should fail.
 */

/**
 * @param {InvalidCodeTest} test
 * @return {InvalidCodeTestNormalized}
 */
const normalizeInvalidCodeTest = (test) => {
  if (typeof test === "string") {
    return { code: test, errors: [{}] }
  } else if (Array.isArray(test)) {
    return {
      code: test[0],
      errors: [{ messageId: test[1], severity: test[2] || 2 }],
    }
  }
  return test
}

const createConfigTester = (baseConfig = {}) => {
  const eslint = new ESLint({
    useEslintrc: false,
    allowInlineConfig: false,
    fix: false,
    cache: false,
    baseConfig,
  })

  /**
   * @param {string} testName
   * @param {TestSuite} tests
   */
  return (testName, { valid, invalid }) => {
    describe(testName, () => {
      if (valid) {
        describe("valid", () => {
          valid.forEach((code) => {
            it(code, async () => {
              const [result] = await eslint.lintText(code)
              assert.deepEqual(
                result.messages.filter((m) => m.severity >= 1),
                []
              )
            })
          })
        })
      }
      if (invalid) {
        describe("invalid", () => {
          invalid.forEach((test) => {
            const { code, errors } = normalizeInvalidCodeTest(test)
            it(code, async () => {
              const [result] = await eslint.lintText(code)
              errors.forEach((error) => {
                if (
                  !result.messages.find((message) =>
                    Object.entries(error).every(
                      ([key, value]) => message[key] === value
                    )
                  )
                ) {
                  if (result.messages.length === 0) {
                    throw new Error(
                      "Expected error matching " +
                        JSON.stringify(error) +
                        ", but none were emitted"
                    )
                  }
                  throw new Error(
                    "No messages matching " +
                      JSON.stringify(error) +
                      " found, but saw " +
                      result.messages
                        .map(
                          (m) =>
                            `"${m.message}"${
                              m.messageId ? ` (${m.messageId})` : ""
                            }`
                        )
                        .join(", ")
                  )
                }
              })
            })
          })
        })
      }
    })
  }
}

module.exports = { createConfigTester }
