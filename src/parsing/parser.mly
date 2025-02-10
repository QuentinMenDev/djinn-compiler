%{
  [@@@coverage exclude_file]
  open Ast.Ast_types
  open Parsed_ast
%}

%token <int> INT
// Mathematical operators
%token PLUS
%token MINUS
%token MULT
%token DIV
%token EQUAL
// Misc
%token EOF

%right EQUAL
%left PLUS MINUS
%left MULT DIV

%start program
%type <Parsed_ast.program> program
%type <expr> expr
%type <bin_op> bin_op
%%

program:
  | main=expr EOF { Prog($startpos, main) }
  ;

expr:
  | i=INT {Integer($startpos, i)}
  // Unary minus used for negative numbers
  | MINUS e=expr { UnaryMinus($startpos, e) }
  | e1=expr op=bin_op e2=expr {BinaryOp($startpos, op, e1, e2)}
  ;

%inline bin_op:
  | PLUS {BinOpAdd}
  | MINUS {BinOpSub}
  | MULT {BinOpMult}
  | DIV {BinOpDiv}
  | EQUAL {BinOpEq}
  ;
