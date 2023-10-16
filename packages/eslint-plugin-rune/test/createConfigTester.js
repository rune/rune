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
      errors: [{ ruleId: test[1], severity: test[2] || 2 }],
    }
  }
  return test
}

//Need to run tests in :
//JS script
//JS module
//TS script
//TS module
const createConfigTester = () => {
  /**
   * @param {string} testName
   * @param {TestSuite} tests
   */
  return (testName, testGetter) => {
    ;["typescript"].forEach((language) => {
      ;["module"].forEach((sourceType) => {
        const eslint = new ESLint({
          useEslintrc: false,
          allowInlineConfig: false,
          fix: false,
          cache: false,
          baseConfig: {
            extends:
              sourceType === "module"
                ? "plugin:rune/logicModule"
                : "plugin:rune/logic",
            parserOptions: { sourceType },
            parser:
              language === "typescript"
                ? "@typescript-eslint/parser"
                : undefined,
          },
        })

        const { valid, invalid } = testGetter({ language, sourceType })

        describe(`${testName}: ${language} ${sourceType}`, () => {
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
                                  m.ruleId ? ` (${m.ruleId})` : ""
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
      })
    })
  }
}

module.exports = { createConfigTester }
