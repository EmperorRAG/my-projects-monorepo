---
applyTo: '**/*.md'
---

# Markdown Front Matter Requirements

## Required Fields
- Provide YAML front matter at the top of each document with keys: `post_title`, `author1`, `post_slug`, `microsoft_alias`, `featured_image`, `categories`, `tags`, `ai_note`, `summary`, and `post_date`.
- Ensure `categories` values come from `/categories.txt` and use ISO-8601 format for `post_date`.

## Quality Tips
- Keep `summary` short and actionable; mention the audience or topic within the first sentence.
- Document whether AI assisted the authoring process via the `ai_note` field.
