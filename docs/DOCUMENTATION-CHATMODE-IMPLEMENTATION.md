# Documentation Chatmode Implementation Summary

## Overview

This implementation creates a comprehensive documentation workflow system for the Nx monorepo, introducing a new `documentation` chatmode that orchestrates the creation of Epic PRDs, Epic Architecture Specifications, Feature PRDs, Feature Implementation Plans, and Architectural Decision Records (ADRs).

## What Was Implemented

### 1. Documentation Chatmode (`.github/chatmodes/documentation.chatmode.md`)

A new chatmode that:
- **Manages documentation dependencies**: Ensures prerequisite documents exist before creating dependent documents
- **Guides users through the workflow**: Asks clarifying questions and gathers required information
- **Determines correct paths**: Constructs appropriate directory paths based on scope (monorepo-level vs project-specific)
- **Validates quality**: Ensures documents follow templates and instruction guidelines
- **Suggests next steps**: Guides users to the next document in the dependency chain

### 2. Updated Documentation Prompts

All documentation-related prompts now use the `documentation` chatmode:
- `breakdown-epic-pm.prompt.md` - Epic PRD creation
- `breakdown-epic-arch-restricted.prompt.md` - Epic Architecture creation
- `breakdown-feature-prd.prompt.md` - Feature PRD creation
- `breakdown-feature-implementation.prompt.md` - Feature Implementation Plan creation
- `create-architectural-decision-record.prompt.md` - ADR creation

### 3. Corrected Directory Structure

Updated all prompts to use the proper directory paths:

**Monorepo-Level Documentation:**
- Epic PRD: `/docs/epics/{epic-name}/epic.md`
- Epic Architecture: `/docs/epics/{epic-name}/arch.md`
- Feature PRD: `/docs/epics/{epic-name}/features/{feature-name}/prd.md`
- Feature Implementation: `/docs/epics/{epic-name}/features/{feature-name}/implementation-plan.md`

**Project-Specific Documentation:**
- Epic PRD: `/docs/{project-type}/{project-name}/epics/{epic-name}/epic.md`
- Epic Architecture: `/docs/{project-type}/{project-name}/epics/{epic-name}/arch.md`
- Feature PRD: `/docs/{project-type}/{project-name}/features/{feature-name}/prd.md`
- Feature Implementation: `/docs/{project-type}/{project-name}/features/{feature-name}/implementation-plan.md`

**Architectural Decisions:**
- ADR: `/docs/architecture/decisions/adr-{NNNN}-{title-slug}.md`

### 4. Enhanced AGENTS.md

Added comprehensive documentation management section including:
- Complete directory structure reference
- Documentation process workflow with dependency chain
- Detailed document types and their purposes
- AI model behavior requirements for documentation creation
- Step-by-step workflow examples
- File naming conventions
- Quality standards

### 5. Documentation Structure README Files

Created informative README files to guide users:
- `docs/epics/README.md` - Monorepo-level epics guidance
- `docs/services/README.md` - Service-specific documentation guidance
- `docs/apps/README.md` - App-specific documentation guidance
- `docs/libs/README.md` - Library-specific documentation guidance

### 6. Comprehensive Workflow Guide

Created `docs/DOCUMENTATION-WORKFLOW.md`:
- Quick reference for documentation creation
- Visual dependency chain diagrams
- Step-by-step creation guides
- Quality checklist
- Troubleshooting section
- Pro tips for effective documentation

## Documentation Dependency Chain

```
Epic PRD (epic.md)
    ↓
Epic Architecture (arch.md)
    ↓
Feature PRD (prd.md)
    ↓
Feature Implementation Plan (implementation-plan.md)

ADRs can be created at any stage
```

## How It Works

### User Request Flow

1. **User requests documentation** (e.g., "Create a feature implementation plan for user authentication")

2. **Chatmode identifies dependencies**:
   - Checks for Feature PRD → Missing
   - Checks for Epic Architecture → Missing
   - Checks for Epic PRD → Missing

3. **Chatmode responds**:
   - "To create a feature implementation plan, I need to first create:"
   - "1. Epic PRD (business case)"
   - "2. Epic Architecture (technical approach)"
   - "3. Feature PRD (feature requirements)"
   - "Would you like me to guide you through creating these?"

4. **Creates documents in order**:
   - Gathers information for each document
   - Places documents in correct directories
   - Links dependent documents together

5. **Suggests next steps**:
   - After completing the requested document
   - Identifies what comes next in the workflow
   - Asks if user wants to continue

### Scope Determination

The chatmode asks users to clarify scope:
- **Monorepo-level**: Affects multiple projects → `/docs/epics/`
- **Project-specific**: Affects single app/service/lib → `/docs/{project-type}/{project-name}/`

## Key Features

### 1. Dependency Management
- Automatically detects missing prerequisite documents
- Creates dependencies in the correct order
- Ensures documentation consistency

### 2. Path Construction
- Determines correct directory based on scope
- Supports both monorepo-level and project-specific paths
- Follows established naming conventions

### 3. Quality Assurance
- Validates all required sections are present
- Checks Mermaid diagram syntax
- Verifies cross-references are accurate
- Ensures instruction guideline compliance

### 4. Workflow Orchestration
- Guides users through the complete documentation lifecycle
- Asks targeted questions to gather required information
- Suggests logical next steps
- Prevents documentation gaps

## AI Model Behavior Requirements

When creating documentation, AI models MUST:

1. **Always check dependencies** before creating any document
2. **Use the documentation chatmode** for all documentation tasks
3. **Determine correct directory path** by asking about scope
4. **Follow the dependency chain** when prerequisites are missing
5. **Use appropriate prompts and instructions** for each document type
6. **Suggest next steps** after completing each document
7. **Validate quality** before finalizing documents
8. **Never place documentation in wrong directories** (e.g., old `/docs/ways-of-work/plan/` structure)

## Example Workflow

**Scenario**: Create feature implementation plan for "email templates" in email microservice

**AI Actions**:
1. Identify scope: Service-specific (my-nest-js-email-microservice)
2. Check Feature PRD → Missing
3. Ask for parent epic name
4. Check Epic Architecture → Missing (if applicable)
5. Check Epic PRD → Missing (if applicable)
6. Create in order:
   - Epic PRD at `/docs/services/my-nest-js-email-microservice/epics/{epic-name}/epic.md`
   - Epic Architecture at `/docs/services/my-nest-js-email-microservice/epics/{epic-name}/arch.md`
   - Feature PRD at `/docs/services/my-nest-js-email-microservice/features/email-templates/prd.md`
   - Feature Implementation at `/docs/services/my-nest-js-email-microservice/features/email-templates/implementation-plan.md`
7. Ask: "Would you like to create additional features or document architectural decisions?"

## Files Changed

### Created
- `.github/chatmodes/documentation.chatmode.md` - Main orchestration chatmode
- `docs/epics/README.md` - Monorepo epics guidance
- `docs/services/README.md` - Services documentation guidance
- `docs/apps/README.md` - Apps documentation guidance
- `docs/libs/README.md` - Libraries documentation guidance
- `docs/DOCUMENTATION-WORKFLOW.md` - Comprehensive workflow guide
- `docs/DOCUMENTATION-CHATMODE-IMPLEMENTATION.md` - This summary

### Modified
- `.github/prompts/breakdown-epic-pm.prompt.md` - Updated mode and paths
- `.github/prompts/breakdown-epic-arch-restricted.prompt.md` - Updated mode and paths
- `.github/prompts/breakdown-feature-prd.prompt.md` - Updated mode and paths
- `.github/prompts/breakdown-feature-implementation.prompt.md` - Updated mode and paths
- `.github/prompts/create-architectural-decision-record.prompt.md` - Updated mode and path
- `AGENTS.md` - Added comprehensive documentation management section

## Benefits

1. **Consistency**: All documentation follows the same structure and standards
2. **Completeness**: Dependencies ensure no documentation gaps
3. **Discoverability**: Clear directory structure makes documentation easy to find
4. **Quality**: Built-in validation ensures high-quality documentation
5. **Efficiency**: Automated workflow reduces manual effort
6. **Guidance**: Step-by-step process helps both users and AI models
7. **Maintainability**: Centralized chatmode and prompts make updates easier

## Next Steps

1. Test the documentation chatmode with real documentation creation scenarios
2. Gather feedback from users on the workflow
3. Refine prompts and templates based on usage patterns
4. Add more examples to the workflow guide
5. Consider creating templates for common documentation scenarios

## References

- [Documentation Chatmode](../.github/chatmodes/documentation.chatmode.md)
- [Documentation Workflow Guide](./DOCUMENTATION-WORKFLOW.md)
- [AGENTS.md](../AGENTS.md#documentation-management)
- [Documentation Prompts](../.github/prompts/)
- [Documentation Instructions](../.github/instructions/docs/)
