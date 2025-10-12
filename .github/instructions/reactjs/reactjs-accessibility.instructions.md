---
applyTo: 'apps/**/*.{tsx,jsx,ts,js},libs/**/*.{tsx,jsx,ts,js}'
---

# React Accessibility Practices

## Semantics

-   Use semantic HTML elements first, adding ARIA roles only when semantics are insufficient.
-   Ensure all interactive elements are keyboard accessible and provide visible focus states.

## Testing

-   Validate accessibility with automated tooling (for example axe) and manual screen-reader checks.
-   Provide alt text for images, descriptive button labels, and announce dynamic updates through ARIA live regions when necessary.
