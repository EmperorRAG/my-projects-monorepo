---
applyTo: 'apps/**/*.{tsx,jsx,ts,js},libs/**/*.{tsx,jsx,ts,js}'
---

# React Security Practices

## Rendering Safety

-   Sanitize and escape user-generated input before rendering; avoid `dangerouslySetInnerHTML` unless the content is trusted and sanitized upstream.
-   Use HTTPS for all API calls and avoid storing sensitive data in `localStorage` or `sessionStorage` when possible.

## Authorization

-   Gate protected routes and components with authentication and authorization checks.
-   Apply Content Security Policy (CSP) headers and other platform controls when deploying.
