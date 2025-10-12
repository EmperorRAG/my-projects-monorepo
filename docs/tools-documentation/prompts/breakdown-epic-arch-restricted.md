# Tool Documentation: Epic Architecture Specification Generator

## 1. Purpose & Goal

### Primary Purpose
This tool acts as a Senior Software Architect to transform Epic Product Requirements Documents (PRDs) into high-level technical architecture specifications. The tool creates structured documentation that guides development teams in implementing epics.

### Target Audience
- Software architects
- Engineering leads
- Development teams working on epic-level features
- Technical stakeholders requiring architectural oversight

### Expected Outcome
A comprehensive technical architecture document in Markdown format that outlines system components, technology decisions, and implementation guidelines for an epic.

---

## 2. Current Functionality Breakdown

### 2.1 Input Processing
**What it does:**
- Accepts Epic PRD as primary input
- Considers architectural patterns (domain-driven architecture)
- Applies deployment constraints (self-hosted and SaaS requirements)
- Enforces technology stack restrictions

**Complexity Level:** MEDIUM
- Multiple constraint considerations
- Required architectural pattern knowledge
- Technology stack enforcement

### 2.2 Architecture Documentation Generation

#### 2.2.1 Epic Architecture Overview
**What it does:**
- Generates brief summary of technical approach
- Synthesizes PRD into architectural vision

**Complexity Level:** LOW
- Simple text generation based on input

#### 2.2.2 System Architecture Diagram (Mermaid)
**What it does:**
- Creates comprehensive visual architecture using Mermaid syntax
- Includes 5 distinct layers:
  - User Layer (browsers, mobile apps, admin interfaces)
  - Application Layer (load balancers, app instances, better-auth)
  - Service Layer (APIs, background services, workflow engines, epic-specific services)
  - Data Layer (databases, caching, external API integrations)
  - Infrastructure Layer (Docker containerization, deployment architecture)
- Organizes layers with subgraphs
- Applies color coding for component types
- Shows data flow (synchronous and asynchronous)

**Complexity Level:** HIGH
- Complex diagram generation
- Multiple architectural layers
- Visual representation requirements
- Color coding and styling
- Data flow visualization

**Potential Issues:**
- Over-specification of diagram details
- May not scale for simple epics
- Requires deep architectural knowledge
- Mermaid syntax complexity

#### 2.2.3 High-Level Features & Technical Enablers
**What it does:**
- Lists features to be built
- Identifies technical enablers (new services, libraries, infrastructure)

**Complexity Level:** MEDIUM
- Requires feature extraction from PRD
- Needs technical enabler identification

#### 2.2.4 Technology Stack Documentation
**What it does:**
- Lists key technologies, frameworks, libraries
- Enforces restrictions (Next.js, TypeScript, App Router, better-auth)

**Complexity Level:** LOW
- Simple enumeration with constraints

#### 2.2.5 Technical Value Assessment
**What it does:**
- Estimates technical value (High/Medium/Low)
- Provides justification for estimate

**Complexity Level:** MEDIUM
- Requires evaluation criteria
- Subjective assessment

#### 2.2.6 T-Shirt Size Estimation
**What it does:**
- Provides sizing estimate (S/M/L/XL)

**Complexity Level:** LOW
- Simple categorization

### 2.3 Output Generation
**What it does:**
- Creates Markdown file
- Saves to specific path: `/docs/ways-of-work/plan/{epic-name}/arch.md`
- Structures content according to template

**Complexity Level:** LOW
- Standard file output

---

## 3. Input Requirements

### Required Inputs
1. **Epic PRD Content**
   - Full Product Requirements Document
   - Must include problem statement, solution, business requirements

### Contextual Constraints (Built-in)
2. **Architectural Pattern**
   - Domain-driven architecture (enforced)

3. **Deployment Requirements**
   - Self-hosted support (enforced)
   - SaaS deployment (enforced)

4. **Technology Stack Restrictions**
   - Next.js/TypeScript (enforced)
   - App Router pattern (enforced)
   - better-auth for authentication (enforced)
   - Docker containerization (enforced)
   - Nx monorepo patterns (enforced)

### Quality Requirements
- No code generation (pseudocode only)
- Markdown formatting
- Mermaid diagram syntax

---

## 4. Output Specification

### File Output
- **Location:** `/docs/ways-of-work/plan/{epic-name}/arch.md`
- **Format:** Markdown
- **Naming Convention:** Based on epic name

### Content Structure
```markdown
# Epic Architecture Overview
[Summary text]

# System Architecture Diagram
[Mermaid diagram with 5 layers]

# High-Level Features & Technical Enablers
- Features list
- Technical enablers list

# Technology Stack
[Technology enumeration]

# Technical Value
[High/Medium/Low with justification]

# T-Shirt Size Estimate
[S/M/L/XL]
```

---

## 5. Complexity Analysis

### High Complexity Areas

#### 5.1 System Architecture Diagram Generation
**Issues:**
- **Over-specification:** Requires 5 distinct layers for ALL epics regardless of complexity
- **Visual complexity:** Mermaid diagram with subgraphs, color coding, and flow arrows
- **Scalability concerns:** Small epics may not need this level of detail
- **Maintenance burden:** Diagrams can become outdated quickly

**Recommendation:** Consider simplification
- Make detailed diagrams optional based on epic size
- Provide templates for common patterns
- Allow simpler text-based architecture descriptions for small epics

#### 5.2 Multiple Layer Architecture Requirements
**Issues:**
- Forces 5-layer architecture even when unnecessary
- May not fit all epic types
- Creates documentation overhead

**Recommendation:**
- Make layers optional/configurable
- Allow architecture to scale with epic complexity

### Medium Complexity Areas

#### 5.3 Technical Enabler Identification
**Issues:**
- Requires deep technical knowledge
- May overlap with implementation planning
- Unclear boundaries with feature breakdown

**Recommendation:**
- Simplify to focus on new/unique enablers only
- Create checklist of common enablers

#### 5.4 Value and Size Estimation
**Issues:**
- Subjective assessments
- Requires experience and context
- May be inconsistent across different architects

**Recommendation:**
- Provide clear rubrics for estimation
- Consider removing if overlaps with other planning tools

### Low Complexity Areas (Good to Keep)

#### 5.5 Technology Stack Documentation
- Simple, useful enumeration
- Enforces consistency
- Low maintenance

#### 5.6 Feature List Generation
- Essential for planning
- Clear value
- Low overhead

---

## 6. Simplification Recommendations

### Priority 1: Reduce Diagram Complexity
**Current State:** Mandatory 5-layer Mermaid diagram for all epics

**Simplified Approach:**
```markdown
## Architecture Documentation (Tiered)

### Small Epics (S, M):
- Text-based component list
- Simple interaction diagram (optional)

### Large Epics (L, XL):
- Full Mermaid diagram with layers
- Detailed data flow
```

**Benefits:**
- Reduces overhead for simple epics
- Scales documentation with complexity
- Faster time-to-document

### Priority 2: Make Technical Enablers Optional
**Current State:** Always required

**Simplified Approach:**
- Only document if introducing NEW enablers
- Provide pre-approved enabler checklist
- Skip section if using standard stack

**Benefits:**
- Reduces redundant documentation
- Focuses on unique requirements
- Less maintenance

### Priority 3: Simplify Estimation Sections
**Current State:** Requires both technical value AND t-shirt sizing

**Simplified Approach:**
- Choose ONE estimation method
- Use t-shirt sizing only (more universal)
- Drop technical value assessment (often subjective)

**Benefits:**
- Less decision fatigue
- More consistent estimates
- Faster planning

### Priority 4: Template-Based Architecture
**Current State:** Free-form architecture description

**Simplified Approach:**
- Provide 3-4 common architecture templates
- Allow selection from templates
- Customize only when necessary

**Benefits:**
- Faster documentation
- More consistent patterns
- Easier to review

---

## 7. Recommended Scope Reduction

### Features to Remove
1. **Color coding requirements for diagrams** - Adds visual complexity without clear value
2. **Mandatory 5-layer architecture** - Forces complexity on simple epics
3. **Synchronous vs asynchronous flow distinction** - Too detailed for epic-level planning

### Features to Simplify
1. **System Architecture Diagram** → Make optional or tiered based on epic size
2. **Technical Value Assessment** → Remove or merge with t-shirt sizing
3. **Technical Enablers** → Convert to checklist with "add new if needed"

### Features to Keep (Core Value)
1. **Epic Architecture Overview** - Essential summary
2. **High-Level Features List** - Critical for planning
3. **Technology Stack Documentation** - Ensures consistency
4. **T-Shirt Size Estimate** - Useful for capacity planning

---

## 8. Implementation Complexity Score

### Current Implementation: 7/10 (High Complexity)
- Complex diagram generation: 3 points
- Multiple mandatory sections: 2 points
- Architecture pattern enforcement: 1 point
- Estimation requirements: 1 point

### Recommended Simplified Implementation: 4/10 (Medium Complexity)
- Optional/tiered diagrams: 1 point
- Core sections only: 1 point
- Template-based approach: 1 point
- Single estimation method: 1 point

**Complexity Reduction: 43%**

---

## 9. Migration Path

### Phase 1: Immediate Simplifications (Low Risk)
1. Make color coding optional
2. Remove technical value assessment (keep t-shirt sizing)
3. Make diagram layers configurable

### Phase 2: Template Introduction (Medium Risk)
1. Create 3 architecture templates (microservices, monolith, hybrid)
2. Allow template selection
3. Document customization guidelines

### Phase 3: Tiered Documentation (Higher Risk)
1. Implement size-based requirements
2. Small epics: minimal documentation
3. Large epics: full documentation

---

## 10. Success Metrics for Simplification

### Quantitative Metrics
- **Time to create arch spec:** Target 50% reduction (from ~2 hours to ~1 hour)
- **Document size:** Target 30% reduction for simple epics
- **Review time:** Target 40% reduction

### Qualitative Metrics
- **Developer satisfaction:** Survey on documentation usefulness
- **Completeness:** No loss of critical architectural information
- **Consistency:** Improved pattern reuse across epics

---

## 11. Risk Assessment

### Risks of Current Complexity
1. **Over-documentation fatigue** - Teams may skip or rush documentation
2. **Inconsistent quality** - Complex requirements lead to varied compliance
3. **Maintenance burden** - Detailed diagrams become outdated
4. **Slows velocity** - Time spent on documentation vs implementation

### Risks of Simplification
1. **Under-documentation** - May lose important architectural context
2. **Quality variation** - Simpler docs might lack necessary detail
3. **Migration effort** - Updating existing documentation

**Mitigation:** Phased approach with feedback loops and clear guidelines for when to use detailed vs. simplified documentation.
