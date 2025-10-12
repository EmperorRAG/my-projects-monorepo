# Tool Documentation: Epic Product Requirements Document (PRD) Generator

## 1. Purpose & Goal

### Primary Purpose
This tool acts as an expert Product Manager to transform high-level epic ideas into detailed Epic-level Product Requirements Documents (PRDs). These PRDs serve as the single source of truth for engineering teams and input for generating technical architecture specifications.

### Target Audience
- Product managers
- Engineering teams
- Business stakeholders
- UX/Design teams
- Technical architects (consumers of output)

### Expected Outcome
A comprehensive Epic PRD in Markdown format that clearly defines the problem, solution, requirements, and business value for a large-scale feature initiative.

---

## 2. Current Functionality Breakdown

### 2.1 Input Processing
**What it does:**
- Accepts high-level epic idea from user
- Optionally accepts target user information
- Prompts for clarifications if information is insufficient

**Complexity Level:** LOW
- Simple text input processing
- Interactive clarification capability

### 2.2 PRD Document Generation

#### 2.2.1 Epic Name Generation
**What it does:**
- Creates clear, concise, descriptive name for the epic

**Complexity Level:** LOW
- Simple naming convention

#### 2.2.2 Goal Definition (3 Sub-components)
**What it does:**
- **Problem Statement:** Describes user problem or business need (3-5 sentences)
- **Solution:** Explains how epic solves the problem at high level
- **Impact:** Defines expected outcomes and metrics (engagement, conversion, revenue)

**Complexity Level:** MEDIUM
- Requires problem-solution analysis
- Needs metric identification
- Must balance detail with high-level perspective

#### 2.2.3 User Personas
**What it does:**
- Describes target user(s) for the epic
- Identifies user characteristics and needs

**Complexity Level:** LOW
- Simple user description

#### 2.2.4 High-Level User Journeys
**What it does:**
- Describes key user journeys and workflows enabled by epic
- Maps user interactions at high level

**Complexity Level:** MEDIUM
- Requires journey mapping skills
- Needs workflow understanding

#### 2.2.5 Business Requirements (2 Sub-components)
**What it does:**
- **Functional Requirements:** Detailed bulleted list of business deliverables
- **Non-Functional Requirements:** Bulleted list of constraints and quality attributes (performance, security, accessibility, privacy)

**Complexity Level:** MEDIUM
- Requires comprehensive requirement gathering
- Needs technical awareness for non-functional requirements
- Must be exhaustive yet concise

#### 2.2.6 Success Metrics (KPIs)
**What it does:**
- Defines Key Performance Indicators to measure epic success
- Quantifies expected outcomes

**Complexity Level:** MEDIUM
- Requires metric selection
- Needs measurable definitions
- Must align with business goals

#### 2.2.7 Out of Scope Definition
**What it does:**
- Explicitly lists what is NOT included in epic
- Prevents scope creep

**Complexity Level:** MEDIUM
- Requires boundary definition
- Needs understanding of adjacent features
- Critical for project planning

#### 2.2.8 Business Value Assessment
**What it does:**
- Estimates business value (High/Medium/Low)
- Provides justification for estimate

**Complexity Level:** MEDIUM
- Subjective assessment
- Requires business acumen
- Needs justification framework

### 2.3 Output Generation
**What it does:**
- Creates Markdown file
- Saves to specific path: `/docs/ways-of-work/plan/{epic-name}/epic.md`
- Structures content according to standard PRD template

**Complexity Level:** LOW
- Standard file output

---

## 3. Input Requirements

### Required Inputs
1. **Epic Idea**
   - High-level description of the epic
   - Problem or opportunity statement
   - Initial scope concept

### Optional Inputs
2. **Target Users**
   - Initial thoughts on user personas
   - User segments to address

### Interaction Pattern
3. **Clarification Capability**
   - Tool can ask questions if information is insufficient
   - Interactive requirement gathering

---

## 4. Output Specification

### File Output
- **Location:** `/docs/ways-of-work/plan/{epic-name}/epic.md`
- **Format:** Markdown
- **Naming Convention:** Based on epic name (lowercase, hyphenated)

### Content Structure
```markdown
# 1. Epic Name
[Clear, descriptive name]

# 2. Goal
## Problem
[3-5 sentence description]
## Solution
[High-level solution description]
## Impact
[Expected outcomes and metrics]

# 3. User Personas
[Target user descriptions]

# 4. High-Level User Journeys
[Key workflows and journeys]

# 5. Business Requirements
## Functional Requirements
- [Bulleted list]
## Non-Functional Requirements
- [Bulleted list of constraints]

# 6. Success Metrics
[KPIs to measure success]

# 7. Out of Scope
[Explicitly excluded features]

# 8. Business Value
[High/Medium/Low with justification]
```

---

## 5. Complexity Analysis

### High Complexity Areas

#### 5.1 Business Requirements Definition
**Issues:**
- Requires both functional AND non-functional requirements
- Detailed bulleted lists can become extensive
- Non-functional requirements need technical knowledge
- Must be comprehensive yet readable

**Current Problems:**
- No guidance on granularity level
- No limit on number of requirements
- Can lead to over-specification
- Blurs line between epic and feature requirements

**Recommendation:**
- Limit to 5-7 high-level functional requirements per epic
- Provide NFR checklist (select applicable ones)
- Focus on epic-level, not feature-level details

#### 5.2 Success Metrics Definition
**Issues:**
- Requires metric identification skills
- Needs quantifiable measures
- Must align with business strategy
- Can be difficult for new/innovative features

**Current Problems:**
- No framework for metric selection
- No guidance on number of metrics
- Unclear how to measure indirect impacts

**Recommendation:**
- Provide metric templates by epic type
- Limit to 3-5 key metrics
- Include both leading and lagging indicators
- Allow qualitative goals when quantitative is unclear

### Medium Complexity Areas

#### 5.3 Out of Scope Definition
**Issues:**
- Requires understanding of related features
- Needs boundary clarity
- Can be overlooked or underspecified

**Current Problems:**
- No guidance on what level of detail
- Unclear how comprehensive to be
- May miss important exclusions

**Recommendation:**
- Provide "common out-of-scope" checklist
- Focus on frequently requested features
- Keep concise (3-5 items typically sufficient)

#### 5.4 High-Level User Journeys
**Issues:**
- Requires journey mapping skills
- Needs balance between detail and high-level view
- Can overlap with feature-level documentation

**Current Problems:**
- No guidance on journey granularity
- Unclear distinction from feature user stories
- Can become too detailed

**Recommendation:**
- Limit to 2-3 primary journeys
- Use simple narrative format
- Focus on end-to-end flow, not individual steps

#### 5.5 Business Value Assessment
**Issues:**
- Subjective assessment
- Requires business context
- Justification can be difficult

**Current Problems:**
- No standard evaluation criteria
- Inconsistent across different PMs
- Limited guidance on justification

**Recommendation:**
- Provide value assessment rubric
- Include cost-benefit consideration template
- Consider strategic alignment criteria

### Low Complexity Areas (Good to Keep)

#### 5.6 Epic Name
- Simple, clear naming
- Low overhead
- High value for organization

#### 5.7 User Personas
- Standard PM practice
- Well-understood format
- Clear value

#### 5.8 Goal Definition (Problem/Solution/Impact)
- Core of PRD
- Essential for alignment
- Worth the effort

---

## 6. Simplification Recommendations

### Priority 1: Simplify Business Requirements
**Current State:** Open-ended functional and non-functional requirements

**Simplified Approach:**
```markdown
## Business Requirements

### Functional (Limit: 5-7 high-level capabilities)
- [Capability 1]
- [Capability 2]
...

### Non-Functional (Select applicable)
☐ Performance: [Specific requirement]
☐ Security: [Specific requirement]
☐ Accessibility: [Specific requirement]
☐ Scalability: [Specific requirement]
☐ Data Privacy: [Specific requirement]
☐ Other: [Specify]
```

**Benefits:**
- Focused requirements
- Checklist reduces decision fatigue
- Prevents over-specification
- Faster completion

### Priority 2: Standardize Success Metrics
**Current State:** Undefined number and types of KPIs

**Simplified Approach:**
```markdown
## Success Metrics (Select 3-5)

### Business Metrics
- [Metric 1]: [Target]
- [Metric 2]: [Target]

### User Metrics
- [Metric 1]: [Target]

### Technical Metrics (Optional)
- [Metric 1]: [Target]
```

**Benefits:**
- Clear structure
- Prevents metric overload
- Balanced perspective
- Easier tracking

### Priority 3: Template-Based User Journeys
**Current State:** Undefined format and scope

**Simplified Approach:**
```markdown
## High-Level User Journeys (2-3 primary flows)

### Journey 1: [Name]
User starts at [entry point] → [key actions] → achieves [outcome]

### Journey 2: [Name]
User starts at [entry point] → [key actions] → achieves [outcome]
```

**Benefits:**
- Consistent format
- Appropriate detail level
- Quick to write and read

### Priority 4: Guided Out-of-Scope
**Current State:** Open-ended exclusion list

**Simplified Approach:**
```markdown
## Out of Scope

### Common Exclusions (Check applicable)
☐ Mobile app support
☐ Offline functionality
☐ Advanced analytics
☐ Third-party integrations
☐ International/localization
☐ Custom: [Specify]
```

**Benefits:**
- Faster completion
- Catches common scope issues
- Customizable for unique cases

### Priority 5: Value Assessment Framework
**Current State:** Subjective High/Medium/Low with manual justification

**Simplified Approach:**
```markdown
## Business Value Assessment

Calculate score (0-10 scale):
- Strategic Alignment (0-4): [Score]
- Revenue Potential (0-3): [Score]
- User Impact (0-3): [Score]

Total: [X]/10
Rating: [High: 8-10 | Medium: 5-7 | Low: 0-4]

Brief Justification: [1-2 sentences]
```

**Benefits:**
- Semi-quantitative approach
- More consistent assessments
- Clear decision framework
- Quick justification

---

## 7. Recommended Scope Reduction

### Features to Remove
1. **Open-ended requirement lists** - Replace with guided/limited formats
2. **Undefined metric counts** - Enforce 3-5 metric limit

### Features to Simplify
1. **Business Requirements** → Checklist format with limits
2. **Success Metrics** → Template with categories and limits
3. **User Journeys** → Simple narrative format, 2-3 flows maximum
4. **Out of Scope** → Checklist plus custom additions
5. **Business Value** → Scoring rubric instead of free-form

### Features to Keep (Core Value)
1. **Epic Name** - Essential identifier
2. **Goal (Problem/Solution/Impact)** - Core PRD value
3. **User Personas** - Critical for user-centered design
4. **All sections** - But simplified formats

---

## 8. Implementation Complexity Score

### Current Implementation: 6/10 (Medium-High Complexity)
- Multiple detailed sections: 2 points
- Open-ended requirements: 2 points
- Subjective assessments: 1 point
- User journey mapping: 1 point

### Recommended Simplified Implementation: 3/10 (Low-Medium Complexity)
- Template-based sections: 1 point
- Guided inputs with limits: 1 point
- Scoring rubrics: 0.5 points
- Structured journeys: 0.5 points

**Complexity Reduction: 50%**

---

## 9. Migration Path

### Phase 1: Add Guidance (Low Risk)
1. Add requirement count limits (5-7 functional)
2. Add metric limits (3-5 KPIs)
3. Add NFR checklist as guidance

### Phase 2: Introduce Templates (Medium Risk)
1. Create journey narrative template
2. Create out-of-scope checklist
3. Create value assessment rubric

### Phase 3: Enforce Structure (Higher Risk)
1. Convert all sections to structured formats
2. Implement validation for limits
3. Provide migration guide for existing PRDs

---

## 10. Success Metrics for Simplification

### Quantitative Metrics
- **Time to create PRD:** Target 40% reduction (from ~3 hours to ~1.8 hours)
- **PRD review time:** Target 35% reduction
- **Revision cycles:** Target 30% reduction (clearer structure = fewer revisions)
- **PRD length:** Target 25% reduction for typical epic

### Qualitative Metrics
- **Stakeholder satisfaction:** Survey on PRD clarity and usefulness
- **Engineering readiness:** Survey on PRD completeness for architecture phase
- **Consistency:** Improved similarity across PRDs (easier to compare/review)

---

## 11. Risk Assessment

### Risks of Current Complexity
1. **Documentation fatigue** - Teams skip or rush PRDs due to perceived overhead
2. **Inconsistent quality** - Open-ended format leads to high variation
3. **Over-specification** - Details that should be in features end up in epic
4. **Slow planning cycle** - Time-intensive PRD creation delays start
5. **Analysis paralysis** - Too many decisions without clear framework

### Risks of Simplification
1. **Loss of detail** - Important context might be missed with templates
2. **Cookie-cutter PRDs** - Less customization might miss unique aspects
3. **Adoption resistance** - PMs comfortable with current format may resist change

**Mitigation Strategies:**
1. Phased rollout with pilot epics
2. Feedback collection after each phase
3. "Escape hatch" for complex epics requiring more detail
4. Training on new templates and rubrics
5. Side-by-side comparison of old vs. new format

---

## 12. Tool Integration Points

### Input Dependencies
- User/stakeholder interviews
- Market research
- Competitive analysis
- Strategic priorities

### Output Consumers
1. **breakdown-epic-arch-restricted.prompt.md** - Consumes epic.md to create arch.md
2. **breakdown-feature-prd.prompt.md** - References epic.md for feature PRDs
3. Engineering teams - Use for planning and estimation
4. Product team - Track against roadmap

### Integration Improvements
- Ensure simplified format still provides all data needed by downstream tools
- Version compatibility considerations
- Template updates should cascade to dependent tools

---

## 13. Recommendation Summary

### High Priority (Immediate Value)
1. ✅ Implement requirement limits (5-7 functional requirements)
2. ✅ Add metric limits (3-5 KPIs)
3. ✅ Create NFR checklist
4. ✅ Standardize user journey format

### Medium Priority (Quick Wins)
5. ✅ Create out-of-scope checklist
6. ✅ Implement value assessment rubric
7. ✅ Add journey templates

### Low Priority (Future Enhancement)
8. ⚠️ Auto-validation of limits
9. ⚠️ PRD comparison tool
10. ⚠️ Template library expansion

**Expected Overall Impact:** 
- 40-50% reduction in PRD creation time
- 30-40% improvement in PRD consistency
- 25-35% reduction in review/revision cycles
- Maintained or improved information quality through structured approach
