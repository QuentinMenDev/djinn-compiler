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
let special = '-' | '_' | '/' | '*' | '@'
(* Types *)
let unsigned_int = digit+
let int = unsigned_int
let float = int '.' digit+
let number = int | float
let imaginary = number 'i'
let character = letter | special
let string = character+
let boolean = "true" | "false"
(* Identifiers *)
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
  | "double"        { DOUBLE_TYPE }  
  | "comp"          { COMPLEX_TYPE } (* ~ Complexe is imaginary + real. Needs a constructor ~ *)
  | "bool"          { BOOLEAN_TYPE }
  | "string"        { STRING_TYPE }
  | whitespace      { read lexbuf }
  | unsigned_int    { INT (int_of_string (Lexing.lexeme lexbuf)) }
  | float           { FLOAT (float_of_string (Lexing.lexeme lexbuf)) }
  | imaginary       { IMAGINARY (float_of_string (String.sub (Lexing.lexeme lexbuf) 0 ((String.length (Lexing.lexeme lexbuf)) - 1))) }
  | boolean         { BOOLEAN (Lexing.lexeme lexbuf) }
  | id              { ID (Lexing.lexeme lexbuf) }
  | "'"             { read_string_single (Buffer.create 16) lexbuf }
  | '"'             { read_string (Buffer.create 16) lexbuf }
  | newline         { NEWLINE }
  | _               { raise (SyntaxError ("Unexpected char: " ^ Lexing.lexeme lexbuf)) }
  | eof             { EOF }
and read_string buf = parse
  | '"' { STRING (Buffer.contents buf) }
  | [^ '"' '\\']+
    { Buffer.add_string buf (Lexing.lexeme lexbuf);
      read_string buf lexbuf
    }
  | _ { raise (SyntaxError ("Illegal string character: " ^ Lexing.lexeme lexbuf)) }
  | eof { raise (SyntaxError ("String is not terminated")) }
and read_string_single buf = parse
  | "'" { STRING (Buffer.contents buf) }
  | [^ '\'' '\\']+
    { Buffer.add_string buf (Lexing.lexeme lexbuf);
      read_string_single buf lexbuf
    }
  | _ { raise (SyntaxError ("Illegal string character: " ^ Lexing.lexeme lexbuf)) }
  | eof { raise (SyntaxError ("String is not terminated")) }
