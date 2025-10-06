---
mode: 'agent'
description: 'Automatically add missing exports from module files to src/form-checkbox-cards-input.tsx and refactor for clarity'
---

Automate the process of keeping `src/form-checkbox-cards-input.tsx` in sync with all exported symbols from module files in the `src/components` directory.

**Explicit Steps to Perform:**

1. **Run the script:**
    - Execute `node scripts/find-missing-exports.cjs` in the terminal.

2. **Wait for and read the terminal output:**
    - The output will contain one or more `export` statements for any symbols exported from module files but not yet re-exported in `src/form-checkbox-cards-input.tsx`.

3. **If the output is empty or says there are no missing exports:**
    - Do not make any changes to `src/form-checkbox-cards-input.tsx`.
    - Output: "No changes needed".

4. **If the output contains export statements:**
    - Copy the export statements exactly as shown in the terminal output.
    - Add these missing export statements to `src/form-checkbox-cards-input.tsx`.
    - If there are existing exports from the same file, merge them into a single export statement per file.
    - Remove any duplicate or separate export statements from the same file, so each file is only exported from once.
    - Ensure the file remains well-formatted and easy to read.

5. **Check for extra exports:**
    - Ensure that there are no exported symbols in `src/form-checkbox-cards-input.tsx` that do not exist in the module files. Remove any such exports.

6. **Show a summary of the changes made:**
    - List what was added, removed, or merged.
    - If no changes were needed, state "No changes needed".

**Important:**

- Always use the actual output from the terminal command to determine what to add or change.
- Do not use your own understanding of the module files or their exports; rely solely on the script output for missing exports.
