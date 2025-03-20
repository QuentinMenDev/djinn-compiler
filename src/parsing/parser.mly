/* Header: OCaml code runned before parsing */
%{
  [@@@coverage exclude_file]
  open Ast.Ast_types
  open Parsed_ast
%}

/* Tokens declaration */
%token <int> INT
%token <float> FLOAT
%token <float> DOUBLE
%token <float> IMAGINARY
%token <string> BOOLEAN
%token <string> ID
%token <string> STRING
// Modifiers
%token CONST
// Types
%token INT_TYPE
%token FLOAT_TYPE
%token DOUBLE_TYPE
%token COMPLEX_TYPE
%token BOOLEAN_TYPE
%token STRING_TYPE
// Mathematical operators
%token PLUS
%token MINUS
%token MULT
%token DIV
%token EQUAL
// Misc
%token SEMICOLON
%token NEWLINE
%token EOF

%right EQUAL
%left PLUS MINUS
%left MULT DIV

%start program
%type <Parsed_ast.program> program
%type <statement> statement
%type <expr> expr
%type <bin_op> bin_op
%type <type_expr> type_expr
%%

/* Grammar rules */
program:
  | main=list(statement) EOF { Prog($startpos, main) }
  ;

statement:
  | e=expr SEMICOLON { Block($startpos, e) }
  | e=expr NEWLINE+ { Block($startpos, e) }
  | e=expr EOF { Block($startpos, e) }
  ;

type_expr:
  | INT_TYPE      { TEInt }
  | FLOAT_TYPE    { TEFloat }
  | DOUBLE_TYPE   { TEDouble }
  | COMPLEX_TYPE  { TEComplex }
  | BOOLEAN_TYPE  { TEBoolean }
  | STRING_TYPE   { TEString }

expr:
  | i=INT                     { Integer($startpos, i) }
  | f=FLOAT                   { Float($startpos, f) }
  | d=DOUBLE                  { Double($startpos, d) }
  | i=IMAGINARY               { Imaginary($startpos, i) }
  | b=BOOLEAN                 { Boolean($startpos, b) }
  | s=STRING                  { String($startpos, s) }
  | var_type=type_expr; var_name=ID; EQUAL; e=expr { Let($startpos, var_type, var_name, e)}
  | CONST; var_type=type_expr; var_name=ID; EQUAL; e=expr { Const($startpos, var_type, var_name, e)}
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