const { createConfigTester } = require("../createConfigTester.js")

const test = createConfigTester()

test("global scope mutation", ({ type }) => ({
  valid: [
    "(() => { let hest; hest = 'snel' })()",
    "() => { Dusk.initLogic() }",
    "const hest = 'snel'; if (hest = 'klad') { Dusk.initLogic(); }",
    "const hest = 'snel'; if (hest === 'klad') { Dusk.initLogic(hest); }",
    "const hest = 'snel'; () => { if (hest === 'snel') { return 'klad'; } }",
    "const hest = { snel: true }; () => { if (hest.snel === true) { return 'klad'; } }",
    "parseInt('1')",
    "let hest; hest === undefined",
    "const hest = null",
    "let hest; (() => { let hest; hest = 'snel' })()",
    "const hest = () => 'snel'; (() => { hest() })()",
    "const hest = ['snel']; const klap = (hest) => { hest.push('klad') }; (() => { let hest = []; klap(hest) })()",
    "const hest = { snel: true }; Object.assign(hest, { klad: true })",
    "const hest = 'snel'; () => ({ [`hest`]: 'klad' })",
    "const hest = 'snel'; () => { const hest = 'klad'; return { [`${hest}`]: 'klad' } }",
    "const hest = 'snel'; () => ({ hest() { return 'klad' } })",
    "const hest = 'snel'; class Klad { hest() { return 'snel' } }",
    "class Hest { spek() { return 'gneg' } }",
    "const hest = {}; hest.snel = true",
    "const hest = {}; (hest) => { hest.snel = true }",
    "const hest = {}; (hest) => { hest['snel'] = true }",
    "const hest = {}; (hest) => { hest.hest = true }",
    "const hest = {}; (hest) => { hest[hest] = true }",
    "const hest = {}; function klap(hest) { hest.klad = true }; klap(hest)",
    "const hest = {}; hest.klad = true",
    "let hest = {}; hest = { klad: true }",
    "let hest = {}; const snel = true; hest = snel",
    "const hest = {}; Object.defineProperty(hest, 'klad', { value: true })",
    "const hest = {}; Object.defineProperties(hest, { klad: { value: true } })",
    "const hest = {}; Object.setPrototypeOf(hest, { klad: true })",
    "const hest = 'snel'; function matematik() { return `hest = ${hest}`; }",
    "const hest = 'snel'; () => ({ [hest]: 'klad' })",
    "const hest = 'snel'; () => ({ [`${hest}`]: 'klad' })",
    "const hest = { spek: () => 'gneg' }; () => hest.spek()",
    "const hest = 'snel'; class Klad { hest() { return hest } }",
    "const hest = 'snel'; const snel = { hest }",
    "() => [Dusk]",
    "let dusk = Dusk",
    "let dusk = 'Dusk'; dusk = Dusk;",
    "let dusk = 'Dusk'; dusk = Dusk.initLogic;",
    "const getSeedsByDifficulty = (seeds, difficulty) => seeds.filter((seed) => !difficulty || seed.difficulty === difficulty);",
    // These are unsafe and ways to circumvent the intention of the rule, but still allowed
    "const hest = ['snel']; const klap = (hest) => { hest.push('klad') }; (() => { klap(hest) })()",
    "[Dusk].map((r) => { r.hest = 'snel' })",
    // Valid since it is not modifying global scope
    "() => { let hest; () => { hest = 'snel' } }",
    `Dusk.initLogic({
      setup: () => {
      
        const arr = []
      
        return {
          data: [1, 2, 3].forEach(el => arr.push(el)),
        }
      },
    })`,
    `Dusk.initLogic({
      setup: () => {
        return {
          data: []
        }
      },
      actions: {
        action: (_, {game}) => {
          [1, 2, 3].forEach((el) => game[el] = el);
        }
      }
    })`,
    // Classes are fine as long as they don't use the `this` keyword
    `class MyPureClass {
      constructor(initInput) {
        console.log(initInput)
      }
      pureFunction(someInput) {
        return someInput * 2
      }
    }`,
  ],
  invalid: [
    "let hest; (() => { hest = 'snel' })()",
    "Math.smth = 4",
    "const hest = ['snel', 'klad']; (() => { hest.splice(0, 1) })()",
    "const hest = { snel: true }; () => Object.assign(hest, { klad: true })",
    "const hest = {}; () => { Object.defineProperty(hest, 'snel', { value: true }) }",
    "const hest = {}; () => { hest.snel = true }",
    "const hestar = [{}]; () => { hestar[0].snel = true }",
    "const hest = {}; () => { hest['snel'] = true }",
    "const hest = []; () => { hest.push('snel') }",
    "const hest = [[]]; () => { hest[0][0] = 'snel' }",
    "const hest = 1; () => { hest++ }",
    "const hest = 1; () => { hest += 1 }",
    "const hest = 1; () => { hest /= 1 }",
    "let hest = 1; () => { ({ hest } = { hest: 2 }); }",
    "let hest = 1; () => { ({ newValue: hest } = { newValue: 2 }); }",
    "let hest = 1; () => { ({ best: { hest } } = { best: { hest: 2 } }); }",
    "let hest = 1; () => { ([hest] = [2]); }",
    "let hest = 1; () => { let snel; ([snel, hest] = [2, 3]); }",
    "let hest = 1; () => { ([[{ hest }]] = [[{ hest: 2 }]]); }",
    "let hest = 1; () => { ([...hest] = [2]); }",
    "Dusk = 'hest'",
    "Dusk.blah = 'hest'",
    "delete Dusk.initLogic",
    "Dusk.initLogic++",
    "Dusk.initLogic += 1",
    "let dusk = Dusk; dusk.initLogic = 'hest'",
    "let dusk = Dusk; let pdusk = dusk; pdusk.initLogic = 'hest'",
    "let dusk = Dusk; Object.assign(dusk, { hest: true })",
    "Object.assign(Dusk, { hest: true })",
    "Object.assign(Dusk.initLogic, { hest: true })",
    "let deeply = {}; () => Object.assign(deeply.nested.p.r.o.p.e.r.t.y, { hest: true })",
    "Object.defineProperty(Dusk, 'hest', { value: true })",
    "Object.defineProperties(Dusk, { hest: { value: true } })",
    "Object.__defineGetter__(Dusk, () => 'hest')",
    "Object.__defineSetter__(Dusk, () => 'hest')",
    "Object.setPrototypeOf(Dusk, { hest: true })",
    `
    const arr = [1, 2, 3];
    
    function abc() {
      const a = arr;
      const b = a.splice(1);
    }`,
    // Deleting Dusk will throw Parsing error: Deleting local variable in strict mode in case of running in module
    type === "script" && "delete Dusk",
  ]
    .filter((x) => !!x)
    .map((s) => [s, "dusk/no-global-scope-mutation"]),
}))
