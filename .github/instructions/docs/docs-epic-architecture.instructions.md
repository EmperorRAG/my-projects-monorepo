## applyTo: 'docs/**/epics/**/arch.md'

# Epic Architecture Specification Instructions

## Do

-   Follow the six-section structure from the prompt: Overview, System Diagram, Features & Enablers, Technology Stack, Technical Value, T-Shirt Size.
-   Use Markdown and consult `docs/documentation-structure-reference.md` to identify the correct target directory before saving.
-   Produce a Mermaid diagram with layered subgraphs (User, Application, Service, Data, Infrastructure) and show synchronous plus asynchronous flows.
-   Keep references to required technologies (Next.js, TypeScript, App Router, better-auth, Docker, Nx) when listing stack components.
-   When describing value or estimates, give concise justifications as requested.

## Don’t

-   Don’t include executable code snippets; only pseudocode if necessary.
-   Don’t omit layers or deployment context from the diagram; infrastructure (Docker) must be visible.
-   Don’t change the prescribed ordering or headings unless stakeholders request an update to the prompt.
-   Don’t mix additional sections that diverge from the prompt without prior approval.
