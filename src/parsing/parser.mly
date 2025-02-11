/* Header: OCaml code runned before parsing */
%{
  [@@@coverage exclude_file]
  open Ast.Ast_types
  open Parsed_ast
%}

/* Tokens declaration */
%token <int> INT
%token <float> FLOAT
%token <float> IMAGINARY
%token SEMICOLON
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
%type <statement> statement
%type <expr> expr
%type <bin_op> bin_op
%%

/* Grammar rules */
program:
  | main=list(statement) EOF { Prog($startpos, main) }
  ;

statement:
  | e=expr SEMICOLON { Block($startpos, e) }
  | e=expr EOF { Block($startpos, e) }
  ;

expr:
  | i=INT                     { Integer($startpos, i) }
  | f=FLOAT                   { Float($startpos, f) }
  | i=IMAGINARY               { Imaginary($startpos, i) }
  | e1=expr op=bin_op e2=expr { BinaryOp($startpos, op, e1, e2) }
  ;

%inline bin_op:
  | PLUS  {BinOpAdd}
  | MINUS {BinOpSub}
  | MULT  {BinOpMult}
  | DIV   {BinOpDiv}
  | EQUAL {BinOpEq}
  ;

/* Trailers: OCaml code runned after parsing */