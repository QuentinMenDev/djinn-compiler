let filename = Sys.argv.(1)

let () =
  let inBuffer = open_in filename in
  let lineBuffer = Lexing.from_channel inBuffer in
  try
    let ast = Parsing.Parser.program Parsing.Lexer.read lineBuffer in
    match ast with
      | Parsing.Parsed_ast.Prog (_, _) ->
          Printf.printf "Parsed AST: \n%s\n" (Parsing.Parsed_ast.show_program ast)
  with
    | Parsing.Lexer.SyntaxError msg ->
        Printf.fprintf stderr "Lexer Error: %s\n%!" msg
    | Parsing.Parser.Error ->
        Printf.fprintf stderr "At offset %d: syntax error.\n%!" (Lexing.lexeme_start lineBuffer)