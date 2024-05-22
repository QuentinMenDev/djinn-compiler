# Function parameters immutability

The idea being this is that, by default, a values being passed as argumrnts/parameters to a functions become copies of the pased value, in the scope of the function. Liek so, the user wouldn't have to think about a value being mutated by a function somewhere in the code, or to think of doing **deep copies**.

```C#
int myVar = 42

void add20(int value) {
  value += 20
  console.log(value)
}

add20(myVar)
// logs 62
console.log(myVar)
// logs 42

int add10(int value) {
  return value + 10
}

myVar = add10(myVar)
```

If a user really wants to mutate the passed values, the user would have to declare the parameters as `mut` to let the compiler know that the value is a direct pointer to the passed value.