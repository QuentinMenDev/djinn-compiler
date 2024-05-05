import {
	type RuntimeValue,
	makeBoolean,
	makeNativeFunction,
	makeNull,
	makeNumber,
} from "./values"

export function createGlobalEnv() {
	const env = new Environment()
	// Create default global environment
	env.declareVariable("true", makeBoolean(true), true)
	env.declareVariable("false", makeBoolean(false), true)
	env.declareVariable("null", makeNull(), true)

	// Define a few native functions
	env.declareVariable(
		"print",
		makeNativeFunction((args, scope) => {
			console.log(...args)
			return makeNull()
		}),
		true,
	)

	function timeFunction() {
		return makeNumber(Date.now())
	}

	env.declareVariable("time", makeNativeFunction(timeFunction), true)

	return env
}

export default class Environment {
	private parent?: Environment
	private variables: Map<string, RuntimeValue>
	private constants: Set<string>

	constructor(parent?: Environment) {
		const global = !!parent
		this.parent = parent
		this.variables = new Map()
		this.constants = new Set()
	}

	public declareVariable(
		name: string,
		value: RuntimeValue,
		constant: boolean,
	): RuntimeValue {
		// TODO: check parent declaration too
		if (this.variables.has(name)) {
			throw new Error(`Variable ${name} already declared`)
		}

		this.variables.set(name, value)

		if (constant) {
			this.constants.add(name)
		}

		return value
	}

	public assignVariable(name: string, value: RuntimeValue): RuntimeValue {
		const environment = this.resolve(name)

		if (environment.constants.has(name)) {
			throw new Error(`Cannot reassign to constant ${name}`)
		}

		environment.variables.set(name, value)

		return value
	}

	public resolve(name: string): Environment {
		if (this.variables.has(name)) {
			return this
		}

		if (this.parent) {
			return this.parent.resolve(name)
		}

		throw new Error(`Variable ${name} not found`)
	}
	public lookup(name: string): RuntimeValue {
		const environment = this.resolve(name)
		return environment.variables.get(name) as RuntimeValue
	}
}
