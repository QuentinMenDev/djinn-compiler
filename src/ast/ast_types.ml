type tok_pos = Lexing.position

let string_of_tok_pos tok_pos =
  Fmt.str "Line:%d Position:%d" tok_pos.Lexing.pos_lnum
    (tok_pos.Lexing.pos_cnum - tok_pos.Lexing.pos_bol + 1)

type bin_op =
  | BinOpAdd
  | BinOpSub
  | BinOpEq

exception NotDesugaredGenericType of string
