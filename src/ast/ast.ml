(* Define binary operators *)
type bin_op =
  | BinOpAdd
  | BinOpSub
  | BinOpEq

(* Define expressions *)
type expr =
  | Integer of Lexing.position * int
  | BinaryOp of Lexing.position * bin_op * expr * expr