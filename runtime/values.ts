import type { Statement } from "../src/ast"
import type Environment from "./environment"

/**
 * Define types for runtime values
 */
export type ValueType =
	| "null"
	| "number"
	| "string"
	| "boolean"
	| "object"
	| "native-function"
	| "function"

export interface RuntimeValue {
	type: ValueType
}

export interface NullValue extends RuntimeValue {
	type: "null"
	value: null
}
export interface NumberValue extends RuntimeValue {
	type: "number"
	value: number
}
export interface BooleanValue extends RuntimeValue {
	type: "boolean"
	value: boolean
}
export interface ObjectValue extends RuntimeValue {
	type: "object"
	properties: Map<string, RuntimeValue>
}

export type FunctionCall = (
	args: RuntimeValue[],
	env: Environment,
) => RuntimeValue
export interface NativeFunctionValue extends RuntimeValue {
	type: "native-function"
	call: FunctionCall
}
export interface FunctionValue extends RuntimeValue {
	type: "function"
	name: string
	parameters: string[]
	declarationEnv: Environment
	body: Statement[]
}

// I don't like the naming of these functions
export function makeNumber(value = 0): NumberValue {
	return {
		type: "number",
		value,
	}
}
export function makeNull(): NullValue {
	return {
		type: "null",
		value: null,
	}
}
export function makeBoolean(value = true): BooleanValue {
	return {
		type: "boolean",
		value,
	}
}
export function makeNativeFunction(call: FunctionCall) {
	return {
		type: "native-function",
		call,
	} as NativeFunctionValue
}
