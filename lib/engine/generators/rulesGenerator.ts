import { ProjectConfig } from '../types';
import { APP_TYPE_SPECS } from '../dictionaries/appTypeSpecs';
import { DESIGN_VIBE_SPECS } from '../dictionaries/designVibeSpecs';

export function generateCursorRules(config: ProjectConfig): string {
  const { projectName, techStack, designVibe } = config;
  const appName = projectName || 'DevContext Project';
  const vibeName = designVibe || 'Modern IDE Dark (Zinc & Indigo)';
  const vibe = DESIGN_VIBE_SPECS[vibeName] || DESIGN_VIBE_SPECS['Modern IDE Dark (Zinc & Indigo)'];

  return `# Cursor Agent Rules for ${appName}

## Project Directives & Identity
- **Project Name**: ${appName}
- **Tech Stack**: ${techStack.join(', ') || 'Next.js 14, TypeScript, Tailwind CSS, PostgreSQL'}
- **Visual Vibe**: ${vibe.name} (${vibe.direction})

## Strict Coding & Architecture Guardrails
1. **100% Strict TypeScript**: Never output \`any\` or un-typed parameters. Define explicit interfaces for all data models.
2. **Strict Design Token Adherence**: Use predefined color tokens (\`${vibe.colors[0]?.tailwind}\`, \`${vibe.colors[1]?.tailwind}\`, \`${vibe.colors[6]?.tailwind}\`) and NEVER invent random custom utility colors.
3. **Pure Functional Core**: Core business algorithms must be pure, side-effect free TypeScript functions in \`lib/\`.
4. **No Artificial Placeholders**: Never leave \`// TODO\` or dummy mock handlers in production code paths.
5. **Zero Mandatory API Keys**: Maintain client-side local caching resilience without breaking on network disconnects.
`;
}

export function generateMegaPrompt(config: ProjectConfig): string {
  const { projectName, description, appType, techStack, features, dbEngine, designVibe } = config;
  const appSpec = APP_TYPE_SPECS[appType] || APP_TYPE_SPECS.saas;
  const vibeName = designVibe || 'Modern IDE Dark (Zinc & Indigo)';
  const vibe = DESIGN_VIBE_SPECS[vibeName] || DESIGN_VIBE_SPECS['Modern IDE Dark (Zinc & Indigo)'];

  const appName = projectName || 'DevContext Application';
  const appDesc = description || appSpec.summary;
  const featureList = features.length > 0 ? features : appSpec.inScope;

  return `================================================================================
🚀 SEKALI JALAN MASTER EXECUTION PROMPT: ${appName.toUpperCase()}
================================================================================

[ACT AS A SENIOR PRINCIPAL ARCHITECT & FULL-STACK LEAD DEVELOPER]

You are tasked with building a high-performance, production-ready web application called "${appName}" in ONE SHOT ("Sekali Jalan").

--------------------------------------------------------------------------------
1. PROJECT CONTEXT & VISION
--------------------------------------------------------------------------------
- Product Name: ${appName}
- Application Type: ${appSpec.name}
- Vision & Purpose: ${appDesc}
- Core Tech Stack: ${techStack.join(', ') || 'Next.js 14+, TypeScript, Tailwind CSS, PostgreSQL'}
- Primary Database Engine: ${dbEngine || 'PostgreSQL'}
- Visual Theme Direction: ${vibe.name} (${vibe.direction})

--------------------------------------------------------------------------------
2. KEY FEATURES & SCOPE BOUNDARIES (IN-SCOPE)
--------------------------------------------------------------------------------
${featureList.map((f, i) => `${i + 1}. ${f}: Implement core functionality with clean user interaction.`).join('\n')}

--------------------------------------------------------------------------------
3. EMBEDDED TRINITY BLUEPRINT CONTEXT
--------------------------------------------------------------------------------

[PRD HIGHLIGHTS]
- Target Persona: ${appSpec.targetUsers[0]?.role} (${appSpec.targetUsers[0]?.need})
- Problem Solved: ${appSpec.problemStatement}
- Key KPI Target: ${appSpec.kpis[0]}

[DATABASE HIGHLIGHTS]
- Primary Tables: ${appSpec.tables.map(t => t.name).join(', ')}
- ERD Relationship: ${appSpec.tables[0]?.name} -> ${appSpec.tables[1]?.name || 'workspaces'}
- SQL Dialect: ${dbEngine || 'PostgreSQL'}

[DESIGN SYSTEM TOKENS]
- App Background: ${vibe.colors[0]?.tailwind} (${vibe.colors[0]?.hex})
- Card Surface: ${vibe.colors[1]?.tailwind} (${vibe.colors[1]?.hex})
- Element Surface: ${vibe.colors[2]?.tailwind} (${vibe.colors[2]?.hex})
- Border Main: ${vibe.colors[3]?.tailwind} (${vibe.colors[3]?.hex})
- Primary CTA Button: ${vibe.colors[6]?.tailwind} (${vibe.colors[6]?.hex})
- Typography Stack: ${vibe.fontFamily.ui} / Code: ${vibe.fontFamily.code}

--------------------------------------------------------------------------------
4. STEP-BY-STEP 4-PHASE IMPLEMENTATION ROADMAP (SEKALI JALAN)
--------------------------------------------------------------------------------

PHASE 1: FOUNDATION & DATA TYPES SETUP
1. Set up strict TypeScript interfaces in \`lib/types.ts\` for all core entities (${appSpec.tables.map(t => t.name).join(', ')}).
2. Create state management store in \`lib/store/\` using Zustand with persistence middleware.
3. Build pure business logic engine helpers in \`lib/engine/\`.

PHASE 2: DESIGN SYSTEM & COMPONENT LIBRARY
1. Configure Tailwind CSS tokens to match \`${vibe.name}\`.
2. Build reusable UI components in \`components/ui/\`:
   - \`Button.tsx\` (Primary, Secondary, Outline, Danger variants with loading & active states)
   - \`Card.tsx\` (High-density dark IDE card container)
   - \`Badge.tsx\` (Status badge indicators)
3. Build layout components in \`components/layout/\` (\`Navbar.tsx\`, \`Footer.tsx\`).

PHASE 3: FEATURE FORMS & WORKSPACE INTERFACE
1. Implement input forms with React Hook Form & Zod schema validation.
2. Build interactive split-screen workspace with File Tree Explorer and Content Viewer.
3. Integrate Mermaid.js dynamic diagram renderer.

PHASE 4: POLISH & VERIFICATION
1. Verify 100% strict TypeScript compliance (ZERO \`any\` types permitted).
2. Run ESLint checks and resolve all warnings.
3. Test client-side ZIP export utility.

--------------------------------------------------------------------------------
5. STRICT GUARDRAILS & ANTI-HALLUCINATION RULES
--------------------------------------------------------------------------------
- RULE 1: Never output \`any\` types. Write complete, robust interfaces.
- RULE 2: Stick strictly to the \`${vibe.name}\` color tokens.
- RULE 3: Do NOT output placeholder code or \`// TODO\` stubs. Write full working logic.
- RULE 4: Ensure all interactive buttons have hover, active click, and disabled states.

START EXECUTION NOW AND BUILD THE COMPLETE APPLICATION STEP-BY-STEP!
================================================================================
`;
}
