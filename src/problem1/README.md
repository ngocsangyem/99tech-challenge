# Problem 1: Three Ways to Sum to N

A comprehensive TypeScript implementation of three unique algorithms to calculate the sum of integers from 1 to n, with robust error handling, performance optimization, and extensive testing.

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Implementations](#implementations)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Performance Analysis](#performance-analysis)
- [Testing](#testing)
- [Contributing](#contributing)

## 🎯 Overview

This project provides three distinct algorithmic approaches to solve the classic "sum to n" problem:

1. **Iterative Approach** - Traditional loop-based solution
2. **Mathematical Formula** - Constant-time arithmetic solution  
3. **Recursive Approach** - Functional programming solution

Each implementation includes comprehensive error handling, input validation, and performance monitoring capabilities.

## 📝 Problem Statement

**Input**: `n` - any integer  
**Output**: Sum of integers from 1 to n (i.e., `1 + 2 + 3 + ... + n`)

**Example**: `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`

**Constraints**: 
- Input must produce a result less than `Number.MAX_SAFE_INTEGER`
- Input must be a valid integer
- Negative inputs return 0

## 🚀 Implementations

### Implementation A: Iterative Approach

```typescript
const sum_to_n_a = (n: number): number => {
  // Uses a simple for loop to accumulate the sum
}
```

**Characteristics:**
- **Time Complexity**: O(n) - Linear time proportional to input
- **Space Complexity**: O(1) - Constant space usage
- **Best for**: Educational purposes, moderate input sizes, readability

### Implementation B: Mathematical Formula

```typescript
const sum_to_n_b = (n: number): number => {
  // Uses the formula: n * (n + 1) / 2
}
```

**Characteristics:**
- **Time Complexity**: O(1) - Constant time regardless of input
- **Space Complexity**: O(1) - Constant space usage
- **Best for**: Performance-critical applications, large inputs

### Implementation C: Recursive Approach

```typescript
const sum_to_n_c = (n: number): number => {
  // Uses recursion: n + sum_to_n_c(n-1)
}
```

**Characteristics:**
- **Time Complexity**: O(n) - Linear time due to recursive calls
- **Space Complexity**: O(n) - Linear space due to call stack
- **Best for**: Functional programming, educational recursion examples
- **Limitation**: Stack overflow risk for large inputs (>10,000)

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd src/problem1

# Install dependencies
npm install

# Build the project
npm run build
```

## 💻 Usage

### Basic Usage

```typescript
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './src/index';

// Using iterative approach
console.log(sum_to_n_a(5)); // Output: 15

// Using mathematical formula (fastest)
console.log(sum_to_n_b(100)); // Output: 5050

// Using recursive approach (small inputs only)
console.log(sum_to_n_c(10)); // Output: 55
```

### Error Handling

```typescript
import { sum_to_n_a, SumCalculationError } from './src/index';

try {
  sum_to_n_a(3.14); // Non-integer input
} catch (error) {
  if (error instanceof SumCalculationError) {
    console.log(`Error: ${error.message}`);
    console.log(`Error Type: ${error.errorType}`);
  }
}
```

## 📚 API Reference

### Core Functions

#### `sum_to_n_a(n: number): number`
Iterative implementation using a for loop.

#### `sum_to_n_b(n: number): number`  
Mathematical formula implementation using n*(n+1)/2.

#### `sum_to_n_c(n: number): number`
Recursive implementation with stack overflow protection.

#### `sumWithMetadata(n: number, method: SumMethod, options?: SumFunctionOptions): SumResult`
Enhanced function returning detailed results with performance metrics.

#### `compareAllMethods(n: number, options?: SumFunctionOptions): SumResult[]`
Compares all three implementations and returns their results.

### Utility Functions

#### `validateSumInput(input: unknown, options?: SumFunctionOptions): ValidationResult`
Validates input and returns detailed validation results.

#### `hasOverflowRisk(n: number): boolean`
Checks if calculation would cause integer overflow.

#### `hasStackOverflowRisk(n: number): boolean`  
Checks if recursive calculation would cause stack overflow.

### Types and Interfaces

```typescript
interface SumResult {
  value: number;
  input: number;
  method: SumMethod;
  executionTime?: number;
  validated: boolean;
}

enum SumMethod {
  ITERATIVE = 'iterative',
  FORMULA = 'formula',
  RECURSIVE = 'recursive'
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Categories

1. **Functional Tests** - Verify correctness of calculations
2. **Edge Case Tests** - Handle boundary conditions and invalid inputs

## 🔧 Development

### Scripts

```bash
npm run build          # Compile TypeScript
npm run test           # Run test suite
npm run test:coverage  # Generate coverage report
npm run lint           # Run ESLint
npm run lint:fix       # Fix linting issues
npm run clean          # Clean build artifacts
```

### Code Quality

- **TypeScript**: Strict mode with comprehensive type checking
- **ESLint**: Enforced coding standards and best practices
- **Jest**: Comprehensive testing with coverage requirements
- **Documentation**: JSDoc comments for all public APIs
