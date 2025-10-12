---
applyTo: 'apps/**/*.{tsx,jsx,ts,js},libs/**/*.{tsx,jsx,ts,js}'
---

# React State Management

## Local State

-   Use `useState` for simple component-level data; reach for `useReducer` when transitions become complex.
-   Share state across trees with `useContext` or dedicated providers when it materially improves ergonomics.

## Server State

-   Leverage libraries like React Query or SWR for data fetching, caching, and mutation flows when the app frequently interacts with APIs.
-   Normalize server data and implement optimistic updates carefully, rolling back when the server rejects a mutation.
