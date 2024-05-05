/**
 * Define types for runtime values
 */

export type ValueType = "null" | "number" | "string" | "boolean" | "object"

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
