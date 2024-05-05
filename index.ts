import { inspect } from "bun"
import Environment, { createGlobalEnv } from "./runtime/environment"
import { interpret } from "./runtime/interpreter"
import Parser from "./src/parser"

run("./test.dj")

async function run(filename: string) {
	const parser = new Parser()
	const env = createGlobalEnv()

	try {
		const input = await Bun.file(filename).text()
		const ast = parser.produceAST(input)
		// console.log(JSON.stringify(ast, null, 4))
		const result = interpret(ast, env)
		console.log(result)
	} catch (error) {
		console.error(error)
	}
}

// REPL: Read, Evaluate, Print, Loop
// repl()
async function repl(filename: string) {
	const parser = new Parser()
	const env = createGlobalEnv()

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
			const input = await Bun.file(filename).text()
			const ast = parser.produceAST(input)
			const result = interpret(ast, env)
			console.log(result)
		} catch (error) {
			console.error(error)
		}
	}
}
