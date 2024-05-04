import type {
	BinaryExpression,
	NumericLiteral,
	Program,
	Statement,
} from "../src/ast"
import type { NullValue, NumberValue, RuntimeValue } from "./values"

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

	return {
		type: "number",
		value: result,
	}
}

function interpretBinaryExpression(node: BinaryExpression): RuntimeValue {
	const left = interpret(node.left)
	const right = interpret(node.right)

	if (left.type !== "number" || right.type !== "number") {
		throw new Error("Operands must be numbers")
	}

	return interpretNumericBinaryExpression(
		left as NumberValue,
		right as NumberValue,
		node.operator,
	)
}

function interpretProgram(program: Program): RuntimeValue {
	let lastInterpretedValue: RuntimeValue = {
		type: "null",
		value: "null",
	} as NullValue

	for (const statement of program.body) {
		lastInterpretedValue = interpret(statement)
	}

	return lastInterpretedValue
}

export function interpret(astNode: Statement): RuntimeValue {
	switch (astNode.kind) {
		case "NumericLiteral":
			return {
				type: "number",
				value: (astNode as NumericLiteral).value,
			} as NumberValue
		case "NullLiteral":
			return {
				type: "null",
				value: "null",
			} as NullValue
		case "BinaryExpression":
			return interpretBinaryExpression(astNode as BinaryExpression)
		case "Program":
			return interpretProgram(astNode as Program)
		default:
			throw new Error(`Unknown node type ${astNode.kind}`)
	}
}
