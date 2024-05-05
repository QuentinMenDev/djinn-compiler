export type NodeType =
	// Statements
	| "Program"
	| "VariableDeclaration"
	| "FunctionDeclaration"

	// Expressions
	| "AssignmentExpression"
	| "MemberExpression"
	| "CallExpression"

	// Literals
	| "Property"
	| "ObjectLiteral"
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
export interface FunctionDeclaration extends Statement {
	kind: "FunctionDeclaration"
	parameters: string[]
	name: string
	body: Statement[]
	// async: boolean
	// arrow: boolean
}
// Expressions will result in a value at runtime (unlike statements)
export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
	kind: "BinaryExpression"
	operator: string
	left: Expression
	right: Expression
}

export interface CallExpression extends Expression {
	kind: "CallExpression"
	args: Expression[]
	caller: Expression
}

export interface MemberExpression extends Expression {
	kind: "MemberExpression"
	object: Expression
	property: Expression
	computed: boolean
}

// Literals / Primary Expressions

/**
 * Represents a user defined variable or symbol
 */
export interface Identifier extends Expression {
	kind: "Identifier"
	symbol: string
}
/**
 * Represents a numeric constant
 */
export interface NumericLiteral extends Expression {
	kind: "NumericLiteral"
	value: number
}
/**
 * Represents a key-value pair
 */
export interface Property extends Expression {
	kind: "Property"
	key: string
	value?: Expression // This means that a property can be declared without a value. Eg. { x, y: 2 }
}
/**
 * Represents an array of key-value pairs
 */
export interface ObjectLiteral extends Expression {
	kind: "ObjectLiteral"
	properties: Property[]
}
export interface AssignmentExpression extends Expression {
	kind: "AssignmentExpression"
	assignee: Expression
	value: Expression
}
