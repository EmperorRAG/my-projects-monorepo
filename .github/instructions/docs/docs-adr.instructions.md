## applyTo: 'docs/**/architecture/decisions/**/\*.md'

# Architectural Decision Record Instructions

## Do

-   Follow the ADR template: front matter (title/status/date/authors/tags), then Status, Context, Decision, Consequences (positive/negative), Alternatives, Implementation Notes, References.
-   Use the coded bullet format (e.g., POS-001, ALT-001) exactly as specified.
-   Save files as `adr-NNNN-[slug].md` and use `docs/documentation-structure-reference.md` to determine whether the decision belongs in the workspace-level or project-level `architecture/decisions/` directory before incrementing the 4-digit sequence.
-   Confirm required inputs (Decision Title, Context, Decision, Alternatives, Stakeholders) before drafting; ask for missing data.
-   State both positive and negative consequences with explicit trade-off notes.

## Don’t

-   Don’t proceed without validated inputs; request clarification when information is incomplete.
-   Don’t deviate from the coding scheme or heading order; consistency enables automated parsing.
-   Don’t leave alternatives undocumented or without rejection rationale.
-   Don’t forget to update supersedes/superseded_by fields when decisions evolve.
