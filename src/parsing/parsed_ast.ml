open Ast.Ast_types

type expr =
  | Integer     of tok_pos * int
  | Float       of tok_pos * float
  | Imaginary   of tok_pos * float
  | BinaryOp    of tok_pos * bin_op * expr * expr
  | Let         of tok_pos * type_expr * string * expr
  | Const         of tok_pos * type_expr * string * expr
and statement = Block of tok_pos * expr
and program = Prog of tok_pos * statement list

let rec show_statement = function
  | Block (_, expr) -> Printf.sprintf "Stmt(%s)" (show_expr expr)
and show_expr = function
  | Integer (_, i) -> Printf.sprintf "Integer(%d)" i
  | Float (_, f) -> Printf.sprintf "Float(%f)" f
  | Imaginary (_, num) -> Printf.sprintf "Imaginary(%f)" num
  | BinaryOp (_, op, e1, e2) -> Printf.sprintf "BinaryOp(%s, %s, %s)" (show_binop op) (show_expr e1) (show_expr e2)
  | Let (_, var_type, var_name, expr) -> Printf.sprintf "Let(%s, %s, %s)" (show_type_expr var_type) var_name (show_expr expr)
  | Const (_, var_type, var_name, expr) -> Printf.sprintf "Const(%s, %s, %s)" (show_type_expr var_type) var_name (show_expr expr)
and show_type_expr = function
  | TEInt -> "Int"
  | TEFloat -> "Float"
  | TEComplex -> "Comp"
and show_binop = function
  | BinOpAdd -> "+"
  | BinOpSub -> "-"
  | BinOpMult -> "*"
  | BinOpDiv -> "/"
  | BinOpEq -> "="

let show_program (Prog (_, exprs)) = Printf.sprintf "Program(%s)" (String.concat ", " (List.map show_statement exprs))
