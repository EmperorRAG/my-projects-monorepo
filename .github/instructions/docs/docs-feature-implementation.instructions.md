## applyTo: 'docs/**/features/**/implementation-plan.md'

# Feature Implementation Plan Instructions

## Do

-   Maintain the structure from the prompt: Goal, Requirements, Technical Considerations (with mandated sub-sections), Database Schema Design, API Design, Frontend Architecture, Security & Performance.
-   Consult `docs/documentation-structure-reference.md` to confirm the correct destination directory before saving the implementation plan.
-   Include the required Mermaid diagrams: system architecture with five layer subgraphs, plus state flow and ER diagrams when specified.
-   Document technology choices (e.g., frontend uses Next.js/TypeScript, backend with tRPC/better-auth) and justify integration points.
-   Outline deployment via Docker and discuss scalability strategies per the prompt.

## Don’t

-   Don’t write actual production code; pseudocode only if necessary for clarity.
-   Don’t skip diagram requirements; each requested visual must be present and syntactically valid Mermaid.
-   Don’t alter the CSS Modules + SCSS styling guidance; mirror the provided structure when describing frontend components.
-   Don’t leave requirements or subsections empty; provide actionable detail or note pending decisions.
