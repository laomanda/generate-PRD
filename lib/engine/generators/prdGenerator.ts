import { ProjectConfig } from '../types';
import { composeProjectSpec } from '../composer';

export function generatePRD(config: ProjectConfig): string {
  const { techStack } = config;
  const spec = composeProjectSpec(config);
  const { appName, appDescription, appTypeSpec, detectedModules, requirements, goals, targetUsers, inScope, outOfScope, userFlowSteps, kpis, securityNotes, apiEndpoints, uiPages } = spec;

  const moduleCount = detectedModules.length;
  const tableCount = spec.tables.length;
  const cleanAppName = appName.replace(/"/g, "'");

  return `# 📋 PRODUCT REQUIREMENT DOCUMENT (PRD)

> **Document Status**: APPROVED & ACTIVE  
> **Target Product**: **${appName}**  
> **Application Type**: **${appTypeSpec.name}**  
> **Detected Feature Modules**: **${moduleCount}** modules → **${tableCount}** database tables → **${requirements.length}** functional requirements  
> **Core Formula**: \`PRD = Why → Who → What → How → Done When → How to Measure\`

---

## 1. Product Overview
- **Product Name**: ${appName}
- **Category**: ${appTypeSpec.name}
- **Context & Vision**: ${appDescription}
- **Core Technology Stack**: ${techStack.join(', ') || 'Next.js 14, TypeScript, Tailwind CSS, PostgreSQL'}
- **Feature Scope**: ${detectedModules.map(m => m.name).join(', ') || 'Base platform features'}

---

## 2. Problem Statement
${spec.problemStatement}

---

## 3. Goals & Objectives
${goals.map((g, i) => `${i + 1}. **${g}**`).join('\n')}

---

## 4. Target Users
${targetUsers.map(u => `- **${u.role}**: ${u.need}`).join('\n')}

---

## 5. Scope Boundaries

### 🟢 In Scope (MVP Release)
${inScope.map(f => `- **${f}**`).join('\n')}

### 🔴 Out of Scope (Future Roadmap)
${outOfScope.map(f => `- ${f}`).join('\n')}

---

## 6. Functional Requirements ⭐
${requirements.map((fr, idx) => `
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
    Start["User Visits ${cleanAppName}"] --> Auth["Authentication & Onboarding"]
    Auth --> Dashboard["Main Dashboard / Home"]
${detectedModules.slice(0, 4).map((m, i) => `    Dashboard --> Feature${i}["${m.name.replace(/"/g, "'")}"]`).join('\n')}
${detectedModules.length > 0 ? `    ${detectedModules.slice(0, 4).map((_, i) => `Feature${i}`).pop()} --> Success["Task Complete & Feedback"]` : '    Dashboard --> Success["Task Complete & Feedback"]'}
\`\`\`

### Step-by-Step Flow:
${userFlowSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---

## 8. UI/UX Requirements
- **Design Aesthetic**: ${config.designVibe || 'Modern high-density interface'}.
- **Responsive Guidelines**:
  - **Mobile (<768px)**: Single column stacked cards with collapsible drawer menus.
  - **Tablet (768px - 1024px)**: 2-column responsive layout with toggleable sidebars.
  - **Desktop (>1024px)**: Fixed sidebar with split-screen workspace content panels.
${uiPages.length > 0 ? `
### Required Pages & Screens:
${uiPages.map(p => `- **${p}**`).join('\n')}
` : ''}

---

## 9. Non-Functional Requirements (NFR)
- **Performance**: Sub-100ms client reactivity, <500ms API response latency for 95th percentile.
- **Security**:
${securityNotes.length > 0 ? securityNotes.map(s => `  - ${s}`).join('\n') : '  - Zero plaintext credential storage.\n  - Strict input validation on all user-facing endpoints.\n  - HTTPS enforced in all environments.'}
- **Maintainability**: Modular functional codebase with 100% strict TypeScript types (zero \`any\` types permitted).
- **Accessibility (a11y)**: High contrast ratio (>4.5:1), visible keyboard focus rings, semantic HTML5 tags.

---

## 10. Acceptance Criteria ⭐ (Definition of Done)
- [ ] All ${requirements.length} functional requirements implemented and tested.
- [ ] All ${tableCount} database tables created with proper constraints and indexes.
- [ ] Zero blocking linter warnings or TypeScript type errors on production build.
- [ ] All user stories have verified functional test cases and visual state confirmation.
- [ ] Single-click ZIP export bundles all generated project documentation seamlessly.

---

## 11. Technical Requirements & Constraints
- **Core Tech Stack**: ${techStack.join(', ') || 'Not specified'}
- **Runtime Environment**: Node.js >= 20.0.0 LTS / Modern Browser Engine.
- **Architecture Directive**: Modular, testable, type-safe codebase with clear separation of concerns.
${apiEndpoints.length > 0 ? `
### API Endpoint Blueprint:
${apiEndpoints.map(e => `- \`${e}\``).join('\n')}
` : ''}

---

## 12. Success Metrics / KPI
${kpis.map(kpi => `- **${kpi}**`).join('\n')}

---

## 13. Timeline & Milestones
- **Phase 1 (Sprint 1-2)**: Core architecture setup, database schema, authentication${detectedModules.some(m => m.id === 'auth') ? ' & session management' : ''}.
- **Phase 2 (Sprint 3-4)**: ${detectedModules.slice(0, 3).map(m => m.name).join(', ') || 'Primary feature implementation'}.
- **Phase 3 (Sprint 5-6)**: ${detectedModules.slice(3).map(m => m.name).join(', ') || 'Polish, testing, and optimization'}.
- **Phase 4 (Sprint 7-8)**: End-to-end testing, performance optimization, staging deployment, and launch.

---

## 14. Risks & Dependencies
- **Database Schema Complexity**: ${tableCount} tables require careful migration planning and relationship integrity checks.
- **Third-Party Integration Failures**: External payment/email services; mitigated by webhook retry mechanisms and fallback error handling.
- **Feature Scope Creep**: ${moduleCount} feature modules; mitigated by strict scope boundaries defined in Section 5.
`;
}
