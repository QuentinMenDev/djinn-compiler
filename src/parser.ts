import type {
	AssignmentExpression,
	BinaryExpression,
	Expression,
	Identifier,
	NumericLiteral,
	ObjectLiteral,
	Program,
	Property,
	Statement,
	VariableDeclaration,
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

	// Handle complex statements
	private parseStatement(): Statement {
		const token = this.peek().type

		switch (token) {
			case TokenType.Let:
			case TokenType.Const:
				return this.parseVariableDeclaration()
			default:
				return this.parseExpression()
		}
	}

	private parseVariableDeclaration(): Statement {
		const token = this.consume()

		const isConstant = token.type === TokenType.Const
		const identifier = this.expect(TokenType.Identifier).value

		// ! If we don't keep undefined, this should be a runtime error
		if (this.peek().type === TokenType.Semicolon) {
			this.consume()

			if (isConstant) {
				throw new Error("Constant must be initialized")
			}

			return {
				kind: "VariableDeclaration",
				constant: false,
				identifier,
			} as VariableDeclaration
		}

		this.expect(TokenType.Equals)

		const declaration = {
			kind: "VariableDeclaration",
			constant: isConstant,
			value: this.parseExpression(),
			identifier,
		} as VariableDeclaration

		this.expect(TokenType.Semicolon)

		return declaration
	}

	private parseExpression(): Expression {
		return this.parseAssignmentExpression()
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

	private parseAssignmentExpression(): Expression {
		const left = this.parseObjectLiteral()

		if (this.peek().type === TokenType.Equals) {
			this.consume()
			const right = this.parseAssignmentExpression() // this allows chaining of assignments

			return {
				kind: "AssignmentExpression",
				assignee: left,
				value: right,
			} as AssignmentExpression
		}

		return left
	}

	private parseObjectLiteral(): Expression {
		if (this.peek().type !== TokenType.OpenBrace) {
			return this.parseAdditiveExpression()
		}

		this.consume()
		const properties = new Array<Property>()

		while (!this.isEof() && this.peek().type !== TokenType.CloseBrace) {
			const key = this.expect(TokenType.Identifier).value

			// * case: { x, }
			if (this.peek().type === TokenType.Coma) {
				this.consume()
				properties.push({
					kind: "Property",
					key,
				})
				continue
			}
			// * case: { x }
			if (this.peek().type === TokenType.CloseBrace) {
				properties.push({
					kind: "Property",
					key,
				})
				continue
			}

			this.expect(TokenType.Colon)
			const value = this.parseExpression()

			properties.push({
				kind: "Property",
				key,
				value,
			})

			if (this.peek().type !== TokenType.CloseBrace) {
				this.expect(TokenType.Coma)
			}
		}

		this.expect(TokenType.CloseBrace)
		return {
			kind: "ObjectLiteral",
			properties,
		} as ObjectLiteral
	}

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
