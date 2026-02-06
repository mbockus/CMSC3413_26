/* ============================================================================
   TYPESCRIPT vs JAVASCRIPT EXAMPLES
   
   This file demonstrates how TypeScript extends JavaScript with type safety.
   TypeScript compiles to JavaScript - browsers can only run JS!
   ============================================================================ */

// ============================================================================
// 1. BASIC TYPE ANNOTATIONS
// ============================================================================

// JavaScript - No type checking
function addJS(a, b) {
  return a + b;
}
// addJS(5, "10") would return "510" - unexpected string concatenation!

// TypeScript - Type safety
function addTS(a: number, b: number): number {
  return a + b;
}
// addTS(5, "10") would give a COMPILE ERROR - caught before runtime!


// ============================================================================
// 2. INTERFACES - Define object shapes
// ============================================================================

interface User {
  id: number;
  name: string;
  email: string;
  age?: number;        // Optional property (? makes it optional)
  isActive: boolean;
}

// TypeScript ensures the object matches the interface
const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  isActive: true
  // age is optional, so we can omit it
};

// This would cause a compile error - missing required properties
// const badUser: User = {
//   name: "Jane"  // ERROR: missing id, email, isActive
// };


// ============================================================================
// 3. TYPE ALIASES - Create custom types
// ============================================================================

type Status = "pending" | "approved" | "rejected";  // Union type - only these values allowed
type ID = string | number;  // Can be string OR number

function updateStatus(orderId: ID, status: Status): void {
  console.log(`Order ${orderId} is now ${status}`);
}

updateStatus(123, "approved");        // ✅ Valid
updateStatus("ABC-456", "pending");   // ✅ Valid
// updateStatus(123, "cancelled");    // ❌ ERROR: "cancelled" not in Status type


// ============================================================================
// 4. CLASSES WITH TYPE ANNOTATIONS
// ============================================================================

class Product {
  // Properties with types
  private id: number;
  public name: string;
  protected price: number;
  readonly category: string;  // Cannot be changed after initialization

  // Constructor with typed parameters
  constructor(id: number, name: string, price: number, category: string) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
  }

  // Method with return type
  getDetails(): string {
    return `${this.name} - $${this.price}`;
  }

  // Method with typed parameters
  applyDiscount(percentage: number): void {
    if (percentage > 0 && percentage <= 100) {
      this.price = this.price * (1 - percentage / 100);
    }
  }
}

const laptop = new Product(1, "MacBook Pro", 1999, "Electronics");
laptop.applyDiscount(10);  // Price now $1799.10
console.log(laptop.getDetails());


// ============================================================================
// 5. GENERICS - Reusable type-safe code
// ============================================================================

// Generic function - works with any type while maintaining type safety
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const numbers = [1, 2, 3];
const firstNumber = getFirstElement(numbers);  // Type: number | undefined

const names = ["Alice", "Bob", "Charlie"];
const firstName = getFirstElement(names);      // Type: string | undefined

// Generic class
class Box<T> {
  private contents: T;

  constructor(value: T) {
    this.contents = value;
  }

  getValue(): T {
    return this.contents;
  }
}

const numberBox = new Box<number>(42);
const stringBox = new Box<string>("Hello");


// ============================================================================
// 6. ENUMS - Named constants
// ============================================================================

enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED"
}

interface Order {
  id: number;
  status: OrderStatus;
  items: string[];
}

const order: Order = {
  id: 1001,
  status: OrderStatus.Processing,
  items: ["Laptop", "Mouse"]
};

// Type-safe comparisons
if (order.status === OrderStatus.Processing) {
  console.log("Order is being processed...");
}


// ============================================================================
// 7. TYPE ASSERTIONS - Tell TypeScript the type you know
// ============================================================================

// When you know more about the type than TypeScript does
const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;

// Alternative syntax
const myInput = <HTMLInputElement>document.getElementById("myInput");


// ============================================================================
// 8. UNION TYPES & TYPE GUARDS
// ============================================================================

type Response = string | number | { error: string };

function handleResponse(response: Response): void {
  // Type guard using typeof
  if (typeof response === "string") {
    console.log("Text response:", response);
  } else if (typeof response === "number") {
    console.log("Numeric response:", response);
  } else {
    console.log("Error:", response.error);
  }
}


// ============================================================================
// 9. ASYNC/AWAIT WITH TYPES
// ============================================================================

interface ApiResponse {
  data: User[];
  total: number;
}

async function fetchUsers(): Promise<ApiResponse> {
  const response = await fetch("https://api.example.com/users");
  const data: ApiResponse = await response.json();
  return data;
}

// Usage
async function displayUsers(): Promise<void> {
  try {
    const result = await fetchUsers();
    console.log(`Found ${result.total} users`);
    result.data.forEach(user => console.log(user.name));
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}


// ============================================================================
// 10. UTILITY TYPES - Built-in TypeScript helpers
// ============================================================================

interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

// Partial - All properties optional
type PartialTodo = Partial<Todo>;
// { title?: string; description?: string; completed?: boolean; createdAt?: Date; }

// Required - All properties required
type RequiredTodo = Required<PartialTodo>;

// Readonly - All properties readonly
type ReadonlyTodo = Readonly<Todo>;

// Pick - Select specific properties
type TodoPreview = Pick<Todo, "title" | "completed">;
// { title: string; completed: boolean; }

// Omit - Exclude specific properties
type TodoInfo = Omit<Todo, "createdAt">;
// { title: string; description: string; completed: boolean; }


/* ============================================================================
   KEY TAKEAWAYS
   ============================================================================
   
   1. TypeScript is JavaScript + Types
      - All valid JavaScript is valid TypeScript
      - TypeScript adds optional static typing
      
   2. Compile-Time vs Runtime
      - TypeScript catches errors at COMPILE TIME (before running)
      - JavaScript catches errors at RUNTIME (when code runs)
      
   3. Better Developer Experience
      - Auto-completion in IDE
      - Better refactoring
      - Self-documenting code
      - Fewer runtime errors
      
   4. TypeScript Compiles to JavaScript
      - Browsers don't understand TypeScript
      - TypeScript compiler (tsc) converts .ts → .js
      - In Angular, this happens automatically during build
      
   5. Gradual Adoption
      - Can use TypeScript features gradually
      - Can mix .js and .ts files
      - Can add types incrementally (use 'any' type initially)
      
   ============================================================================ */

export {}; // Makes this a module
