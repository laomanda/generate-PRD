import { ProjectConfig } from '../types';
import { composeProjectSpec } from '../composer';

export function generateArchitecture(config: ProjectConfig): string {
  const { techStack, dbEngine } = config;
  const spec = composeProjectSpec(config);
  const { appName, tables, apiEndpoints, uiPages, detectedModules } = spec;

  const appSlug = appName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const engineName = dbEngine || 'PostgreSQL';
  const cleanAppName = appName.replace(/"/g, "'");

  return `# 🏗️ SYSTEM ARCHITECTURE DOCUMENT

> **Single Source of Truth Architectural Blueprint**  
> **Target Product**: **${appName}**  
> **Primary Database**: **${engineName}**  
> **Domain Scope**: ${detectedModules.map(m => m.name).join(', ') || 'Custom Application'}  
> **Architecture Pattern**: Client-First Modular Monorepo / Feature-Oriented Directory Architecture

---

## 1. High-Level System Architecture

The **${appName}** system is designed for high reliability, strict type safety, and sub-second user responsiveness.

\`\`\`mermaid
graph TD
    UserClient["Browser / Mobile Client UI"]
    StateStore["Zustand Client State Store"]
    APIHandlers["Next.js Route Handlers / API Layer"]
    DatabaseEngine["${engineName.replace(/"/g, "'")} Database Cluster"]
${tables.slice(0, 4).map((t, i) => `    DatabaseEngine --> Table${i}["${t.name.replace(/"/g, "'")} Table"]`).join('\n')}

    UserClient --> StateStore
    StateStore --> APIHandlers
    APIHandlers --> DatabaseEngine
\`\`\`

---

## 2. Technology Stack Layering

${techStack.map(tech => `- **${tech}**: Fundamental system layer component for ${appName}.`).join('\n') || '- **TypeScript**: Static typing & contract verification.'}
- **Database Engine**: ${engineName} (${tables.length} schema tables defined).

---

## 3. Domain Directory Layout Pattern

\`\`\`text
${appSlug}/
├── app/                        # Application routes and page views
${uiPages.slice(0, 6).map(p => `│   ├── ${(p.toLowerCase().replace(/[^a-z0-9]/g, '-'))}/           # Page view for ${p}`).join('\n')}
│   └── api/                    # Serverless route handlers (${apiEndpoints.length} endpoints)
├── components/                 # Reusable UI & layout components
│   ├── ui/                     # Atomic design system components (Button, Card, Badge)
│   └── ${appSlug}/             # Domain-specific UI features
├── lib/                        # Core domain logic & data access
│   ├── engine/                 # Domain rule evaluation engine
│   ├── store/                  # Client state store
│   └── types.ts                # Strict TypeScript model definitions
└── prisma/ or drizzle/         # Database migrations (${tables.length} tables)
\`\`\`

---

## 4. End-to-End Data Flow Architecture

### Primary User Workflow:
1. **Client Interaction**: User triggers action on **${uiPages[0] || `${cleanAppName} Dashboard`}**.
2. **State Store Mutation**: Event updates Zustand state store with optimistic UI update (<16ms).
3. **API Processing**: Client dispatches payload to \`${apiEndpoints[0] || '/api/data'}\`.
4. **Database Persistence**: Backend executes parameterized SQL query against \`${tables[0]?.name || 'entity'}\` table in ${engineName}.
5. **Confirmation**: Server responds with JSON payload → Client store syncs final state.

---

## 5. Architectural Directives & Guardrails
- **Single Source of Truth**: State flows unidirectionally from central stores to UI subscribers.
- **Strict Data Isolation**: All database queries for \`${tables[0]?.name || 'records'}\` enforce strict boundary checks.
- **Type Safety**: 100% strict TypeScript types shared between client UI and API route handlers.
- **Zero Hallucinated Fallbacks**: All network errors must trigger explicit error boundary UI notifications.
`;
}
