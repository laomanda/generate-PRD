import { ProjectConfig } from '../types';
import { TECH_STACK_DATABASE, CORE_VERSION_COMPATIBILITY } from '../dictionaries/techStackSpecs';
import { composeProjectSpec } from '../composer';

export function generateTechStack(config: ProjectConfig): string {
  const { techStack, dbEngine } = config;
  const spec = composeProjectSpec(config);
  const { appName, detectedModules, apiEndpoints } = spec;

  const selectedTechs = techStack.map(t => TECH_STACK_DATABASE[t] || {
    name: t,
    version: 'Latest',
    category: 'tooling' as const,
    purpose: 'Core architectural dependency component.',
    rationale: 'Provides essential functionality for modern web application workflows.',
  });

  // Derive additional tech recommendations based on detected modules
  const moduleRecommendations = deriveModuleRecommendations(detectedModules.map(m => m.id));

  return `# 🛠️ TECH STACK DOCUMENTATION

> **Single Source of Truth Technology & Library Specification**  
> **Target Product**: **${appName}**  
> **Primary Database**: **${dbEngine || 'PostgreSQL'}**  
> **Active Feature Modules**: ${detectedModules.map(m => m.name).join(', ') || 'Base platform'}  
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

${moduleRecommendations.length > 0 ? `### Feature-Specific Package Recommendations
| Feature Module | Recommended Package | Purpose |
| :--- | :--- | :--- |
${moduleRecommendations.map(r => `| **${r.module}** | \`${r.pkg}\` | ${r.purpose} |`).join('\n')}
` : ''}

---

## 5. Backend Stack
- **API Paradigm**: Next.js Route Handlers / Client-First Pure Functional Engine.
- **Server Execution**: Serverless Edge Functions / Pure Browser Engine.
${apiEndpoints.length > 0 ? `- **API Endpoints Planned**: ${apiEndpoints.length} endpoints across ${detectedModules.length} feature modules.` : ''}

---

## 6. Database Technology
- **DBMS Dialect**: \`${dbEngine || 'PostgreSQL'}\`
- **ORM / Query Builder**: Prisma / Drizzle ORM
- **Migration Pipeline**: Code-first migration versioning
- **Tables Planned**: ${spec.tables.length} tables across ${detectedModules.length} feature modules.

---

## 7. Authentication & Authorization
${detectedModules.some(m => m.id === 'auth') ? `- **Auth Pattern**: JWT Bearer Tokens with httpOnly refresh cookie rotation.
- **Password Hashing**: Argon2id (preferred) or Bcrypt with cost factor 12+.
- **Session Management**: Server-side session tracking with device fingerprinting.` : `- **Auth Pattern**: JWT Bearer Tokens / Session Cookies.
- **Implementation**: To be configured based on project requirements.`}
${detectedModules.some(m => m.id === 'rbac') ? `- **RBAC**: Hierarchical roles (Super Admin > Admin > Manager > Member > Viewer) with granular permission matrix.` : '- **Role-Based Access Control (RBAC)**: Owner, Admin, Member, Viewer permissions.'}

---

## 8. API & External Integrations
${detectedModules.some(m => m.id === 'payment') ? `- **Payment Gateway**: Stripe / Midtrans for subscription billing and one-time payments.
- **Webhook Handling**: Stripe webhook signature validation with exponential backoff retry.` : ''}
${detectedModules.some(m => m.id === 'file-upload') ? `- **Cloud Storage**: AWS S3 / Cloudflare R2 / Supabase Storage for media uploads.
- **CDN**: Cloudflare / Vercel Edge for static asset delivery.` : ''}
${detectedModules.some(m => m.id === 'notification') ? `- **Email Service**: Resend / SendGrid / AWS SES for transactional emails.
- **Push Notifications**: Firebase Cloud Messaging (FCM) for mobile push.` : ''}
${detectedModules.some(m => m.id === 'chat') ? `- **WebSocket**: Socket.io or native WebSocket for real-time messaging.` : ''}
${!detectedModules.some(m => ['payment', 'file-upload', 'notification', 'chat'].includes(m.id)) ? '- **Zero Third-Party Dependency**: Core rule engine executes locally in browser client runtime.' : ''}

---

## 9. Development Tools
- **Code Editor**: VS Code / Cursor / Windsurf.
- **Version Control**: Git & GitHub.
- **Linter & Formatter**: ESLint v9 & TypeScript Compiler (\`tsc\`).

---

## 10. Testing Stack
- **Unit & Integration Testing**: Vitest / Jest.
- **End-to-End Testing**: Playwright test runner.
${detectedModules.some(m => m.id === 'auth') ? `- **Auth Testing**: Mock JWT tokens and session fixtures for isolated auth flow testing.` : ''}

---

## 11. Code Quality & Standards
- **Strict Typing**: \`noImplicitAny: true\`, \`strictNullChecks: true\`.
- **Linting Standard**: \`eslint-config-next\` ruleset.

---

## 12. Deployment & Infrastructure ⭐
- **Frontend Hosting**: Vercel Edge Network / Cloudflare Pages.
- **Database Cloud**: Managed Cloud Database (Supabase / Neon / PlanetScale).
${detectedModules.some(m => m.id === 'file-upload') ? `- **Object Storage**: AWS S3 / Cloudflare R2 for uploaded media files.` : ''}
${detectedModules.some(m => m.id === 'chat') ? `- **WebSocket Server**: Dedicated WebSocket server or Ably/Pusher managed service.` : ''}

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
${detectedModules.some(m => m.id === 'payment') ? `
# Payment Gateway
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"` : ''}
${detectedModules.some(m => m.id === 'file-upload') ? `
# Cloud Storage
S3_BUCKET_NAME="xxx"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="xxx"
S3_SECRET_ACCESS_KEY="xxx"` : ''}
${detectedModules.some(m => m.id === 'notification') ? `
# Email Service
RESEND_API_KEY="re_xxx"
EMAIL_FROM_ADDRESS="noreply@${appName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com"` : ''}
${detectedModules.some(m => m.id === 'auth') ? `
# Auth
JWT_SECRET="xxx"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"` : ''}
\`\`\`

---

## 15. Architecture Data Flow
\`\`\`mermaid
graph LR
    ClientUI["React 19 UI Component"] --> Store["Zustand State Store"]
    Store --> PureEngine["Pure TypeScript Rule Engine"]
    PureEngine --> ExportZip["JSZip Client Downloader"]
${detectedModules.some(m => m.id === 'auth') ? '    ClientUI --> AuthAPI["Auth API (JWT)"]' : ''}
${detectedModules.some(m => m.id === 'payment') ? '    ClientUI --> PaymentGW["Payment Gateway"]' : ''}
${detectedModules.some(m => m.id === 'chat') ? '    ClientUI --> WSServer["WebSocket Server"]' : ''}
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
| ${new Date().toISOString().split('T')[0]} | Initialized | Full Stack | Documented baseline stack for ${appName} (${detectedModules.map(m => m.id).join(', ')}) |
`;
}

/**
 * Derive additional package recommendations based on detected feature modules.
 */
function deriveModuleRecommendations(moduleIds: string[]): { module: string; pkg: string; purpose: string }[] {
  const recommendations: { module: string; pkg: string; purpose: string }[] = [];
  const moduleIdSet = new Set(moduleIds);

  if (moduleIdSet.has('payment')) {
    recommendations.push({ module: 'Payment & Billing', pkg: '@stripe/stripe-js', purpose: 'Stripe Elements for secure client-side card collection' });
  }
  if (moduleIdSet.has('chat')) {
    recommendations.push({ module: 'Real-time Chat', pkg: 'socket.io-client', purpose: 'WebSocket client for real-time message transport' });
  }
  if (moduleIdSet.has('blog')) {
    recommendations.push({ module: 'Blog / CMS', pkg: '@tiptap/react', purpose: 'Headless rich text editor for content authoring' });
  }
  if (moduleIdSet.has('analytics')) {
    recommendations.push({ module: 'Analytics', pkg: 'recharts', purpose: 'Composable chart library for React dashboards' });
  }
  if (moduleIdSet.has('file-upload')) {
    recommendations.push({ module: 'File Upload', pkg: 'react-dropzone', purpose: 'Drag-and-drop file upload zone component' });
  }
  if (moduleIdSet.has('i18n')) {
    recommendations.push({ module: 'Multi-language', pkg: 'next-intl', purpose: 'Next.js internationalization with ICU message format' });
  }
  if (moduleIdSet.has('search')) {
    recommendations.push({ module: 'Search', pkg: 'fuse.js', purpose: 'Lightweight client-side fuzzy search engine' });
  }
  if (moduleIdSet.has('booking')) {
    recommendations.push({ module: 'Booking', pkg: 'date-fns', purpose: 'Lightweight date/time manipulation and timezone handling' });
  }

  return recommendations;
}
