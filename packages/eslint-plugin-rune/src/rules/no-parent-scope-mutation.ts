import type { Rule, Scope } from "eslint"
import type { Node, Pattern } from "estree"

export const meta: Rule.RuleModule["meta"] = {
  type: "problem",
  docs: {
    description:
      "Only allow mutating and assinging variables in the current function scope",
    recommended: true,
  },
  schema: [],
  messages: {
    noParentScopeMutation: "Variables from parent scope may not be mutated.",
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

  const resolveVariable = (
    variable: Scope.Variable | null
  ): Scope.Variable | null => {
    if (!variable) {
      return null
    }
    const [def] = variable.defs
    if (
      def?.node?.type === "VariableDeclarator" &&
      def.node.init?.type === "Identifier"
    ) {
      const ref = findVariable(def.node.init.name, variable.scope)
      if (ref !== variable) {
        return resolveVariable(ref)
      }
      return ref
    }
    return variable
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
      ? variable.scope.type === "global" &&
        (variable.identifiers.length === 0 ||
          findFunctionScope(variable.scope) !==
            findFunctionScope(context.getScope()))
      : false

  const checkLocalVariableMutation = (
    reportNode: Node,
    variableName: string
  ) => {
    const scope = context.getScope()
    const variable = resolveVariable(findVariable(variableName, scope))
    if (
      variable && // undefined variables are handled by builtin rule
      (isRuntimeGlobalVariable(variable) ||
        findFunctionScope(variable.scope) !== findFunctionScope(scope))
    ) {
      context.report({
        node: reportNode,
        messageId: "noParentScopeMutation",
      })
    }
  }

  const checkPatternVariableName = (sourceNode: Node, node: Pattern): void => {
    switch (node.type) {
      case "Identifier": {
        checkLocalVariableMutation(node, node.name)
        break
      }
      case "MemberExpression": {
        switch (node.object.type) {
          case "Identifier":
          case "MemberExpression":
            checkPatternVariableName(sourceNode, node.object)
        }
        break
      }
      case "ArrayPattern":
        for (const element of node.elements) {
          if (element) {
            checkPatternVariableName(sourceNode, element)
          }
        }
        break
      case "ObjectPattern":
        for (const property of node.properties) {
          checkPatternVariableName(
            sourceNode,
            property.type === "Property" ? property.value : property.argument
          )
        }
        break
      case "RestElement":
        checkPatternVariableName(sourceNode, node.argument)
        break
      case "AssignmentPattern":
        checkPatternVariableName(sourceNode, node.left)
        break
    }
  }

  return {
    UnaryExpression(node) {
      if (node.operator === "delete") {
        switch (node.argument.type) {
          case "Identifier":
          case "MemberExpression":
            checkPatternVariableName(node, node.argument)
            break
        }
      }
    },
    UpdateExpression(node) {
      if (
        node.argument.type === "MemberExpression" &&
        node.argument.object.type === "Identifier"
      ) {
        checkLocalVariableMutation(node, node.argument.object.name)
      } else if (node.argument.type === "Identifier") {
        checkLocalVariableMutation(node, node.argument.name)
      }
    },
    AssignmentExpression(node) {
      /*
       * Assigning to local variable is ok, but global is not.
       * OK: local = 'value'
       * NOK: global = 'value'
       */
      checkPatternVariableName(node, node.left)
    },
    MemberExpression(node) {
      /*
       * Prevent common mutations. This is not an exhaustive list.
       * NOK: array.push('value')
       */
      if (
        node.object.type === "Identifier" &&
        node.property.type === "Identifier"
      ) {
        switch (node.property.name) {
          case "push":
          case "pop":
          case "unshift":
          case "splice":
          case "fill":
          case "delete":
          case "clear":
          case "set":
          case "add":
          case "remove":
            checkLocalVariableMutation(node.parent, node.object.name)
            break
        }
      }
    },
    Identifier(node) {
      switch (node.parent.type) {
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
            switch (arg.type) {
              case "Identifier":
              case "MemberExpression":
                checkPatternVariableName(node, arg)
            }
          }
          break
        }
      }
    },
  }
}
