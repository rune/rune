// @ts-check
const { createConfigTester } = require("../createConfigTester")

const test = createConfigTester({
  extends: "plugin:rune/logic",
})

test("globals", {
  valid: [
    "Rune.initLogic()",
    "Math.abs()",
    "Math.round()",
    "Math.cos()",
    "Math.sin()",
    "Math.pow()",
    "Math.log()",
    "123 * Math.PI",
    "const matematik = {}; Object.assign(matematik, { hest: 'snel' })",
    "isNaN(12)",
    "isFinite(12)",
    "Number.isNaN(12)",
    "if (42 < Infinity) { }",
    "if (typeof Rune === 'undefined') { }",
  ],
  invalid: [
    ["Rune.init()", "restrictedObjectProperty"],
    ["Prune.initLogic()", "undef"],
    ["Math.random()", "restrictedObjectProperty"],
    ["Object.assign(window, { hest: 'snel' })", "undef"],
    ['require("hest")', "undef"],
    ['eval("hest")', "undef"],
    ["Date.now()", "undef"],
    ["new Date()", "undef"],
    ["const date = Date; date.now()", "undef"],
    ["Performance.now()", "undef"],
    ["global.hest = 'snel'", "undef"],
    ["globalThis.hest = 'snel'", "undef"],
    ["new XMLHttpRequest()", "undef"],
    ["fetch('https://rune.ai')", "undef"],
    ["setTimeout()", "undef"],
    ["clearTimeout()", "undef"],
    ["setInterval()", "undef"],
    ["clearInterval()", "undef"],
    ["alert()", "undef"],
    ["new Intl.NumberFormat()", "undef"],
    ["new Symbol()", "undef"],
    ["new Map()", "undef"],
    ["new Set()", "undef"],
  ],
})
