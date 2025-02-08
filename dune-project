(lang dune 3.15)
(name djinn)
(using menhir 2.0)

(generate_opam_files true)

(source
 (github QuentinMenDev/djinn-compiler))

(authors "Quentin Mennecart")

(maintainers "Quentin Mennecart")

(license LICENSE)

(documentation https://url/to/documentation)

(package
 (name djinn)
 (allow_empty)
 (synopsis "A scientific coding language for the world")
 (description "Djinn is aiming to becoming the reference in the world of science for coding. It is a language that is easy to learn and to use, and that is powerful enough to be used in the most demanding scientific applications.")
 (depends ocaml dune)
 (tags
  (topics "to describe" your project)))

; See the complete stanza docs at https://dune.readthedocs.io/en/stable/dune-files.html#dune-project
