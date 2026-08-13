import { ProjectConfig } from '../types';
import { composeProjectSpec } from '../composer';

export function generateReadme(config: ProjectConfig): string {
  const { techStack, dbEngine } = config;
  const spec = composeProjectSpec(config);
  const { appName, appDescription, requirements, tables, uiPages } = spec;

  const appSlug = appName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return `# 🚀 ${appName}

> ${appDescription}

---

## ⚡ Key Domain Features
${requirements.slice(0, 5).map(r => `- **${r.feature}**: ${r.description}`).join('\n') || '- **Core Domain Workflow**: Type-safe architecture for domain management.'}

---

## 🗄️ Database Architecture
- **DBMS Dialect**: \`${dbEngine || 'PostgreSQL'}\`
- **Schema Tables (${tables.length})**: ${tables.map(t => `\`${t.name}\``).join(', ')}

---

## 🛠️ Technology Stack
${techStack.map(t => `- **${t}**`).join('\n') || '- **TypeScript**: Strict type safety'}
- **Database Engine**: ${dbEngine || 'PostgreSQL'}

---

## 📱 Pages & User Screens
${uiPages.map(p => `- **${p}**`).join('\n')}

---

## 🚀 Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/user/${appSlug}.git

# Navigate into directory
cd ${appSlug}

# Install dependencies
npm install

# Run database migrations (${tables.length} tables)
npx prisma migrate dev --name init_schema

# Seed development database
npm run db:seed

# Start local dev server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to launch **${appName}**.
`;
}
