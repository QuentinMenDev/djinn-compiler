import type {
	BinaryExpression,
	Expression,
	Identifier,
	NullLiteral,
	NumericLiteral,
	Program,
	Statement,
} from "./ast"
import { type Token, TokenType, tokenize } from "./lexer"

export default class Parser {
	private tokens: Token[] = []

	private isEof(): boolean {
		return this.tokens[0]?.type === TokenType.EOF
	}

	private peek(): Token {
		return this.tokens[0]
	}

	private consume(): Token {
		const token = this.tokens.shift()
		if (!token) {
			throw new Error("Unexpected EOF")
		}

		return token
	}

	private expect(type: TokenType): Token {
		const token = this.consume()
		if (token.type !== type) {
			throw new Error(`Unexpected token ${token.type}, expected ${type}`)
		}

		return token
	}

	public produceAST(sourceCode: string): Program {
		this.tokens = tokenize(sourceCode)
		const program: Program = {
			kind: "Program",
			body: [],
		}

		while (!this.isEof()) {
			const statement = this.parseStatement()
			if (statement) {
				program.body.push(statement)
			}
		}

		return program
	}

	private parseStatement(): Statement {
		return this.parseExpression()
	}

	private parseExpression(): Expression {
		return this.parseAdditiveExpression()
	}

	/**
	 * Order of operations
	 * 1. Primary expressions
	 * 2. Multiplication and division
	 * 3. Addition and subtraction
	 * 4. Comparison
	 * 5. Logical expressions
	 * 6. Function calls
	 * 7. Member expressions
	 * 8. Assignment expressions
	 */
	private parseAdditiveExpression(): Expression {
		let left = this.parseMultiplicativeExpression()

		while (
			this.peek().type === TokenType.BinaryOperator &&
			this.peek().value.match(/[\+\-]/)
		) {
			const operator = this.consume().value
			const right = this.parseMultiplicativeExpression()

			left = {
				kind: "BinaryExpression",
				operator,
				left,
				right,
			} as BinaryExpression
		}

		return left
	}

	private parseMultiplicativeExpression(): Expression {
		let left = this.parsePrimaryExpression()

		while (
			this.peek().type === TokenType.BinaryOperator &&
			this.peek().value.match(/[\*\/\%]/)
		) {
			const operator = this.consume().value
			const right = this.parsePrimaryExpression()

			left = {
				kind: "BinaryExpression",
				operator,
				left,
				right,
			} as BinaryExpression
		}

		return left
	}

	private parsePrimaryExpression(): Expression {
		const token = this.peek().type

		switch (token) {
			case TokenType.Identifier:
				return {
					kind: "Identifier",
					symbol: this.consume().value,
				} as Identifier
			case TokenType.Null:
				this.consume()
				return {
					kind: "NullLiteral",
					value: "null",
				} as NullLiteral
			case TokenType.Number:
				return {
					kind: "NumericLiteral",
					value: Number.parseFloat(this.consume().value),
				} as NumericLiteral
			case TokenType.OpenParen: {
				this.consume()
				const expression = this.parseExpression()
				this.expect(TokenType.CloseParen)
				return expression
			}
			default:
				throw new Error(`Unexpected token ${token}`)
		}
	}
}
