import type { RuntimeValue } from "./values"

export default class Environment {
	private parent?: Environment
	private variables: Map<string, RuntimeValue>

	constructor(parent?: Environment) {
		this.parent = parent
		this.variables = new Map()
	}

	public declareVariable(name: string, value: RuntimeValue): RuntimeValue {
		// TODO: check parent declaration too
		if (this.variables.has(name)) {
			throw new Error(`Variable ${name} already declared`)
		}

		this.variables.set(name, value)
		return value
	}

	public assignVariable(name: string, value: RuntimeValue): RuntimeValue {
		const environment = this.resolve(name)
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
