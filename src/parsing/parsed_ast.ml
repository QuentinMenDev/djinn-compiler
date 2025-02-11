open Ast.Ast_types

type expr =
  | Integer     of tok_pos * int
  | BinaryOp    of tok_pos * bin_op * expr * expr
and statement = Block of tok_pos * expr
and program = Prog of tok_pos * statement list

let rec show_statement = function
  | Block (_, expr) -> Printf.sprintf "Stmt(%s)" (show_expr expr)
and show_expr = function
  | Integer (_, i) -> Printf.sprintf "Integer(%d)" i
  | BinaryOp (_, op, e1, e2) -> Printf.sprintf "BinaryOp(%s, %s, %s)" (show_binop op) (show_expr e1) (show_expr e2)
and show_binop = function
  | BinOpAdd -> "+"
  | BinOpSub -> "-"
  | BinOpMult -> "*"
  | BinOpDiv -> "/"
  | BinOpEq -> "="

let show_program (Prog (_, exprs)) = Printf.sprintf "Program(%s)" (String.concat ", " (List.map show_statement exprs))
