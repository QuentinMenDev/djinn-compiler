{
  open Lexing
  open Parser

  exception SyntaxError of string

  let next_line lexbuf =
    let pos = lexbuf.lex_curr_p in
    lexbuf.lex_curr_p <-
      { pos with pos_bol = lexbuf.lex_curr_pos;
                pos_lnum = pos.pos_lnum + 1
      }
}

(* Fundamentals *)
let digit = ['0'-'9']
let letter = ['a'-'z' 'A'-'Z']
(* Types *)
let int = '-'? digit+
let float = int '.' digit+
(* space *)
let whitespace = [' ' '\t']
let newline = '\n' | '\r' | "\r\n"

(* Lexer rules *)

rule read =
  parse
  | whitespace  { read lexbuf }
  | newline     { next_line lexbuf; read lexbuf }
  | int         { INT (int_of_string (Lexing.lexeme lexbuf)) }
  | '+'         { PLUS }
  | '-'         { MINUS }
  | '='         { EQUAL }
  | _           { raise (SyntaxError ("Unexpected char: " ^ Lexing.lexeme lexbuf)) }
  | eof         { EOF }
