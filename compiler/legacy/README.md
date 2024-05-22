# basic-compiler
Testing out how to create a custom programming language through the creation of a compiler. Based on TypeScript.

# Trying to find a programming language name:
- GinTo, file format `.gt`. Related to Gin Tonic cause that's the best drink for coding during a hot summer.
- Djinn, file format `.dj`. Sounds like Gin, but with some mystics to it. Also, Djinns are known to have powers and can give people wishes.

# What is currently known to be missing
- can't set negative numbers
- print doesn't really print everything it is being passed
- compiling doesn't compile into a js file, it's only runtime
- no linting on `.dj` files

# Format, coding and other rules
- Very good error support in the console. When an error occurs, it should explicitly tell what is happening if it is known. If not, it needs to give an idea of where the error occured.
- Naming: no convention, we are now enforcing them to keep consistency between projects and teams
    - Classes: Pascal case only `class MyClass` --> it might need a rethink especially with long class names 
    - Constants: Upper snake case only `const MY_CONSTANT`
    - Variables: Camel case only `let myVariable` --> it might need a rethink especially with long variable names
    - Functions: Camel case only `function myFunction() {}` --> it might need a rethink especially with long function names
    - Private functions and variables: Camel case only preceeded by an underscore `let _myPrivateVariable` --> it might need a rethink especially with long variable/function names
- Variable types:
    JS doesn't really have type declaration. Is it really a problem? probably not, but having the choice to declare a float vs an int can make a whole lot of difference
    in a big project. That's why it would be great to have more choice in the type declaration.
    List of types needed:
    - number: general number type
        - float: positive and negative float number (no short, long, double needed as we don't do bit optimisation)
        - int: positive and negative integer number
        - img: imaginary number (in the realm of i) --> this one will be tricky because a float and int can be an imgm but not the opposite
        An int is a float and a float is an img, but the opposite is not true (technically it can but for now, we say it's not possible)
    - string: general string type
    - array: ordered list of variables
    - object: dictionary of keys and values as variables