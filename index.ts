import Environment from "./runtime/environment"
import { interpret } from "./runtime/interpreter"
import { makeBoolean, makeNull, makeNumber } from "./runtime/values"
import Parser from "./src/parser"

// REPL: Read, Evaluate, Print, Loop
async function repl() {
	const parser = new Parser()
	const env = new Environment()
	env.declareVariable("x", makeNumber(100), false)
	env.declareVariable("true", makeBoolean(), true)
	env.declareVariable("false", makeBoolean(false), true)
	env.declareVariable("null", makeNull(), true)

	console.log("\nRepl v0.1.0")

	while (true) {
		const input = await prompt(">>> ")
		if (
			!input ||
			input === "exit" ||
			input === "ex" ||
			input === "quit" ||
			input === "q"
		) {
			break
		}

		try {
			const ast = parser.produceAST(input)
			const result = interpret(ast, env)
			console.log(result)
		} catch (error) {
			console.error(error)
		}
	}
}

repl()
