open Base

type tok_pos = Lexing.position

let string_of_tok_pos tok_pos =
  Fmt.str "Line:%d Position:%d" tok_pos.Lexing.pos_lnum
    (tok_pos.Lexing.pos_cnum - tok_pos.Lexing.pos_bol + 1)

module type ID = sig
  type t

  val of_string : string -> t
  val to_string : t -> string
  val ( = ) : t -> t -> bool
end

module String_id = struct
  type t = string

  let of_string x = x
  let to_string x = x
  let ( = ) = String.( = )
end

module Var_name : ID = String_id

type type_expr =
| TEInt
| TEFloat

type bin_op =
  | BinOpAdd
  | BinOpSub
  | BinOpMult
  | BinOpDiv
  | BinOpEq

exception NotDesugaredGenericType of string
