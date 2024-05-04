export type NodeType =
	| "Program"
	| "NumericLiteral"
	| "Identifier"
	| "BinaryExpression"

export interface Statement {
	kind: NodeType
}

export interface Program extends Statement {
	kind: "Program"
	body: Statement[]
}
export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
	kind: "BinaryExpression"
	operator: string
	left: Expression
	right: Expression
}
export interface Identifier extends Expression {
	kind: "Identifier"
	name: string
}
export interface NumericLiteral extends Expression {
	kind: "NumericLiteral"
	value: number
}
