---
description: 'A prompt to guide an AI to implement a function using documentation from Context7.'
---

# Implement `${input:symbol_name:The name of the function or symbol to implement}`

## Instructions for AI

You are tasked with implementing the `${input:symbol_name}` ${input:symbol_type:The type of symbol (e.g., utility, function, class)}. Your primary goal is to use the `context7` tool to fetch relevant and up-to-date documentation for the specified library and then implement the function and any necessary supporting utilities based on that documentation.

**Follow these steps:**

1.  **Identify the Library:** Use the information provided below to identify the target library.
2.  **Fetch Documentation:** Use `mcp_context7_resolve_library_id` to find the correct ID for the library, then use `mcp_context7_get_library_docs` to fetch documentation related to the implementation.
3.  **Analyze Documentation:** Carefully review the fetched documentation to understand the API, required parameters, authentication methods, and best practices.
4.  **Implement Utilities:**
    - Implement the `${input:symbol_name}` function as described in the requirements.
    - Create any necessary helper functions or configuration files.
    - Ensure the implementation is robust, handles errors, and follows the style of the existing codebase.
5.  **Code Placement:** Place the new code in the specified file path.
6.  **Security:** Do not hardcode API keys or other secrets. Use environment variables or a configuration service.
7.  **Final Output:** Provide the implemented code.

---

## User-Provided Details

### 1. Library and Framework Details

- **Programming Language/Framework:** ${input:language:Programming language and framework (e.g., TypeScript/NestJS)}
- **Service Provider/Library:** ${input:library:The service provider or library to use (e.g., SendGrid, AWS SES)}

### 2. Function Requirements

- **Primary Function Name:** `${input:symbol_name}`
- **Function Signature/Parameters:** ${input:signature:The function signature and parameters (e.g., (to: string, token: string))}
- **Core Logic:** ${input:logic:The core logic of the function}
- **Supporting Utilities Needed:** ${input:support_utilities:Any supporting utilities needed}

### 3. Implementation Details

- **Target File Path(s):** ${input:target_path:The file path for the new code}
- **Configuration File Path:** ${input:config_path:The file path for configuration}
- **Existing Code to Reference:** ${input:existing_code:Optional: Existing relevant code snippets or file paths}

### 4. Additional Context

- **Notes:** ${input:notes:Optional: Any other details, constraints, or requirements}
