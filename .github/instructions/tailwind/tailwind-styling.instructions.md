---
applyTo: 'apps/**/*.{tsx,jsx,css,pcss},libs/**/*.{tsx,jsx,css,pcss}'
---

# Tailwind Styling Guidance

## Design System Alignment

-   Standardize on the shared Tailwind color palette and spacing scale; extend the config in `tailwind.config.js` instead of scattering hard-coded values.
-   Prefer semantic utility classes (for example `bg-primary`, `text-muted`) via the theme extension to keep intent obvious.

## Responsive Layout

-   Use mobile-first utilities, layering breakpoints with `sm:`, `md:`, `lg:`, and beyond to match the design system.
-   Lean on Tailwind’s container queries or `@container` utilities when components must adapt to parent width instead of viewport width.

## Dark Mode and Accessibility

-   Enable and document the chosen dark-mode strategy (`class` vs `media`) and ensure components specify both light and dark variants.
-   Pair utility classes with semantic HTML and aria attributes so visual changes remain accessible.

## Composition Tips

-   Extract repeated class patterns into `@apply` directives or component-level helpers to avoid duplication.
-   Keep utility class lists readable by grouping spacing, layout, typography, and state modifiers together.
