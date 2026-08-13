import { ProjectConfig } from '../types';
import { APP_TYPE_SPECS } from '../dictionaries/appTypeSpecs';

export function generatePRD(config: ProjectConfig): string {
  const { projectName, appType, description, features, techStack } = config;
  const spec = APP_TYPE_SPECS[appType] || APP_TYPE_SPECS.saas;

  const appName = projectName || 'DevContext Application';
  const appDesc = description || spec.summary;
  const inScopeList = features.length > 0 ? features : spec.inScope;

  return `# 📋 PRODUCT REQUIREMENT DOCUMENT (PRD)

> **Document Status**: APPROVED & ACTIVE  
> **Target Product**: **${appName}**  
> **Application Type**: **${spec.name}**  
> **Core Formula**: \`PRD = Why → Who → What → How → Done When → How to Measure\`

---

## 1. Product Overview
- **Product Name**: ${appName}
- **Category**: ${spec.name}
- **Context & Vision**: ${appDesc}
- **Core Technology Stack**: ${techStack.join(', ') || 'Next.js 14, TypeScript, Tailwind CSS, PostgreSQL'}

---

## 2. Problem Statement
${spec.problemStatement}
- **Core Pain Point**: Developers and engineering teams waste excessive time debugging inconsistent feature boundaries, hallucinated AI code snippets, and undocumented business logic.
- **Solution Strategy**: Implement a deterministic, highly modular architecture built strictly against type-safe specifications.

---

## 3. Goals & Objectives
${spec.goals.map((g, i) => `${i + 1}. **${g}**`).join('\n')}

---

## 4. Target Users
${spec.targetUsers.map(u => `- **${u.role}**: ${u.need}`).join('\n')}

---

## 5. Scope Boundaries

### 🟢 In Scope (MVP Release)
${inScopeList.map(f => `- **${f}**: Core functional requirement for initial product deployment.`).join('\n')}

### 🔴 Out of Scope (Future Roadmap)
${spec.outOfScope.map(f => `- **${f}**: Explicitly excluded from MVP build to maintain focus on core delivery.`).join('\n')}

---

## 6. Functional Requirements ⭐
${spec.functionalRequirements.map((fr, idx) => `
### 6.${idx + 1} Feature: ${fr.feature}
- **Specification**: ${fr.description}
- **User Story**: *"${fr.userStory}"*
- **Acceptance Criteria**:
${fr.acceptanceCriteria.map(ac => `  - [ ] ${ac}`).join('\n')}
`).join('\n')}

---

## 7. User Flow / User Stories ⭐

\`\`\`mermaid
graph TD
    Start["User Visits App Landing / Entry"] --> Auth["Authentication & Onboarding"]
    Auth --> Dashboard["Main Workspace Dashboard"]
    Dashboard --> CoreAction["Executes Primary Feature Task"]
    CoreAction --> StateSave["Client & Database State Sync"]
    StateSave --> Success["Receives Instant Feedback & Confirmation"]
\`\`\`

### Step-by-Step Flow:
${spec.userFlow.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---

## 8. UI/UX Requirements
- **Design Aesthetic**: Modern high-density IDE-inspired interface.
- **Theme**: Dark Mode First layout with crisp panel borders and high-contrast typography.
- **Responsive Guidelines**:
  - **Mobile (<768px)**: Single column stacked cards with collapsible drawer menus.
  - **Tablet (768px - 1024px)**: 2-column responsive layout with toggleable sidebars.
  - **Desktop (>1024px)**: Fixed Explorer sidebar with split-screen workspace content panels.

---

## 9. Non-Functional Requirements (NFR)
- **Performance**: Sub-100ms client reactivity, <0.01s architecture engine generation latency.
- **Security**: Zero server-side API key logging, local storage data isolation, strict Zod schema validation.
- **Maintainability**: Modular functional codebase with 100% strict TypeScript types (zero \`any\` types permitted).
- **Accessibility (a11y)**: High contrast ratio (>4.5:1), visible keyboard focus rings, semantic HTML5 tags.

---

## 10. Acceptance Criteria ⭐ (Definition of Done)
- [ ] All 14 PRD sections are fully documented and integrated into developer workflows.
- [ ] Zero blocking linter warnings or TypeScript type errors on production build.
- [ ] All user stories have verified functional test cases and visual state confirmation.
- [ ] Single-click ZIP export bundles all generated project documentation seamlessly.

---

## 11. Technical Requirements & Constraints
- **Core Tech Stack**: ${techStack.join(', ')}
- **Runtime Environment**: Node.js >= 20.0.0 LTS / Modern Browser Engine.
- **Architecture Directive**: Pure client-side functional core with zero mandatory external API keys.

---

## 12. Success Metrics / KPI
${spec.kpis.map(kpi => `- **${kpi}**: Primary product health indicator.`).join('\n')}

---

## 13. Timeline & Milestones
- **Phase 1 (Sprint 1)**: Core architecture setup, TypeScript type definitions, & design tokens setup.
- **Phase 2 (Sprint 2)**: Layout building, component library construction, & form wizard integration.
- **Phase 3 (Sprint 3)**: State management store wiring & generator engine integration.
- **Phase 4 (Sprint 4)**: End-to-end testing, static build optimization, and launch.

---

## 14. Risks & Dependencies
- **Browser Storage Quotas**: Dependency on local browser \`localStorage\` limits; mitigated by clean state pruning.
- **Third-Party Script Failures**: External diagram libraries (Mermaid); mitigated by fallback raw text rendering.
`;
}
