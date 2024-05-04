import Parser from "./src/parser"

// REPL: Read, Evaluate, Print, Loop
async function repl() {
	const parser = new Parser()
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
			console.log(JSON.stringify(ast, null, 2))
		} catch (error) {
			console.error(error)
		}
	}
}

repl()
