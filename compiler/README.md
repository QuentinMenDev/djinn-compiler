# Djinn (*.dj)

Welcome to Djinn, a superset of TypeScript that allows an easier formatting, stronger types, and no null values!

## Disclaimer

This is a hobby project (as for now) and should in no point be used in a real project. It is designed as an exercise to get better knowledge of coding.

## Language rules

Work In Progress

##### ! Try to use bit operation i nthe compiler part.
truncate: `a>>0`

##### ! (difficult) Have a force garbage collection.
Even thoug hit is not possible to force a variable to be garbage collected, it is possible to set it so it has a higher priority in the garbage collection process.
The way of doing it is to set the value of the variable as `null`, and al lthe references to the said variable also need to be set to null.
For development purpsoes: cf `FinalizationRegistry` to be notified when a variable is garbage collected 


### Variables declaration

#### Variability

When declaring a variable, its value is mutable and type immutable by default. This means that its value can be changed at runtime, anytime, but the type of data being saved never changes. **The type of a variable can never be changed once it is set!**
A variable is declared using a type declaration expression followed by a name attribute. It defines the type of the data being stored, as well as a name to identify it more easily (for humans).
A variable is set a value using an equal followed by the value to be saved.

As a writing standards, variables are written in **camelCase** pattern.

**[immutability documentation](variable-immutability.md)**

```c#
type_declarator name = value
```

If we want to make the variable non mutable, we need to add a const declarator before declaring the variable type.

As a writing standards, constant are written in **CAPITAL** letters.

> **Discussion:**
> Should it be needed to declare constants? It seems a bit over the top as we are transpiling into
> JavaScript which doesn't possess immutability. Also, C# doesn't have constants as it doesn't really
> make sense.
> **Except**, of course, if **mutability** is **allowed** in functions.
> I would rather go for immutability of a value in a function, which means that whatever is passed in a
> function, would be duplicated and the original value would never be changed. A **indicator** could
> be used if the user really wants to mutate the valeu (liek in Rust)

<i>**In discussion, not to implement yet**</i>
```c#
const type_declarator NAME = value
```

#### Types

Each variable has a type that correspond to the kind of data it stores. A variable type can never change once it is set.

##### Dynamic

This type is used if the type of the varibale is unknown and can be a mix of multiple other types. Once the value is set at runtime, its type can't be changed.
(Is this really needed? Maybe a it can be possible to have a cutom type declaration)

```c#
let variable
const let CONSTANT
```

##### Number

```c#
int integerVar // -1, 1, -2, 2, -3, 3, ...
const int INTEGER_VAR
float floatVar // 1.5, 14.42, -42.1, ...
const float FLOAT_VAR
comp imaginaryVar // i, 10i, 15i+5, ... (is this possible?)
const comp IMAGINARY_VAR
```

**Disclaimer**: an int is a float, a float is an img (for type casting). It is impossible to do the opposite except in specific cases (math rules): 0i+1 = 1.0 = 1

##### Character

```c#
char charaterVar // "a", 1 character --> is this usefull?
const char CHARACTER_VAR
str stringVar // "list of characters" (str or string?)
const str STRING_VAR
```

##### Boolean

```c#
bool booleanVar // true/false
const bool VOOELAN_VAR
```

#### Complex types
##### Enumerator

Enumerators are constant and can never be changed.

```c#
enum enumVariable // exactly like what TypeScript do
```

#### Type casting

Allows to change a type into another type when possible

(f) --> type cast from int to float
(c) --> type cast from int or float to comp

```c#
float myFloat = 1.0 + (f)2 // 3.0
comp myComplex = 2i + (c)3 // 2i +3
```

#### Comments

##### Single line comment

```c#
// This is a single line comment
```

##### Multi line comment

```c#
/*
This is a
multiline
comment
*/
```

##### Documentation comment

```c#
///
This is a documentation comment.
It follows markdown and is understood by intellisense
///

///
/// It can also be written
/// that way to satisfy
/// a different layout
///
```

#### Functions

##### Declaration

```c#
type_declarator functionName() {
  // code here
}
```


# testing area
```c#
int integer = 0
str myString = "hello world"
float myFloat = 1.2

int addInt (int x, int y) => x + y

str complexFunction(int x, str data) {
  log(data)
  log(x)
  return data if x > 5 else "nope"
}

```
