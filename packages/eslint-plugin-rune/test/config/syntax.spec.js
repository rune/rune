// @ts-check
const { createConfigTester } = require("../createConfigTester")

const test = createConfigTester()

test("syntax", ({ type }) => ({
  valid: [
    "1+1",
    "1-1",
    "1*1",
    "1**1",
    "1/1",
    "1 & 1",
    "1 | 1",
    "null",
    "true",
    "false",
    "[]",
    "{}",
    "'hest' + 'klap' == 'klad'",
    "'hest' + 'klap' === 'klad'",
    "'hest' - 'klap' != 'klad'",
    "'hest' - 'klap' !== 'klad'",
    "const hest = 'snel'",
    "let hest = 'snel'",
    "let hest = 1; hest++",
    "let hest = 1; ++hest",
    "let hest = 1; hest += 1",
    "let hest = 1; hest--",
    "let hest = 1; --hest",
    "let hest = 1; hest -= 1",
    "let hest = false; hest ||= true",
    "let hest = false; hest &&= true",
    "let hest; hest ??= true",
    "if (true) {}",
    "() => { if (true) return 'yes' }",
    "if (false) {} else {}",
    "if (false) {} else if (true) {}",
    "true ? 'yes' : 'no'",
    "throw new Error('hest')",
    'function hest() { return "snel" }',
    "for (let i = 0; i < 10; i++) {}",
    "const arr = [1,2,3]; for (const n of arr) {}",
    "const hest = { snel: true }; for (const k in hest) {}",
    "let hest = 'snel'; while (hest !== 'klad') { continue; }",
    "let hest = 'snel'; do { continue; } while (hest !== 'klad')",
    "const [...numbers] = [1,2,3]",
    "const [one] = [1,2,3]",
    "const [...numbers] = { one: 1 }",
    "const {one} = { one: 1 }",
    "const numbers = [1,2,3]; new Array(...numbers)",
    "const one = 1; `one = ${one}`",
    "class Hest { klapp() { return 'snel' } }",
    "function yep() { return 'yes' }",
    "const yep = function() { return 'yes' }",
    "debugger",
    "void 0",
    "typeof 0",
    "if ({} instanceof Object) {}",
    "if ('snel' in {}) {}",
    "switch('hest') { case 'hest': break; default: break; }",
    "let hest = {}; hest.aaa?.bbb",
    "let hest = {}; hest.aaa ?? 'bbb'",
  ].concat(
    type === "module"
      ? ['export const hest = "snel"', 'export default "hest"']
      : []
  ),
  invalid: [
    ["var hest = 'snel'", "no-var", 1],
    ["try { throw new Error('hest') } catch (_e) { }", "no-restricted-syntax"],
    ["try { throw new Error('hest') } finally { }", "no-restricted-syntax"],
    ['this.hest = "snel"', "no-restricted-syntax"],
    [
      `class MyImpureClass {
        constructor(initInput) {
          this.state = initInput
        }
        impureFunction() {
          this.state = this.state * 2 
          return this.state
        }
      }`,
      "no-restricted-syntax",
    ],
    ['async () => "hest"', "no-restricted-syntax"],
    ['async () => { await Promise.resolve("hest") }', "no-restricted-syntax"],
    ['async function hest() { return "snel" }', "no-restricted-syntax"],
    [
      'async function hest() { await Promise.resolve("snel") }',
      "no-restricted-syntax",
    ],
    ['function* hest() { yield "snel" }', "no-restricted-syntax"],
    [
      'setTimeout(() => { console.log("Delayed for 1 second.") }, "1000");',
      "no-restricted-globals",
    ],
    [
      'setInterval(() => { console.log("Prints every 1 second.") }, "1000");',
      "no-restricted-globals",
    ],
  ].concat(
    type === "module"
      ? [
          ['import snel from "hest"', "no-restricted-syntax"],
          ['import { snel as klad } from "hest"', "no-restricted-syntax"],
          ['import * as snel from "hest"', "no-restricted-syntax"],
          ['import "hest"', "no-restricted-syntax"],
          ['export * from "hest"', "no-restricted-syntax"],
          ['export { snel } from "hest"', "no-restricted-syntax"],
        ]
      : []
  ),
}))
