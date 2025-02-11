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
let unsigned_int = digit+
let int = unsigned_int
let float = int '.' digit+
(* space *)
let whitespace = [' ' '\t']
let newline = '\n' | '\r' | "\r\n"

(* Lexer rules *)

rule read =
  parse
  | ';'           { SEMICOLON }
  | '+'           { PLUS }
  | '-'           { MINUS }
  | '*'           { MULT }
  | '/'           { DIV }
  | '='           { EQUAL }
  | whitespace    { read lexbuf }
  | unsigned_int  { INT (int_of_string (Lexing.lexeme lexbuf)) }
  | newline       { next_line lexbuf; read lexbuf }
  | _             { raise (SyntaxError ("Unexpected char: " ^ Lexing.lexeme lexbuf)) }
  | eof           { EOF }
