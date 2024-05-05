export type NodeType =
	// Statements
	| "Program"
	| "VariableDeclaration"
	// Expressions
	| "AssignmentExpression"
	| "NumericLiteral"
	| "Identifier"
	| "BinaryExpression"

export interface Statement {
	kind: NodeType
}

/**
 * Defines a block which contains a list of statements
 * Only 1 program will be contained in a file
 */
export interface Program extends Statement {
	kind: "Program"
	body: Statement[]
}
export interface VariableDeclaration extends Statement {
	kind: "VariableDeclaration"
	constant: boolean
	identifier: string
	value?: Expression // This means that a variable can be declared without a value. Eg. let x;
}
// Expressions will result in a value at runtime (unlike statements)
export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
	kind: "BinaryExpression"
	operator: string
	left: Expression
	right: Expression
}

export interface Identifier extends Expression {
	kind: "Identifier"
	symbol: string
}
export interface NumericLiteral extends Expression {
	kind: "NumericLiteral"
	value: number
}
export interface AssignmentExpression extends Expression {
	kind: "AssignmentExpression"
	assignee: Expression
	value: Expression
}
