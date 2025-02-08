%{
  open Ast
%}

%token <int> INT
// Mathematical operators
%token PLUS
%token MINUS
%token EQUAL
// Misc
%token EOF

%right EQUAL
%left PLUS MINUS

%start program
%type <bool> program
%type <expr> expr
%%

program:
  | expr EOF { true }
  ;

expr:
  | i=INT {Integer($startpos, i)}
  | e1=expr op=bin_op e2=expr {BinaryOp($startpos, op, e1, e2)}
  ;

%inline bin_op:
  | PLUS {BinOpAdd}
  | MINUS {BinOpSub}
  | EQUAL {BinOpEq}
  ;
