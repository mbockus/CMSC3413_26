# JavaScript & TypeScript Fundamentals Guide

## Table of Contents
1. [JavaScript Fundamentals](#javascript-fundamentals)
2. [TypeScript Overview](#typescript-overview)
3. [Key Differences](#key-differences)
4. [When to Use Each](#when-to-use-each)
5. [Resources](#resources)

---

## JavaScript Fundamentals

### What is JavaScript?
JavaScript is a **high-level, interpreted programming language** that runs in web browsers. It's the language of the web, enabling interactive web pages.

### Core Concepts

#### 1. Variables
```javascript
// Old way (avoid)
var oldVariable = "Don't use var";

// Modern ways
let changeable = "Can be reassigned";
const constant = "Cannot be reassigned";
```

#### 2. Data Types
```javascript
// Primitive types
let string = "text";
let number = 42;
let boolean = true;
let nullValue = null;
let undefinedValue = undefined;
let symbol = Symbol("unique");
let bigInt = 9007199254740991n;

// Reference types
let array = [1, 2, 3];
let object = { name: "John", age: 30 };
let func = function() { return "Hello"; };
```

#### 3. Functions
```javascript
// Function declaration
function greet(name) {
  return "Hello, " + name;
}

// Function expression
const greetExpr = function(name) {
  return "Hello, " + name;
};

// Arrow function (ES6+)
const greetArrow = (name) => {
  return "Hello, " + name;
};

// Short arrow function
const greetShort = name => `Hello, ${name}`;
```

#### 4. Arrays & Methods
```javascript
const numbers = [1, 2, 3, 4, 5];

// Map - transform each element
const doubled = numbers.map(n => n * 2);  // [2, 4, 6, 8, 10]

// Filter - keep elements that match condition
const evens = numbers.filter(n => n % 2 === 0);  // [2, 4]

// Reduce - combine all elements into one value
const sum = numbers.reduce((acc, n) => acc + n, 0);  // 15

// ForEach - execute function for each element
numbers.forEach(n => console.log(n));
```

#### 5. Objects
```javascript
const person = {
  name: "John",
  age: 30,
  // Method
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

// Access properties
console.log(person.name);        // Dot notation
console.log(person['age']);      // Bracket notation

// Add properties
person.email = "john@example.com";

// Object destructuring
const { name, age } = person;
```

#### 6. Control Flow
```javascript
// If/Else
if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}

// Ternary operator
const status = age >= 18 ? "Adult" : "Minor";

// Switch
switch (day) {
  case "Monday":
    console.log("Start of week");
    break;
  case "Friday":
    console.log("Almost weekend");
    break;
  default:
    console.log("Regular day");
}
```

#### 7. Loops
```javascript
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// For...of (arrays)
for (const item of array) {
  console.log(item);
}

// For...in (objects)
for (const key in object) {
  console.log(key, object[key]);
}

// While
while (condition) {
  // code
}
```

#### 8. Async JavaScript
```javascript
// Promises
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Async/Await (cleaner syntax)
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

---

## TypeScript Overview

### What is TypeScript?
TypeScript is a **superset of JavaScript** that adds **optional static typing**. It was created by Microsoft and compiles to plain JavaScript.

### Why TypeScript?

✅ **Catch errors early** - At compile time, not runtime  
✅ **Better IDE support** - Autocomplete, intellisense, refactoring  
✅ **Self-documenting** - Types serve as inline documentation  
✅ **Easier refactoring** - Rename/move code with confidence  
✅ **Better for teams** - Types make code easier to understand  

### TypeScript Basics

#### 1. Type Annotations
```typescript
// Variables
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let values: number[] = [1, 2, 3];
let tuple: [string, number] = ["John", 30];

// Functions
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;
```

#### 2. Interfaces
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;        // Optional
  readonly createdAt: Date;  // Cannot be modified
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com",
  createdAt: new Date()
};
```

#### 3. Type Aliases
```typescript
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

function updateStatus(id: ID, status: Status): void {
  console.log(`${id}: ${status}`);
}
```

#### 4. Classes with Types
```typescript
class Animal {
  private name: string;
  protected age: number;
  public species: string;

  constructor(name: string, age: number, species: string) {
    this.name = name;
    this.age = age;
    this.species = species;
  }

  makeSound(): void {
    console.log("Some sound");
  }
}
```

#### 5. Generics
```typescript
// Generic function
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNum = getFirst([1, 2, 3]);      // number | undefined
const firstName = getFirst(["a", "b"]);    // string | undefined

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const response: ApiResponse<User> = {
  data: { id: 1, name: "John", email: "john@example.com", createdAt: new Date() },
  status: 200,
  message: "Success"
};
```

---

## Key Differences

| Feature | JavaScript | TypeScript |
|---------|-----------|------------|
| **Type Checking** | No (dynamic) | Yes (static) |
| **Compilation** | Interpreted directly | Compiles to JS |
| **Error Detection** | Runtime | Compile-time |
| **IDE Support** | Basic | Advanced (autocomplete, refactoring) |
| **Learning Curve** | Easier | Steeper |
| **File Extension** | `.js` | `.ts` |
| **Interfaces** | ❌ | ✅ |
| **Generics** | ❌ | ✅ |
| **Decorators** | ⚠️ (experimental) | ✅ |

---

## Comparison Examples

### Example 1: No Type Safety vs Type Safety

#### JavaScript ❌
```javascript
function calculateTotal(price, quantity) {
  return price * quantity;
}

calculateTotal(10, 5);      // ✅ 50
calculateTotal("10", "5");  // ⚠️ "1010" - String concatenation!
calculateTotal(10);         // ⚠️ NaN - undefined * 10
```

#### TypeScript ✅
```typescript
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

calculateTotal(10, 5);      // ✅ 50
calculateTotal("10", "5");  // ❌ Compile error
calculateTotal(10);         // ❌ Compile error
```

### Example 2: Object Shape

#### JavaScript ❌
```javascript
const user = {
  name: "John",
  age: 30
};

console.log(user.email);      // undefined (no error!)
user.age = "thirty";          // Works, but wrong type
```

#### TypeScript ✅
```typescript
interface User {
  name: string;
  age: number;
  email?: string;
}

const user: User = {
  name: "John",
  age: 30
};

console.log(user.email);      // OK (optional property)
user.age = "thirty";          // ❌ Compile error
```

---

## When to Use Each

### Use JavaScript When:
- 📄 Quick scripts or prototypes
- 🎯 Learning web development
- 📦 Small projects with minimal maintenance
- 🚀 No build step needed
- 👤 Solo developer on a simple project

### Use TypeScript When:
- 🏢 Large codebases
- 👥 Team projects
- 🔧 Long-term maintenance expected
- 📚 Complex business logic
- 🔄 Frequent refactoring
- 🎯 Better developer experience needed

---

## How TypeScript Works in Your Angular Project

```
1. You write code in .ts files
         ↓
2. TypeScript compiler (tsc) checks types
         ↓
3. If valid, compiles .ts → .js
         ↓
4. Browser runs the JavaScript
```

**Important:** Browsers don't understand TypeScript! They only run JavaScript. TypeScript is a development tool that helps you write better JavaScript.

---

## Resources

### JavaScript
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript.info](https://javascript.info/)
- [Eloquent JavaScript (free book)](https://eloquentjavascript.net/)

### TypeScript
- [Official TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play) - Try TypeScript in browser
- [TypeScript Deep Dive (free book)](https://basarat.gitbook.io/typescript/)

### Practice
- [freeCodeCamp](https://www.freecodecamp.org/) - JavaScript curriculum
- [TypeScript Exercises](https://typescript-exercises.github.io/)
- [Exercism](https://exercism.org/tracks/typescript) - TypeScript track

---

## Quick Reference Card

### Variable Declaration
```typescript
// JavaScript & TypeScript
let changeable = "value";
const constant = "value";

// TypeScript only
let typed: string = "value";
const numberArray: number[] = [1, 2, 3];
```

### Function Types
```typescript
// JavaScript & TypeScript
const add = (a, b) => a + b;

// TypeScript only
const add = (a: number, b: number): number => a + b;
```

### Type Checking
```typescript
// JavaScript
typeof value === "string"

// TypeScript
value: string  // Compile-time type
```

### Modern Features Available in Both
```typescript
// Destructuring
const { name, age } = person;
const [first, second] = array;

// Spread operator
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, newProp: "value" };

// Template literals
const message = `Hello, ${name}!`;

// Optional chaining
const email = user?.contact?.email;

// Nullish coalescing
const name = user.name ?? "Guest";
```

---

**Remember:** TypeScript is JavaScript with superpowers! Everything you learn in JavaScript applies to TypeScript, plus you get additional type safety features.
