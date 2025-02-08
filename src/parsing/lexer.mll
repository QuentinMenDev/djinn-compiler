(*** helper functions exposed to OCaml ***)
{
    open Lexing
    open Parser

    exception SyntaxError of string

    let next_line lexbuf =
        let pos = lexbuf.lex_curr_p in
            lexbuf.lex_curr_p <-
                {
                    pos with
                        pos_bol = lexbuf.lex_curr_pos;
                        pos_lnum = pos.pos_lnum + 1
                }
}

(*** helper regexes ***)
let digit = ['0'-'9']
let letter = ['a'-'z' 'A'-'Z']

let int = "-"? digit+
let float = "-"? digit+ "." digit+

let id = letter (letter | digit | "_")*
let whitespace = [' ' '\t']
let newline = '\r' | '\n' | "\r\n"

(*** lexer rules ***)
rule read_token = parse
    | "(" { LPAREN }
    | ")" { RPAREN }
    | "{" { LBRACE }
    | "}" { RBRACE }
    | "[" { LBRACKET }
    | "]" { RBRACKET }
    | "," { COMMA }
    | ":" { COLON }
    | ";" { SEMICOLON }
    | "." { DOT }
    (* mathematical operator *)
    | "=" { EQUAL }
    | "+" { PLUS }
    | "-" { MINUS }
    | "*" { TIMES }
    | "/" { DIVIDE }
    | "^" { EXP }
    (* logical operator *)
    | "==" { EQ }
    | "!=" { NEQ }
    | "<" { LT }
    | "<=" { LTE }
    | ">" { GT }
    | ">=" { GTE }
    | "&&" { AND }
    | "||" { OR }
    | "!" { NOT }
    (* comments *)
    | "//" { single_line_comment  lexbuf }
    | "/*" { multi_line_comment lexbuf }
    (* identifiers *)
    | int { INT (int_of_string (Lexing.lexeme lexbuf)) }
    | float { FLOAT (float_of_string (Lexing.lexeme lexbuf)) }
    | id { ID (Lexing.lexeme lexbuf) }
    (* strings *)
    (*
        The buffer size is not final. Buffer dynamically grows so the set size if the initial size of the buffer.
        A size of 16 represents a good balance between memory usage and performance as it is large enough to store most strings (16 characters).
        If performance is a concern if strings are longer, the buffer size can be increased to a larger value.
    *)
    | '"' { read_string (Buffer.create 16) lexbuf }
    (* whitespace *)
    | newline { next_line lexbuf; read_token lexbuf }
    | whitespace { read_token lexbuf }
    | eof { EOF }
    | _ { raise (SyntaxError "Invalid token") }

and read_single_line_comment = parse
    | newline { next_line lexbuf; read_token lexbuf }
    | eof { EOF }
    | _ { read_single_line_comment lexbuf }

and read_multi_line_comment = parse
    | "*/" { read_token lexbuf }
    | newline { next_line lexbuf; read_multi_line_comment lexbuf }
    | eof { raise (SyntaxError "Unterminated multi-line comment") }
    | _ { read_multi_line_comment lexbuf }

and read_string buf = parse
    | '"' { STRING (Buffer.contents buf) }
    | '\\' 'n' { Buffer.add_char buf '\n'; read_string buf lexbuf }
    | '\\' 't' { Buffer.add_char buf '\t'; read_string buf lexbuf }
    | '\\' '"' { Buffer.add_char buf '"'; read_string buf lexbuf }
    | '\\' '\\' { Buffer.add_char buf '\\'; read_string buf lexbuf }
    | '\\' _ { raise (SyntaxError "Invalid escape sequence") }
    | [^ '"' '\\']+
        {
            Buffer.add_string buf (Lexing.lexeme lexbuf);
            read_string buf lexbuf
        }
    | _ { raise (SyntaxError ("Unknown string: " ^ Lexing.lexeme lexbuf)) }
    | eof { raise (SyntaxError "Unterminated string") }
