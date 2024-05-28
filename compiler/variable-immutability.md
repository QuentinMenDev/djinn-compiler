# Function parameters immutability

The idea being this is that, by default, a values being passed as argumrnts/parameters to a functions become copies of the pased value, in the scope of the function. Liek so, the user wouldn't have to think about a value being mutated by a function somewhere in the code, or to think of doing **deep copies**.

```cs
int myVar = 42

void add20(int value) {
  value += 20
  log(value)
}

add20(myVar) // logs 62
log(myVar) // logs 42

int add10(int value) {
  return value + 10
}

myVar = add10(myVar)
```

#### Forced mutability

**Disclaimer:** This is not recommended to use this as it can be very difficult to debug and goes against the idea of strict immutability and localization of data.

If a user really wants to mutate the passed values, the user would have to declare the parameters as `*` (mutable) to let the compiler know that the value is a direct pointer to the passed value.

```cs
int myVar = 42

void add20(int *value) {
  value += 20
}

add20(myVar)
log(myVar) // logs 62
```
