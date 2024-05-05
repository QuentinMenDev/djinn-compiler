import type {
	AssignmentExpression,
	BinaryExpression,
	CallExpression,
	Expression,
	FunctionDeclaration,
	Identifier,
	MemberExpression,
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
			case TokenType.Fn:
				return this.parseFunctionDeclaration()
			default:
				return this.parseExpression()
		}
	}

	private parseFunctionDeclaration(): Statement {
		this.consume() // consume the fn keyword
		const name = this.expect(TokenType.Identifier).value

		const args = this.parseArgs()
		const params = args.map((arg) => {
			if (arg.kind !== "Identifier") {
				throw new Error("Invalid argument. String expected as parameter.")
			}
			return (arg as Identifier).symbol
		})

		// ? If we have an async function, we can add a flag here
		// ...

		this.expect(TokenType.OpenBrace)

		const body: Statement[] = []

		while (!this.isEof() && this.peek().type !== TokenType.CloseBrace) {
			body.push(this.parseStatement())
		}

		this.expect(TokenType.CloseBrace)

		const fn = {
			kind: "FunctionDeclaration",
			name,
			parameters: params,
			body,
		} as FunctionDeclaration

		return fn
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

	private parseMemberExpression(): Expression {
		let object = this.parsePrimaryExpression()

		while (
			this.peek().type === TokenType.Dot ||
			this.peek().type === TokenType.OpenBracket
		) {
			const operator = this.consume()
			let property: Expression
			let computed: boolean

			if (operator.type === TokenType.Dot) {
				computed = false
				property = this.parsePrimaryExpression()

				if (property.kind !== "Identifier") {
					throw new Error(
						"Cannot access property of non-identifier. Right hand side must be an identifier.",
					)
				}
			} else {
				// this allows chaining like obj[computedValue]
				computed = true
				property = this.parseExpression()
				this.expect(TokenType.CloseBracket)
			}

			object = {
				kind: "MemberExpression",
				object,
				property,
				computed,
			} as MemberExpression
		}

		return object
	}

	/**
	 * Order of operations
	 * Primary expressions
	 * Member expressions
	 * Function calls
	 * Multiplication and division
	 * Addition and subtraction
	 * Object literals
	 * Assignment expressions
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
			if (this.peek().type === TokenType.Comma) {
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
				this.expect(TokenType.Comma)
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
		let left = this.parseCallMemberExpression()

		while (
			this.peek().type === TokenType.BinaryOperator &&
			this.peek().value.match(/[\*\/\%]/)
		) {
			const operator = this.consume().value
			const right = this.parseCallMemberExpression()

			left = {
				kind: "BinaryExpression",
				operator,
				left,
				right,
			} as BinaryExpression
		}

		return left
	}

	private parseCallMemberExpression(): Expression {
		const member = this.parseMemberExpression()

		if (this.peek().type === TokenType.OpenParen) {
			return this.parseCallExpression(member)
		}

		return member
	}
	private parseCallExpression(caller: Expression): Expression {
		let callExpression: Expression = {
			kind: "CallExpression",
			caller,
			args: this.parseArgs(),
		} as CallExpression

		// * Handle nested calls
		if (this.peek().type === TokenType.OpenParen) {
			callExpression = this.parseCallExpression(callExpression)
		}

		return callExpression
	}
	private parseArgs(): Expression[] {
		this.expect(TokenType.OpenParen)
		const args =
			this.peek().type === TokenType.CloseParen ? [] : this.parseArgumentsList()

		this.expect(TokenType.CloseParen)
		return args
	}
	private parseArgumentsList(): Expression[] {
		const args = [this.parseExpression()]

		while (!this.isEof() && this.peek().type === TokenType.Comma) {
			this.consume()
			args.push(this.parseExpression())
		}

		return args
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
