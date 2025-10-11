# Learning Log Workflow

This directory stores durable problem/solution notes grouped by technology.

## How to Add a Learning

1. Run the helper script from the repository root:

   ```sh
   bash tools/scripts/add-learning.sh \
     --tech nginx \
     --title "Proxy validation fails without mock hosts" \
     --if "The validation container runs nginx -t" \
     --when "Upstream names cannot be resolved" \
     --then "nginx -t exits with host not found" \
     --solution "Inject --add-host entries in the validation script"
   ```

2. The script appends an entry to `docs/learnings/nginx.md` (it creates the file if needed).
3. Each entry follows the format:

   ```markdown
   ## <Concise Title>
   - **If:** <initial condition>
   - **When:** <trigger>
   - **Then:** <observed failure>
   - **Solution:** <fix applied>
   ```

4. Reference the entry in your change summary so reviewers know documentation was updated.

## File Naming

Use the technology or domain you touched (kebab-case recommended). Examples:

- `docs/learnings/nginx.md`
- `docs/learnings/nx.md`
- `docs/learnings/playwright.md`

Keeping a single file per technology makes it easy to review historical context.
