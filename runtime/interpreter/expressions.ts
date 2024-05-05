import type {
	AssignmentExpression,
	BinaryExpression,
	Identifier,
	ObjectLiteral,
} from "../../src/ast"
import type Environment from "../environment"
import { interpret } from "../interpreter"
import {
	type NumberValue,
	type ObjectValue,
	type RuntimeValue,
	makeNumber,
} from "../values"

export function interpretNumericBinaryExpression(
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

export function interpretBinaryExpression(
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

export function interpretIdentifier(
	node: Identifier,
	env: Environment,
): RuntimeValue {
	return env.lookup(node.symbol)
}

export function interpretAssignmentExpression(
	node: AssignmentExpression,
	env: Environment,
): RuntimeValue {
	if (node.assignee.kind !== "Identifier") {
		throw new Error("Invalid assignment target")
	}

	const name = (node.assignee as Identifier).symbol

	return env.assignVariable(name, interpret(node.value, env))
}

export function interpretObjectExpression(
	obj: ObjectLiteral,
	env: Environment,
): RuntimeValue {
	const object = {
		type: "object",
		properties: new Map(),
	} as ObjectValue

	for (const { key, value } of obj.properties) {
		const runtimeValue =
			value === undefined ? env.lookup(key) : interpret(value, env)

		object.properties.set(key, runtimeValue)
	}

	return object
}
