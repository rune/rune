import type { Rule, Scope } from "eslint"
import type { Node } from "estree"

export const meta: Rule.RuleModule["meta"] = {
  type: "problem",
  docs: {
    description:
      "Only allow access to reading variables in the current function scope",
    recommended: true,
  },
  schema: [],
  messages: {
    noParentScopeVariables: "Variables from parent scope may not be accessed.",
    noGlobalVariableMutation: "Global variables may not be mutated.",
  },
}

export const create: Rule.RuleModule["create"] = (context) => {
  const findVariable = (
    name: string,
    scope: Scope.Scope
  ): Scope.Variable | null => {
    const variable = scope.variables.find((v) => v.name === name)
    if (variable) {
      return variable
    } else if (scope.upper) {
      return findVariable(name, scope.upper)
    }
    return null
  }

  const findFunctionScope = (scope: Scope.Scope): Scope.Scope => {
    if (scope.type === "function" || scope.type === "global") {
      return scope
    } else if (scope.upper) {
      return findFunctionScope(scope.upper)
    }
    throw new Error("Unexpected scope")
  }

  const isRuntimeGlobalVariable = (variable: Scope.Variable | null): boolean =>
    variable
      ? variable.scope.type === "global" && variable.identifiers.length === 0
      : false

  const checkLocalVariable = (reportNode: Node, variableName: string) => {
    const scope = context.getScope()
    const variable = findVariable(variableName, scope)
    if (
      variable && // undefined variables are handled by builtin rule
      (isRuntimeGlobalVariable(variable) ||
        findFunctionScope(variable.scope) !== findFunctionScope(scope))
    ) {
      context.report({
        node: reportNode,
        messageId: "noParentScopeVariables",
      })
    }
  }

  const checkGlobalVariableAssignment = (
    reportNode: Node,
    variableName: string
  ) => {
    const scope = context.getScope()
    const variable = findVariable(variableName, scope)
    if (!variable || isRuntimeGlobalVariable(variable)) {
      context.report({
        node: reportNode,
        messageId: "noGlobalVariableMutation",
      })
    }
  }

  return {
    UnaryExpression(node) {
      if (
        node.operator === "delete" &&
        node.argument.type === "MemberExpression" &&
        node.argument.object.type === "Identifier"
      ) {
        checkGlobalVariableAssignment(node, node.argument.object.name)
      }
    },
    UpdateExpression(node) {
      if (
        node.argument.type === "MemberExpression" &&
        node.argument.object.type === "Identifier"
      ) {
        checkGlobalVariableAssignment(node, node.argument.object.name)
      }
    },
    AssignmentExpression(node) {
      switch (node.left.type) {
        case "Identifier": {
          /*
           * Assigning to local variable is ok, but global is not.
           * OK: local = 'value'
           * NOK: global = 'value'
           */
          checkGlobalVariableAssignment(node, node.left.name)
          if (
            node.right.type === "MemberExpression" &&
            node.right.object.type === "Identifier"
          ) {
            checkGlobalVariableAssignment(node, node.right.object.name)
          }
          break
        }
        case "MemberExpression": {
          /*
           * Assigning properties of local variable is ok, but global is not.
           * OK: local.prop = 'value'
           * NOK: global.prop = 'value'
           */
          if (node.left.object.type === "Identifier") {
            return checkGlobalVariableAssignment(node, node.left.object.name)
          }
          break
        }
      }
    },
    VariableDeclarator(node) {
      if (node.init?.type === "Identifier") {
        /*
         * Initializing a variable with static or local variable is ok, but a global is not.
         * OK: local = 'value'
         * NOK: local = global
         */
        checkGlobalVariableAssignment(node, node.init.name)
      }
    },
    Identifier(node) {
      switch (node.parent.type) {
        case "BinaryExpression": {
          /*
           * Comparing variables are ok.
           * OK: local === global
           */
          return
        }
        case "UnaryExpression": {
          /*
           * Checking types of variables are ok.
           * OK: typeof global
           */
          if (node.parent.operator === "typeof") {
            return
          }
          break
        }
        case "MethodDefinition": {
          /*
           * Declaring class methods are ok.
           * OK: class { global() {} }
           */
          return
        }
        case "NewExpression": {
          /*
           * Creating new objects are ok.
           * OK: new Array()
           */
          return
        }
        case "FunctionDeclaration": {
          /*
           * Declaring named functions are ok.
           * OK: function global() {}
           */
          return
        }
        case "CallExpression": {
          /*
           * Calling functions declared outside the current scope is allowed, but arguments can't be.
           * OK: global('value')
           * NOK: local(global)
           */
          if (node.parent.callee === node) {
            return
          }
          break
        }
        case "MemberExpression": {
          /*
           * Allow mutating local objects with Object functions but not globals.
           * OK: Object.assign(local, { key: 'value' })
           * NOK: Object.assign(global, { key: 'value' })
           */
          if (
            (node.name === "assign" ||
              node.name === "defineProperty" ||
              node.name === "defineProperties" ||
              node.name === "__defineGetter__" ||
              node.name === "__defineSetter__" ||
              node.name === "setPrototypeOf") &&
            node.parent.object.type === "Identifier" &&
            node.parent.object.name === "Object" &&
            node.parent.parent.type === "CallExpression"
          ) {
            const [arg] = node.parent.parent.arguments
            if (arg.type === "Identifier") {
              checkGlobalVariableAssignment(node.parent.parent, arg.name)
            } else if (
              arg.type === "MemberExpression" &&
              arg.object.type === "Identifier"
            ) {
              checkGlobalVariableAssignment(node.parent.parent, arg.object.name)
            }
          }
          /*
           * Allow access to properties on objects, but always check the object itself.
           * OK: local.push('value') (push is skipped, local is checked)
           * OK: Rune.initLogic() (initLogic is skipped, Rune is checked but is runtime global)
           * NOK: global.push('value') (push is skipped, global is checked)
           */
          if (
            node.parent.object !== node ||
            node.parent.parent.type === "BinaryExpression" ||
            isRuntimeGlobalVariable(
              findVariable(node.parent.object.name, context.getScope())
            )
          ) {
            return
          }
          break
        }
        case "Property": {
          /*
           * Defining property names are OK as long as they are not referencing a variable.
           * OK: { global: 'value' }
           * NOK: { [global]: 'value' }
           */
          if (!node.parent.computed) {
            return
          }
          break
        }
      }
      checkLocalVariable(node, node.name)
    },
  }
}
