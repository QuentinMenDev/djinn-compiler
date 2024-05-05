import type {
	AssignmentExpression,
	BinaryExpression,
	CallExpression,
	FunctionDeclaration,
	Identifier,
	NumericLiteral,
	ObjectLiteral,
	Program,
	Statement,
	VariableDeclaration,
} from "../src/ast"
import type Environment from "./environment"
import {
	interpretAssignmentExpression,
	interpretBinaryExpression,
	interpretCallExpression,
	interpretIdentifier,
	interpretObjectExpression,
} from "./interpreter/expressions"
import {
	interpretFunctionDeclaration,
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
		case "ObjectLiteral":
			return interpretObjectExpression(astNode as ObjectLiteral, env)
		case "CallExpression":
			return interpretCallExpression(astNode as CallExpression, env)
		case "AssignmentExpression":
			return interpretAssignmentExpression(astNode as AssignmentExpression, env)
		case "BinaryExpression":
			return interpretBinaryExpression(astNode as BinaryExpression, env)
		case "Program":
			return interpretProgram(astNode as Program, env)
		// Handle statements
		case "VariableDeclaration":
			return interpretVariableDeclaration(astNode as VariableDeclaration, env)
		case "FunctionDeclaration":
			return interpretFunctionDeclaration(astNode as FunctionDeclaration, env)
		default:
			throw new Error(`Unknown node type ${astNode.kind}`)
	}
}
