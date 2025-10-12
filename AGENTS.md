# AGENTS.md

This document provides instructions for AI agents to effectively contribute to this Nx monorepo.

## Project Overview

This is an Nx monorepo containing a Next.js application (`my-programs-app`), a NestJS microservice (`my-nest-js-email-microservice`), and a shared utility library (`utilities`).

- **`apps/my-programs-app`**: The main Next.js application.
- **`apps/my-programs-app-e2e`**: Playwright end-to-end tests for `my-programs-app`.
- **`libs/utilities`**: A shared utility library.
- **`services/my-nest-js-email-microservice`**: A NestJS microservice for email functionalities.
- **`services/my-nest-js-email-microservice-e2e`**: End-to-end tests for the email microservice.

## Setup Commands

1. **Install dependencies:**

   ```sh
   pnpm install
   ```

## Development Workflow

- **Run dev server for the Next.js app:**

   ```sh
   npx nx dev my-programs-app
   ```

- **Run the NestJS microservice:**

   ```sh
   npx nx serve my-nest-js-email-microservice
   ```

## Testing Instructions

- **Run tests for a specific project:**

   ```sh
   npx nx test <project-name>
   ```

   *Example:* `npx nx test utilities`

- **Run e2e tests for the Next.js app:**

   ```sh
   npx nx e2e my-programs-app-e2e
   ```

## Code Style

- This project uses ESLint for linting. Run `npx nx lint <project-name>` to check for issues.
- Formatting is handled by Prettier.

## Build and Deployment

- **Build a project for production:**

   ```sh
   npx nx build <project-name>
   ```

   *Example:* `npx nx build my-programs-app`

## Pull Request Guidelines

- Follow the guidelines in `.github/CONTRIBUTING.md`.
- Ensure all tests and lint checks pass before submitting a PR.

## Learning Log Workflow

- Document every resolved issue using the If/When/Then format so future runs benefit from prior discoveries.
- Run `bash tools/scripts/add-learning.sh --tech <domain> --title "Title" --if "..." --when "..." --then "..." --solution "..."`.
- The script appends to `docs/learnings/<domain>.md`, creating the file when necessary and keeping entries grouped by technology.
- Reference the log entry in your task summary to confirm documentation was updated.

## Documentation Management

### Documentation Directory Structure

This monorepo follows a structured approach to documentation. All documentation must be placed in the appropriate directory based on its type and scope.

#### Monorepo-Level Documentation

For epics and features that affect the entire monorepo:

- **Epic PRD**: `/docs/epics/{epic-name}/epic.md`
- **Epic Architecture**: `/docs/epics/{epic-name}/arch.md`
- **Feature PRD**: `/docs/epics/{epic-name}/features/{feature-name}/prd.md`
- **Feature Implementation Plan**: `/docs/epics/{epic-name}/features/{feature-name}/implementation-plan.md`

#### Project-Specific Documentation

For epics and features specific to apps, services, or libraries:

- **Epic PRD**: `/docs/{project-type}/{project-name}/epics/{epic-name}/epic.md`
- **Epic Architecture**: `/docs/{project-type}/{project-name}/epics/{epic-name}/arch.md`
- **Feature PRD**: `/docs/{project-type}/{project-name}/features/{feature-name}/prd.md`
- **Feature Implementation Plan**: `/docs/{project-type}/{project-name}/features/{feature-name}/implementation-plan.md`

Where `{project-type}` is one of: `apps`, `services`, `libs`

**Example for a service-specific epic:**
```
/docs/services/my-nest-js-email-microservice/epics/email-notifications/epic.md
/docs/services/my-nest-js-email-microservice/epics/email-notifications/arch.md
/docs/services/my-nest-js-email-microservice/features/send-email/prd.md
/docs/services/my-nest-js-email-microservice/features/send-email/implementation-plan.md
```

#### Architectural Decision Records (ADRs)

- **ADR**: `/docs/architecture/decisions/adr-{NNNN}-{title-slug}.md`

Where `{NNNN}` is a 4-digit sequential number (e.g., `adr-0001-use-nx-for-monorepo-management.md`)

### Documentation Process Workflow

The documentation creation process follows a strict dependency chain. Each document type requires certain prerequisite documents to exist before it can be created:

1. **Epic PRD (epic.md)** - Starting point, no dependencies
   - Defines business problem, user personas, business requirements, success metrics
   - Must be created first for any new epic

2. **Epic Architecture (arch.md)** - Requires Epic PRD
   - Defines technical approach, system architecture, technology stack
   - Cannot be created without the Epic PRD
   - Must reference the Epic PRD

3. **Feature PRD (prd.md)** - Requires Epic PRD and Epic Architecture
   - Details specific feature requirements derived from the epic
   - Links back to parent epic documents
   - Cannot be created without both epic documents

4. **Feature Implementation Plan (implementation-plan.md)** - Requires Feature PRD
   - Technical specification for implementing the feature
   - Cannot be created without the Feature PRD
   - References the Feature PRD for requirements

5. **Architectural Decision Records (ADR)** - Can be created at any stage
   - Documents specific architectural decisions
   - Can reference epics, features, or be standalone
   - Should be created when significant technical decisions are made

### Document Types and Their Purposes

#### Epic PRD (Product Requirements Document)
- **Purpose**: Define the business case, user needs, and high-level requirements for a major initiative
- **Use Chatmode**: `documentation` (`.github/chatmodes/documentation.chatmode.md`)
- **Use Prompt**: `.github/prompts/breakdown-epic-pm.prompt.md`
- **Follow Instructions**: `.github/instructions/docs/docs-epic-prd.instructions.md`
- **Key Sections**: Epic Name, Goal (Problem/Solution/Impact), User Personas, User Journeys, Business Requirements, Success Metrics, Out of Scope, Business Value

#### Epic Architecture Specification
- **Purpose**: Define the technical approach and system architecture for an epic
- **Use Chatmode**: `documentation` (`.github/chatmodes/documentation.chatmode.md`)
- **Use Prompt**: `.github/prompts/breakdown-epic-arch-restricted.prompt.md`
- **Follow Instructions**: `.github/instructions/docs/docs-epic-architecture.instructions.md`
- **Key Sections**: Architecture Overview, System Diagram (Mermaid with 5 layers), Features & Enablers, Technology Stack, Technical Value, T-Shirt Size

#### Feature PRD
- **Purpose**: Detailed product requirements for a specific feature within an epic
- **Use Chatmode**: `documentation` (`.github/chatmodes/documentation.chatmode.md`)
- **Use Prompt**: `.github/prompts/breakdown-feature-prd.prompt.md`
- **Follow Instructions**: `.github/instructions/docs/docs-feature-prd.instructions.md`
- **Key Sections**: Feature Name, Epic Links, Goal (Problem/Solution/Impact), User Personas, User Stories, Requirements (Functional/Non-Functional), Acceptance Criteria, Out of Scope

#### Feature Implementation Plan
- **Purpose**: Technical implementation details for a feature
- **Use Chatmode**: `documentation` (`.github/chatmodes/documentation.chatmode.md`)
- **Use Prompt**: `.github/prompts/breakdown-feature-implementation.prompt.md`
- **Follow Instructions**: `.github/instructions/docs/docs-feature-implementation.instructions.md`
- **Key Sections**: Goal, Requirements, Technical Considerations (Architecture, Database Schema, API Design, Frontend Architecture, Security & Performance)

#### Architectural Decision Record (ADR)
- **Purpose**: Document significant architectural decisions with context and rationale
- **Use Chatmode**: `documentation` (`.github/chatmodes/documentation.chatmode.md`)
- **Use Prompt**: `.github/prompts/create-architectural-decision-record.prompt.md`
- **Follow Instructions**: `.github/instructions/docs/docs-adr.instructions.md`
- **Key Sections**: Status, Context, Decision, Consequences (Positive/Negative), Alternatives Considered, Implementation Notes, References
- **Naming Convention**: `adr-NNNN-{title-slug}.md` where NNNN is a 4-digit sequential number

### AI Model Behavior for Documentation Creation

When creating or managing documentation, AI models MUST follow these requirements:

#### 1. Always Check Documentation Dependencies

Before creating any document, verify that all prerequisite documents exist:

- **Creating Epic Architecture?** → Check that Epic PRD exists in the same directory
- **Creating Feature PRD?** → Check that both Epic PRD and Epic Architecture exist
- **Creating Feature Implementation Plan?** → Check that Feature PRD exists in the same directory

If dependencies are missing, inform the user and offer to create them first.

#### 2. Use the Documentation Chatmode

All documentation creation MUST use the `documentation` chatmode defined in `.github/chatmodes/documentation.chatmode.md`. This chatmode:
- Manages the documentation workflow
- Ensures dependencies are met
- Guides users through the creation process
- Places documents in correct directories

#### 3. Determine Correct Directory Path

Always ask the user to clarify the scope of the documentation:
- Is this monorepo-level or project-specific?
- If project-specific, what is the project type (apps/services/libs) and name?
- Construct the full path following the directory structure rules

#### 4. Follow the Dependency Chain

When a user requests documentation that requires prerequisites:
1. Identify all missing prerequisite documents
2. Notify the user clearly about what's missing
3. Offer to create the missing documents first
4. Gather information for all prerequisite documents
5. Create documents in dependency order (Epic PRD → Epic Arch → Feature PRD → Implementation)
6. Resume the original request after dependencies are met

#### 5. Use Appropriate Prompts and Instructions

Each document type has:
- A specific prompt template in `.github/prompts/`
- Specific instruction guidelines in `.github/instructions/docs/`

Always use the correct prompt template and follow the instruction guidelines for the document type being created.

#### 6. Suggest Next Steps

After creating any document, determine what comes next in the documentation workflow and ask the user if they want to proceed:

- After Epic PRD → Suggest Epic Architecture
- After Epic Architecture → Suggest Feature PRDs for the epic's features
- After Feature PRD → Suggest Feature Implementation Plan
- After Feature Implementation → Ask if there are more features or if ADRs are needed

#### 7. Validate Documentation Quality

Before finalizing any document, ensure:
- All required sections from the template are present and complete
- File is saved in the correct directory with proper naming
- Dependencies are properly documented (links to parent documents)
- Mermaid diagrams are syntactically correct (especially 5-layer architecture diagrams)
- Cross-references to other documents are accurate
- The document follows the specific instruction module guidelines

#### 8. Never Place Documentation in Wrong Directories

**CRITICAL**: Documentation MUST NOT be placed in:
- `/docs/ways-of-work/plan/` (old structure, no longer used)
- Random locations without following the structure
- Project root directories (unless it's README.md or AGENTS.md)

Always use the correct paths as defined in the Documentation Directory Structure section above.

### Example Documentation Workflow

**Scenario**: User wants to create a feature implementation plan for "email templates" in the email microservice

**AI Actions**:
1. Recognize this requires dependencies: Feature PRD → Epic Architecture → Epic PRD
2. Check for Feature PRD at `/docs/services/my-nest-js-email-microservice/features/email-templates/prd.md` → Missing
3. Check for Epic Architecture → Need to identify parent epic first
4. Ask user: "What is the parent epic for this feature?"
5. Check for Epic PRD and Architecture in `/docs/services/my-nest-js-email-microservice/epics/{epic-name}/`
6. If missing, create in order: Epic PRD → Epic Architecture → Feature PRD → Feature Implementation Plan
7. Place each document in the correct directory following the structure
8. After completion, ask: "Would you like to create additional features for this epic or document any architectural decisions with ADRs?"

### File Naming Conventions

Follow these naming rules strictly:

- **Epic/Feature folders**: Use kebab-case (e.g., `email-notifications`, `email-templates`)
- **Document files**: Use specific names
  - Epic PRD: `epic.md`
  - Epic Architecture: `arch.md`
  - Feature PRD: `prd.md`
  - Feature Implementation: `implementation-plan.md`
- **ADR files**: `adr-{NNNN}-{title-slug}.md` where NNNN is a 4-digit number (e.g., `adr-0001-use-nx-for-monorepo-management.md`)

### Documentation Quality Standards

All documentation must:
- Be written in clear, professional Markdown
- Include all required sections from the appropriate template
- Contain properly formatted Mermaid diagrams where specified
- Link to related documents (parent epics, related features, relevant ADRs)
- Follow the instruction module guidelines in `.github/instructions/docs/`
- Be reviewed for completeness before considering it final


<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

# CI Error Guidelines

If the user wants help with fixing an error in their CI pipeline, use the following flow:
- Retrieve the list of current CI Pipeline Executions (CIPEs) using the `nx_cloud_cipe_details` tool
- If there are any errors, use the `nx_cloud_fix_cipe_failure` tool to retrieve the logs for a specific task
- Use the task logs to see what's wrong and help the user fix their problem. Use the appropriate tools if necessary
- Make sure that the problem is fixed by running the task that you passed into the `nx_cloud_fix_cipe_failure` tool


<!-- nx configuration end-->