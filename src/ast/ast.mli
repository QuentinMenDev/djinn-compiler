type bin_op =
  | BinOpAdd
  | BinOpSub
  | BinOpEq

type expr =
  | Integer of Lexing.position * int
  | BinaryOp of Lexing.position * bin_op * expr * expr