import { ProjectConfig } from '../types';
import { TECH_STACK_DATABASE, CORE_VERSION_COMPATIBILITY } from '../dictionaries/techStackSpecs';

export function generateTechStack(config: ProjectConfig): string {
  const { projectName, techStack, dbEngine } = config;
  const appName = projectName || 'DevContext Application';

  const selectedTechs = techStack.map(t => TECH_STACK_DATABASE[t] || {
    name: t,
    version: 'Latest',
    category: 'tooling',
    purpose: 'Core architectural dependency component.',
    rationale: 'Provides essential functionality for modern web application workflows.',
  });

  return `# 🛠️ TECH STACK DOCUMENTATION

> **Single Source of Truth Technology & Library Specification**  
> **Target Product**: **${appName}**  
> **Primary Database**: **${dbEngine || 'PostgreSQL'}**  
> **Package Manifest Note**: *This document explains why and how dependencies are utilized. \`package.json\` remains the exact runtime manifest.*

---

## 1. Tech Stack Overview ⭐
- **Frontend Framework**: Next.js 14+ (App Router) / React 19
- **Styling Utility**: Tailwind CSS v4
- **State Management**: Zustand v5
- **Database Engine**: ${dbEngine || 'PostgreSQL'}
- **Deployment Platform**: Vercel / Cloudflare Static Pages

---

## 2. Runtime & Core Framework ⭐
- **Node.js Engine**: \`>= 20.10.0 LTS\`
- **Package Manager**: \`npm\` / \`pnpm\` / \`bun\`
- **Core UI Framework**: \`Next.js 16.3.0\` with \`React 19.2.8\`
- **Language Dialect**: \`TypeScript 5.x\` (Strict Mode)

---

## 3. Frontend Stack ⭐
- **Rendering Engine**: React Server Components & Client Component State Trees.
- **Styling Pipeline**: PostCSS Tailwind CSS v4 compilation.
- **Icon Library**: Lucide React (\`lucide-react\`).

---

## 4. Libraries & Packages ⭐

| Category | Package Name | Version | Primary Purpose |
| :--- | :--- | :--- | :--- |
${selectedTechs.map(t => `| **${t.category.toUpperCase()}** | \`${t.name}\` | \`${t.version}\` | ${t.purpose} |`).join('\n')}
| **UI** | \`lucide-react\` | \`^1.31.0\` | Modern pixel-perfect SVG iconography |
| **DIAGRAM** | \`mermaid\` | \`^11.16.1\` | Dynamic text-to-diagram ERD rendering |
| **EXPORTER** | \`jszip\` & \`file-saver\` | \`^3.10.1\` | Browser-native client-side ZIP packaging |
| **FORM** | \`react-hook-form\` & \`zod\` | \`^7.85.0\` | Type-safe schema input validation |

---

## 5. Backend Stack
- **API Paradigm**: Next.js Route Handlers / Client-First Pure Functional Engine.
- **Server Execution**: Serverless Edge Functions / Pure Browser Engine.

---

## 6. Database Technology
- **DBMS Dialect**: \`${dbEngine || 'PostgreSQL'}\`
- **ORM / Query Builder**: Prisma / Drizzle ORM
- **Migration Pipeline**: Code-first migration versioning

---

## 7. Authentication & Authorization
- **Auth Pattern**: JWT Bearer Tokens / Session Cookies.
- **Role-Based Access Control (RBAC)**: Owner, Admin, Member, Viewer permissions.

---

## 8. API & External Integrations
- **Zero Third-Party Dependency**: Core rule engine executes locally in browser client runtime.

---

## 9. Development Tools
- **Code Editor**: VS Code / Cursor / Windsurf.
- **Version Control**: Git & GitHub.
- **Linter & Formatter**: ESLint v9 & TypeScript Compiler (\`tsc\`).

---

## 10. Testing Stack
- **Unit & Integration Testing**: Vitest / Jest.
- **End-to-End Testing**: Playwright test runner.

---

## 11. Code Quality & Standards
- **Strict Typing**: \`noImplicitAny: true\`, \`strictNullChecks: true\`.
- **Linting Standard**: \`eslint-config-next\` ruleset.

---

## 12. Deployment & Infrastructure ⭐
- **Frontend Hosting**: Vercel Edge Network / Cloudflare Pages.
- **Database Cloud**: Managed Cloud Database (Supabase / Neon / PlanetScale).

---

## 13. Version Compatibility ⭐
| Requirement | Constraint Version | Rationale |
| :--- | :--- | :--- |
${CORE_VERSION_COMPATIBILITY.map(c => `| **${c.requirement}** | \`${c.constraint}\` | ${c.rationale} |`).join('\n')}

---

## 14. Environment Variables
\`\`\`env
# Environment Variable Blueprint (.env.example)
NEXT_PUBLIC_APP_NAME="${appName}"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

---

## 15. Architecture Data Flow
\`\`\`mermaid
graph LR
    ClientUI["React 19 UI Component"] --> Store["Zustand State Store"]
    Store --> PureEngine["Pure TypeScript Rule Engine"]
    PureEngine --> ExportZip["JSZip Client Downloader"]
\`\`\`

---

## 16. Technology Decisions & Rationale ⭐
${selectedTechs.map(t => `
### 16.${t.name}
- **Selected Version**: \`${t.version}\`
- **Technical Rationale**: ${t.rationale}
`).join('\n')}

---

## 17. Tech Stack Changelog
| Date | Action | Component | Description |
| :--- | :--- | :--- | :--- |
| ${new Date().toISOString().split('T')[0]} | Initialized | Full Stack | Documented baseline stack for ${appName} |
`;
}
