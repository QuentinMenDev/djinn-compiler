open Ast.Ast_types

type expr =
  | Integer of tok_pos * int
  | BinaryOp of tok_pos * bin_op * expr * expr
  | UnaryMinus of tok_pos * expr

type program = Prog of tok_pos * expr

let rec show_expr = function
  | Integer (_, i) -> Printf.sprintf "Integer(%d)" i
  | BinaryOp (_, op, e1, e2) -> Printf.sprintf "BinaryOp(%s, %s, %s)" (show_binop op) (show_expr e1) (show_expr e2)
  | UnaryMinus (_, e) -> Printf.sprintf "UnaryMinus(%s)" (show_expr e)
and show_binop = function
  | BinOpAdd -> "+"
  | BinOpSub -> "-"
  | BinOpMult -> "*"
  | BinOpDiv -> "/"
  | BinOpEq -> "="

let show_program (Prog (_, expr)) = Printf.sprintf "Program(%s)" (show_expr expr)
