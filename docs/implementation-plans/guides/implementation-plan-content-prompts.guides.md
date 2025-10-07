# Guide: Prompting for Product Requirements Document (PRD) Generation

This guide explains how to structure a detailed prompt for an AI model to generate a high-quality Product Requirements Document (PRD). By providing comprehensive and well-organized information, you can ensure the resulting PRD is accurate, complete, and aligned with your vision.

## 1. The Goal of the Prompt

The objective is to provide the AI with all the necessary context and raw information it needs to draft a formal PRD. Your prompt should act as a "briefing" that covers every key component of the PRD. The more detailed your prompt, the less the AI has to infer, leading to a better output.

## 2. Structuring Your Prompt

Structure your prompt using clear headings that correspond to the sections of a standard PRD. This helps the AI understand the context of each piece of information.

### Master Prompt Template

Use the following template as a starting point. Fill in the details for your specific project.

```text
Generate a Product Requirements Document (PRD) for [Project Name].

Here is the detailed information for each section:

### 1. Introduction & Overview
- **Project Name**: [Your Project's Name]
- **Document Status**: [e.g., Draft, In Review]
- **Key Stakeholders**:
  - Product Manager: [Name]
  - Engineering Lead: [Name]
  - Design Lead: [Name]
  - Other: [Role: Name]

### 2. Purpose and Goals
- **Problem Statement**: [Clearly describe the user's problem or the business need. What pain point are you solving?]
- **Business Case**: [Explain the value. How does this project help the business? e.g., Increase user engagement by 15%, capture new market segment, reduce support tickets.]
- **Product Vision**: [Briefly describe the long-term vision this project contributes to.]

### 3. Target Audience & User Personas
- **Target Market**: [Describe your ideal customer or market segment.]
- **User Personas**:
  - **Persona 1 (e.g., "The Power User")**:
    - **Role/Background**: [e.g., Senior Data Analyst]
    - **Goals**: [What do they want to achieve?]
    - **Pain Points**: [What currently frustrates them?]
  - **Persona 2 (e.g., "The New User")**:
    - ... (repeat for other personas)

### 4. Features and Functionality
- **Feature 1: [Name of Feature]**
  - **Description**: [High-level summary of the feature.]
  - **User Story**: "As a [Persona], I want to [action] so that I can [benefit]."
  - **Functional Requirements**:
    - [Requirement 1, e.g., "The system must allow users to upload CSV files up to 50MB."]
    - [Requirement 2, e.g., "Uploaded data must be validated for correct formatting."]
- **Feature 2: [Name of Feature]**
  - ... (repeat for all features)

### 5. Design and UX Requirements
- **Key User Flows**:
  - [Describe the primary user journeys, e.g., "Onboarding Flow," "Data Upload Flow."]
- **Wireframes/Mockups**: [Provide links to Figma, Sketch, or other design files.]
- **Accessibility**: [Specify requirements, e.g., "Must be WCAG 2.1 AA compliant."]

### 6. Technical Specifications & Constraints
- **Technical Stack**: [e.g., React frontend, Node.js backend, PostgreSQL database.]
- **System Requirements**: [e.g., "Must run in all modern web browsers (Chrome, Firefox, Safari)."]
- **Constraints**: [e.g., "Must integrate with the existing authentication service via REST API."]
- **Assumptions**: [e.g., "We assume the third-party payment gateway API will be available."]

### 7. Success Metrics & KPIs
- **Key Performance Indicators (KPIs)**:
  - [Metric 1, e.g., "Daily Active Users (DAU)"]
  - [Metric 2, e.g., "Task Completion Rate"]
- **Success Criteria**:
  - [Goal 1, e.g., "Achieve a 20% increase in DAU within 3 months of launch."]
  - [Goal 2, e.g., "Maintain a task completion rate of 95% or higher."]

### 8. Scope and Release Plan
- **In-Scope**:
  - [List all major features/components that WILL be included.]
- **Out-of-Scope**:
  - [Explicitly list features that will NOT be included to prevent scope creep.]
- **Milestones**:
  - **Alpha Release (Date)**: [Key features included]
  - **Beta Release (Date)**: [Key features included]
  - **GA Release (Date)**: [All features for V1 complete]

### 9. Risks and Mitigation
- **Risk 1**: [Description of a potential risk, e.g., "Third-party API may have reliability issues."]
  - **Mitigation**: [How you plan to address it, e.g., "Implement a circuit breaker and caching layer."]
- **Risk 2**: ... (repeat for all identified risks)
```

## 3. Tips for an Effective Prompt

- **Be Specific and Quantifiable**: Instead of "make it fast," say "page load time must be under 2 seconds." Instead of "handle many users," say "the system must support 1,000 concurrent users."
- **Provide Context**: Don't assume the AI knows your business. Briefly explain your company, product, and users if the context is necessary.
- **Use Lists and Bullet Points**: Break down complex information into lists. This makes the prompt easier for the AI to parse and structure in the final document.
- **Separate "What" from "How"**: The PRD focuses on *what* the product should do (the requirements). The implementation details of *how* it will be built belong in a technical design document, though you can include high-level technical constraints in the PRD.
- **Iterate**: Generate a first draft of the PRD from your prompt, then review it. You can then ask the AI to refine specific sections by providing more detail or clarification. For example: "Refine the 'Features and Functionality' section to include more detailed acceptance criteria for the data export feature."
