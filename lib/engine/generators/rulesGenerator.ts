import { ProjectConfig } from '../types';
import { composeProjectSpec } from '../composer';
import { DESIGN_VIBE_SPECS } from '../dictionaries/designVibeSpecs';

export function generateCursorRules(config: ProjectConfig): string {
  const { techStack, designVibe } = config;
  const spec = composeProjectSpec(config);
  const { appName, detectedModules, tables, securityNotes } = spec;

  const vibeName = designVibe || 'Modern IDE Dark (Zinc & Indigo)';
  const vibe = DESIGN_VIBE_SPECS[vibeName] || DESIGN_VIBE_SPECS['Modern IDE Dark (Zinc & Indigo)'];

  return `# Cursor Agent Rules for ${appName}

## Project Directives & Identity
- **Project Name**: ${appName}
- **Tech Stack**: ${techStack.join(', ') || 'Next.js 14, TypeScript, Tailwind CSS, PostgreSQL'}
- **Visual Vibe**: ${vibe.name} (${vibe.direction})
- **Feature Modules**: ${detectedModules.map(m => m.name).join(', ') || 'Base platform'}
- **Database Tables**: ${tables.map(t => t.name).join(', ')}

## Strict Coding & Architecture Guardrails
1. **100% Strict TypeScript**: Never output \`any\` or un-typed parameters. Define explicit interfaces for all data models.
2. **Strict Design Token Adherence**: Use predefined color tokens (\`${vibe.colors[0]?.tailwind}\`, \`${vibe.colors[1]?.tailwind}\`, \`${vibe.colors[6]?.tailwind}\`) and NEVER invent random custom utility colors.
3. **Pure Functional Core**: Core business algorithms must be pure, side-effect free TypeScript functions in \`lib/\`.
4. **No Artificial Placeholders**: Never leave \`// TODO\` or dummy mock handlers in production code paths.
5. **Zero Mandatory API Keys**: Maintain client-side local caching resilience without breaking on network disconnects.

## Database Schema Awareness
${tables.map(t => `- **${t.name}**: ${t.description} (${t.columns.length} columns)`).join('\n')}

## Security Rules
${securityNotes.length > 0 ? securityNotes.map(s => `- ${s}`).join('\n') : '- Hash all passwords with Argon2id or Bcrypt.\n- Validate all user inputs with Zod schemas.\n- Never expose sensitive data in client bundles.'}
`;
}

export function generateMegaPrompt(config: ProjectConfig): string {
  const { techStack, dbEngine, designVibe } = config;
  const spec = composeProjectSpec(config);
  const { appName, appDescription, appTypeSpec, detectedModules, tables, requirements, goals, userFlowSteps, securityNotes, apiEndpoints, uiPages, kpis } = spec;

  const vibeName = designVibe || 'Modern IDE Dark (Zinc & Indigo)';
  const vibe = DESIGN_VIBE_SPECS[vibeName] || DESIGN_VIBE_SPECS['Modern IDE Dark (Zinc & Indigo)'];

  const moduleCount = detectedModules.length;
  const tableCount = tables.length;
  const requirementCount = requirements.length;
  const endpointCount = apiEndpoints.length;

  return `================================================================================
🚀 SEKALI JALAN MASTER EXECUTION PROMPT: ${appName.toUpperCase()}
================================================================================

[ACT AS A SENIOR PRINCIPAL ARCHITECT & FULL-STACK LEAD DEVELOPER]

You are tasked with building a high-performance, production-ready web application called "${appName}" in ONE SHOT ("Sekali Jalan").

System Complexity: ${moduleCount} feature modules → ${tableCount} database tables → ${requirementCount} requirements → ${endpointCount} API endpoints.

--------------------------------------------------------------------------------
1. PROJECT CONTEXT & VISION
--------------------------------------------------------------------------------
- Product Name: ${appName}
- Application Type: ${appTypeSpec.name}
- Vision & Purpose: ${appDescription}
- Core Tech Stack: ${techStack.join(', ') || 'Next.js 14+, TypeScript, Tailwind CSS, PostgreSQL'}
- Primary Database Engine: ${dbEngine || 'PostgreSQL'}
- Visual Theme Direction: ${vibe.name} (${vibe.direction})

--------------------------------------------------------------------------------
2. FEATURE MODULES & SCOPE (${moduleCount} MODULES)
--------------------------------------------------------------------------------
${detectedModules.map((m, i) => `
### Module ${i + 1}: ${m.name}
- **Tables**: ${m.tables.map(t => t.name).join(', ')}
- **Requirements**: ${m.requirements.map(r => r.feature).join(', ')}
- **API Endpoints**: ${m.apiEndpoints.length} endpoints
- **UI Pages**: ${m.uiPages.join(', ')}
`).join('')}

--------------------------------------------------------------------------------
3. DATABASE SCHEMA BLUEPRINT (${tableCount} TABLES)
--------------------------------------------------------------------------------
${tables.map(t => `
**${t.name}** (${t.description}):
${t.columns.map(c => `  - ${c.name}: ${c.type}${c.key ? ` [${c.key}]` : ''}${c.nullable ? '' : ' NOT NULL'}${c.defaultVal ? ` DEFAULT ${c.defaultVal}` : ''}`).join('\n')}
`).join('\n')}

--------------------------------------------------------------------------------
4. FUNCTIONAL REQUIREMENTS (${requirementCount} ITEMS)
--------------------------------------------------------------------------------
${requirements.map((r, i) => `
${i + 1}. **${r.feature}**: ${r.description}
   User Story: "${r.userStory}"
   Acceptance:
${r.acceptanceCriteria.map(ac => `   - [ ] ${ac}`).join('\n')}
`).join('\n')}

--------------------------------------------------------------------------------
5. GOALS & KPIs
--------------------------------------------------------------------------------
Goals:
${goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

KPI Targets:
${kpis.map(k => `- ${k}`).join('\n')}

--------------------------------------------------------------------------------
6. USER FLOW STEPS
--------------------------------------------------------------------------------
${userFlowSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

${apiEndpoints.length > 0 ? `--------------------------------------------------------------------------------
7. API ENDPOINT BLUEPRINT (${endpointCount} ENDPOINTS)
--------------------------------------------------------------------------------
${apiEndpoints.map(e => `- \`${e}\``).join('\n')}
` : ''}

${uiPages.length > 0 ? `--------------------------------------------------------------------------------
8. UI PAGES & SCREENS
--------------------------------------------------------------------------------
${uiPages.map(p => `- ${p}`).join('\n')}
` : ''}

--------------------------------------------------------------------------------
9. DESIGN SYSTEM TOKENS
--------------------------------------------------------------------------------
- App Background: ${vibe.colors[0]?.tailwind} (${vibe.colors[0]?.hex})
- Card Surface: ${vibe.colors[1]?.tailwind} (${vibe.colors[1]?.hex})
- Element Surface: ${vibe.colors[2]?.tailwind} (${vibe.colors[2]?.hex})
- Border Main: ${vibe.colors[3]?.tailwind} (${vibe.colors[3]?.hex})
- Primary CTA Button: ${vibe.colors[6]?.tailwind} (${vibe.colors[6]?.hex})
- Typography Stack: ${vibe.fontFamily.ui} / Code: ${vibe.fontFamily.code}

--------------------------------------------------------------------------------
10. STEP-BY-STEP IMPLEMENTATION ROADMAP (SEKALI JALAN)
--------------------------------------------------------------------------------

PHASE 1: FOUNDATION & DATA TYPES SETUP
1. Set up strict TypeScript interfaces in \`lib/types.ts\` for all core entities (${tables.map(t => t.name).join(', ')}).
2. Create database schema with ${tableCount} tables using ${dbEngine || 'PostgreSQL'} + ${techStack.includes('Prisma ORM') ? 'Prisma' : 'Drizzle ORM'}.
3. Create state management store in \`lib/store/\` using Zustand with persistence middleware.

PHASE 2: DESIGN SYSTEM & COMPONENT LIBRARY
1. Configure Tailwind CSS tokens to match \`${vibe.name}\`.
2. Build reusable UI components in \`components/ui/\`:
   - \`Button.tsx\` (Primary, Secondary, Outline, Danger variants)
   - \`Card.tsx\` (Surface container with proper borders)
   - \`Badge.tsx\` (Status indicators)
   - \`Modal.tsx\` (Confirmation and form modals)
3. Build layout components in \`components/layout/\` (\`Navbar.tsx\`, \`Footer.tsx\`, \`Sidebar.tsx\`).

PHASE 3: FEATURE MODULE IMPLEMENTATION
${detectedModules.map((m, i) => `${i + 1}. **${m.name}**: Implement ${m.requirements.map(r => r.feature).join(', ')}. Build pages: ${m.uiPages.join(', ')}.`).join('\n')}

PHASE 4: POLISH & VERIFICATION
1. Verify 100% strict TypeScript compliance (ZERO \`any\` types permitted).
2. Run ESLint checks and resolve all warnings.
3. End-to-end test all ${requirementCount} functional requirements.
4. Performance audit: all pages load under 3 seconds.

--------------------------------------------------------------------------------
11. STRICT GUARDRAILS & ANTI-HALLUCINATION RULES
--------------------------------------------------------------------------------
- RULE 1: Never output \`any\` types. Write complete, robust interfaces.
- RULE 2: Stick strictly to the \`${vibe.name}\` color tokens. Do NOT invent random colors.
- RULE 3: Do NOT output placeholder code or \`// TODO\` stubs. Write full working logic.
- RULE 4: Ensure all interactive buttons have hover, active click, and disabled states.
- RULE 5: All database queries MUST include proper error handling and transaction management.

${securityNotes.length > 0 ? `
--------------------------------------------------------------------------------
12. SECURITY REQUIREMENTS
--------------------------------------------------------------------------------
${securityNotes.map(s => `- ${s}`).join('\n')}
` : ''}

START EXECUTION NOW AND BUILD THE COMPLETE APPLICATION STEP-BY-STEP!
================================================================================
`;
}
