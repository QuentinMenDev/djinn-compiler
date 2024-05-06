# Djinn

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

```
// Dynamic types variables
let variable
const let CONSTANT // constant attribute (should the name format define the variability of a variable?)

// Strongly typed variables
// *** numbers ***
int integerVar // -1, 1, -2, 2, -3, 3, ...
float floatVar // 1.5, 14.42, -42.1, ...
img imaginaryVar // i, 10i, 15i+5, ... (is this possible?) --> use cpl instead of img for complex?
--> an int is a float, a float is an img (for type casting). It is impossible to do the opposite except in specific cases (math rules): 0i+1 = 1.0 = 1

// *** characters ***
char charaterVariable // "a", 1 character --> is this usefull?
str stringVariable // "list of characters"

// *** boolean ***
bool booleanVar // true/false

// *** enumerator ***
enum enumVariable // exactly like what TypeScript do

```
