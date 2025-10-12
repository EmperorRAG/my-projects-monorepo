---
mode: 'documentation'
description: 'Prompt for creating detailed feature implementation plans, following Nx monorepo structure.'
---

# Feature Implementation Plan Prompt

## Goal

Act as an industry-veteran software engineer responsible for crafting high-touch features for large-scale SaaS companies. Excel at creating detailed technical implementation plans for features based on a Feature PRD.
Review the provided context and output a thorough, comprehensive implementation plan.
**Note:** Do NOT write code in output unless it's pseudocode for technical situations.

## Output Format

The output should be a complete implementation plan in Markdown format.

**Directory Paths:**
- **Monorepo-level feature**: Save to `/docs/epics/{epic-name}/features/{feature-name}/implementation-plan.md`
- **Project-specific feature**: Save to `/docs/{project-type}/{project-name}/features/{feature-name}/implementation-plan.md`
  - Where `{project-type}` is one of: `apps`, `services`, `libs`, `tools`

The path should match the location of the corresponding Feature PRD. Ask the user to confirm if needed.

### File System

Folder and file structure for both front-end and back-end repositories following Nx monorepo structure:

```
apps/
  [app-name]/
services/
  [service-name]/
libs/
  [library-name]/
```

### Implementation Plan

For each feature:

#### Goal

Feature goal described (3-5 sentences)

#### Requirements

-   Detailed feature requirements (bulleted list)
-   Implementation plan specifics

#### Technical Considerations

##### System Architecture Overview

Create a comprehensive system architecture diagram using Mermaid that shows how this feature integrates into the overall system. The diagram should include:

-   **Frontend Layer**: User interface components, state management, and client-side logic
-   **API Layer**: tRPC endpoints, authentication middleware, input validation, and request routing
-   **Business Logic Layer**: Service classes, business rules, workflow orchestration, and event handling
-   **Data Layer**: Database interactions, caching mechanisms, and external API integrations
-   **Infrastructure Layer**: Docker containers, background services, and deployment components

Use subgraphs to organize these layers clearly. Show the data flow between layers with labeled arrows indicating request/response patterns, data transformations, and event flows. Include any feature-specific components, services, or data structures that are unique to this implementation.

-   **Technology Stack Selection**: Document choice rationale for each layer
-   **Integration Points**: Define clear boundaries and communication protocols
-   **Deployment Architecture**: Docker containerization strategy
-   **Scalability Considerations**: Horizontal and vertical scaling approaches

##### Database Schema Design

Create an entity-relationship diagram using Mermaid showing the feature's data model:

-   **Table Specifications**: Detailed field definitions with types and constraints
-   **Indexing Strategy**: Performance-critical indexes and their rationale
-   **Foreign Key Relationships**: Data integrity and referential constraints
-   **Database Migration Strategy**: Version control and deployment approach

##### API Design

-   Endpoints with full specifications
-   Request/response formats with TypeScript types
-   Authentication and authorization with Better-Auth
-   Error handling strategies and status codes
-   Rate limiting and caching strategies

##### Frontend Architecture

###### Component Hierarchy Documentation

Styling will be implemented using CSS Modules, with SCSS as the preprocessor and PostCSS for transformations like autoprefixing. This approach ensures that styles are scoped locally to their components, preventing global style conflicts. Each component will have a corresponding `[ComponentName].module.scss` file.

**Layout Structure:**

```
// RecipeLibrary.module.scss
.page { ... }
.header { ... }
.title { ... }
.addButton { ... }
.searchInput { ... }
.mainContent { ... }
.sidebar { ... }
.filterTitle { ... }
.recipeGrid { ... }

// RecipeCard.module.scss
.card { ... }
.image { ... }
.title { ... }
.tags { ... }
.actions { ... }

// Component Structure (JSX with CSS Modules)

<div className={styles.page}>
  <header className={styles.header}>
    <h1 className={styles.title}>Recipe Library</h1>
    <button className={styles.addButton}>Add Recipe</button>
    <input className={styles.searchInput} placeholder="Search..." />
  </header>
  <div className={styles.mainContent}>
    <aside className={styles.sidebar}>
      <h4 className={styles.filterTitle}>Filters</h4>
      {/* ... filter controls ... */}
    </aside>
    <main className={styles.recipeGrid}>
      {/* <RecipeCard /> instances go here */}
    </main>
  </div>
</div>
```

-   **State Flow Diagram**: Component state management using Mermaid
-   Reusable component library specifications
-   State management patterns with Zustand/React Query
-   TypeScript interfaces and types

##### Security Performance

-   Authentication/authorization requirements
-   Data validation and sanitization
-   Performance optimization strategies
-   Caching mechanisms

## Context Template

-   **Feature PRD:** [The content of the Feature PRD markdown file]
