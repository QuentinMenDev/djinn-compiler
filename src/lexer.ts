/**
 * Possible upgrades:
 * - Use classes for tokens
 * - Have more token types
 * - Have better error handling
 */

export enum TokenType {
	// Literal types
	Number = "Number",
	Identifier = "Identifier",

	// Operators, Grouping
	Equals = "Equals",
	OpenParen = "OpenParen",
	CloseParen = "CloseParen",
	BinaryOperator = "BinaryOperator",
	EOF = "EOF",

	// Keywords
	Let = "Let",
}

const KEYWORDS: Record<string, TokenType> = {
	let: TokenType.Let,
}

export interface Token {
	type: TokenType
	value: string
}

function isSkipChar(char: string): boolean {
	return char === " " || char === "\n" || char === "\t"
}

export function tokenize(sourceCode: string): Token[] {
	const tokens = new Array<Token>()
	const src = sourceCode.split("")

	while (src.length > 0) {
		const char = src.shift()
		if (char === undefined) {
			break
		}

		if (isSkipChar(char)) {
			continue
		}

		if (char === "(") {
			tokens.push({ type: TokenType.OpenParen, value: char })
			continue
		}

		if (char === ")") {
			tokens.push({ type: TokenType.CloseParen, value: char })
			continue
		}

		if (char === "=") {
			tokens.push({ type: TokenType.Equals, value: char })
			continue
		}

		if (char.match(/[\+\-\*\/\%]/)) {
			tokens.push({ type: TokenType.BinaryOperator, value: char })
			continue
		}

		/**
		 * * Multi-character tokens
		 */
		// ? Numbers
		if (char.match(/[0-9]/)) {
			let number = char
			while (src[0]?.match(/[0-9]/)) {
				number += src.shift()
			}
			tokens.push({ type: TokenType.Number, value: number })
			continue
		}

		// ? Identifiers
		if (char.match(/[a-zA-Z]/)) {
			let identifier = char
			while (src[0]?.match(/[a-zA-Z]/)) {
				identifier += src.shift()
			}

			const reserved = KEYWORDS[identifier]
			if (reserved) {
				tokens.push({ type: reserved, value: identifier })
			} else {
				tokens.push({ type: TokenType.Identifier, value: identifier })
			}
			continue
		}

		throw new Error(`Unexpected character: ${char}`)
	}

	tokens.push({ type: TokenType.EOF, value: "EndOfFile" })

	return tokens
}
