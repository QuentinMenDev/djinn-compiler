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
let number = int | float
let imaginary = number 'i'
let id = letter (letter | digit | '_')*
(* space *)
let whitespace = [' ' '\t']
let newline = '\n' | '\r' | "\r\n"

(* Lexer rules *)

rule read =
  parse
  | ';'             { SEMICOLON }
  | '+'             { PLUS }
  | '-'             { MINUS }
  | '*'             { MULT }
  | '/'             { DIV }
  | '='             { EQUAL }
  | "const"         { CONST }
  | "int"           { INT_TYPE }
  | "float"         { FLOAT_TYPE }
  | whitespace      { read lexbuf }
  | unsigned_int    { INT (int_of_string (Lexing.lexeme lexbuf)) }
  | float           { FLOAT (float_of_string (Lexing.lexeme lexbuf)) }
  | imaginary       { IMAGINARY (float_of_string (String.sub (Lexing.lexeme lexbuf) 0 ((String.length (Lexing.lexeme lexbuf)) - 1))) }
  | id              { ID (Lexing.lexeme lexbuf) }
  | newline         { NEWLINE }
  | _               { raise (SyntaxError ("Unexpected char: " ^ Lexing.lexeme lexbuf)) }
  | eof             { EOF }
