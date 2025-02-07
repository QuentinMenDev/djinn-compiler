(lang dune 3.15)

(name djinn)

(generate_opam_files true)

(source
 (github QuentinMenDev/djinn-compiler))

(authors "Quentin Mennecart")

(maintainers "Quentin Mennecart")

(license LICENSE)

(documentation https://url/to/documentation)

(package
 (name djinn)
 (synopsis "A short synopsis")
 (description "A longer description")
 (depends ocaml dune)
 (tags
  (topics "to describe" your project)))

; See the complete stanza docs at https://dune.readthedocs.io/en/stable/dune-files.html#dune-project
