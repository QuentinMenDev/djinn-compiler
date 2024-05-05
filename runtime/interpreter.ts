import type {
	AssignmentExpression,
	BinaryExpression,
	Identifier,
	NumericLiteral,
	Program,
	Statement,
	VariableDeclaration,
} from "../src/ast"
import type Environment from "./environment"
import {
	interpretAssignmentExpression,
	interpretBinaryExpression,
	interpretIdentifier,
} from "./interpreter/expressions"
import {
	interpretProgram,
	interpretVariableDeclaration,
} from "./interpreter/statements"
import { type RuntimeValue, makeNumber } from "./values"

export function interpret(astNode: Statement, env: Environment): RuntimeValue {
	switch (astNode.kind) {
		case "NumericLiteral":
			return makeNumber((astNode as NumericLiteral).value)
		case "Identifier":
			return interpretIdentifier(astNode as Identifier, env)
		case "AssignmentExpression":
			return interpretAssignmentExpression(astNode as AssignmentExpression, env)
		case "BinaryExpression":
			return interpretBinaryExpression(astNode as BinaryExpression, env)
		case "Program":
			return interpretProgram(astNode as Program, env)
		// Handle statements
		case "VariableDeclaration":
			return interpretVariableDeclaration(astNode as VariableDeclaration, env)
		default:
			throw new Error(`Unknown node type ${astNode.kind}`)
	}
}
