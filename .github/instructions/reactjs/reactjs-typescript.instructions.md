---
applyTo: '**/*.{tsx,ts}'
---

# React TypeScript Integration

## Type Safety
- Define props and state with interfaces or type aliases; prefer descriptive names over generics like `Props`.
- Use React's built-in helpers (`React.FC`, `ComponentProps`, `ElementRef`) where they clarify intent.
- Enable strict mode and address type errors promptly instead of suppressing them.

## Patterns
- Model component variants with union types and discriminated unions so render logic stays type-safe.
- Type event handlers and refs explicitly to avoid `any` creeping into shared code.
