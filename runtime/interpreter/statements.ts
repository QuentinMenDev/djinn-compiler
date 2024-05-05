import type {
	FunctionDeclaration,
	Program,
	VariableDeclaration,
} from "../../src/ast"
import type Environment from "../environment"
import { interpret } from "../interpreter"
import { type FunctionValue, type RuntimeValue, makeNull } from "../values"

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

export function interpretFunctionDeclaration(
	declaration: FunctionDeclaration,
	env: Environment,
): RuntimeValue {
	const fn = {
		type: "function",
		name: declaration.name,
		parameters: declaration.parameters,
		declarationEnv: env,
		body: declaration.body,
	} as FunctionValue

	return env.declareVariable(declaration.name, fn, true)
}
