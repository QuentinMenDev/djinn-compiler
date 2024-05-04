import type { Program, VariableDeclaration } from "../../src/ast"
import type Environment from "../environment"
import { interpret } from "../interpreter"
import { type RuntimeValue, makeNull } from "../values"

export function interpretProgram(
	program: Program,
	env: Environment,
): RuntimeValue {
	let lastInterpretedValue: RuntimeValue = makeNull()

	for (const statement of program.body) {
		lastInterpretedValue = interpret(statement, env)
	}

	return lastInterpretedValue
}

export function interpretVariableDeclaration(
	declaration: VariableDeclaration,
	env: Environment,
): RuntimeValue {
	const value = declaration.value
		? interpret(declaration.value, env)
		: makeNull()

	return env.declareVariable(
		declaration.identifier,
		value,
		declaration.constant,
	)
}
