import type {
	BinaryExpression,
	Identifier,
	NumericLiteral,
	Program,
	Statement,
} from "../src/ast"
import type Environment from "./environment"
import {
	type NumberValue,
	type RuntimeValue,
	makeNull,
	makeNumber,
} from "./values"

function interpretNumericBinaryExpression(
	left: NumberValue,
	right: NumberValue,
	operator: string,
): NumberValue {
	let result: number
	switch (operator) {
		case "+":
			result = left.value + right.value
			break
		case "-":
			result = left.value - right.value
			break
		case "*":
			result = left.value * right.value
			break
		case "/":
			result = left.value / right.value
			break
		case "%":
			result = left.value % right.value
			break
		default:
			throw new Error(`Unknown operator ${operator}`)
	}

	return makeNumber(result)
}

function interpretBinaryExpression(
	node: BinaryExpression,
	env: Environment,
): RuntimeValue {
	const left = interpret(node.left, env)
	const right = interpret(node.right, env)

	if (left.type !== "number" || right.type !== "number") {
		throw new Error("Operands must be numbers")
	}

	return interpretNumericBinaryExpression(
		left as NumberValue,
		right as NumberValue,
		node.operator,
	)
}

function interpretProgram(program: Program, env: Environment): RuntimeValue {
	let lastInterpretedValue: RuntimeValue = makeNull()

	for (const statement of program.body) {
		lastInterpretedValue = interpret(statement, env)
	}

	return lastInterpretedValue
}

function interpretIdentifier(node: Identifier, env: Environment): RuntimeValue {
	return env.lookup(node.symbol)
}

export function interpret(astNode: Statement, env: Environment): RuntimeValue {
	switch (astNode.kind) {
		case "NumericLiteral":
			return makeNumber((astNode as NumericLiteral).value)
		case "Identifier":
			return interpretIdentifier(astNode as Identifier, env)
		case "BinaryExpression":
			return interpretBinaryExpression(astNode as BinaryExpression, env)
		case "Program":
			return interpretProgram(astNode as Program, env)
		default:
			throw new Error(`Unknown node type ${astNode.kind}`)
	}
}
