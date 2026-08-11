import { ProjectConfig } from '../types';

export function generateReadme(config: ProjectConfig): string {
  const { projectName, description, techStack } = config;

  return `# 🚀 ${projectName || 'DevContext Engine'}

> ${description || 'Zero-API-key architecture documentation generator for developers.'}

## ⚡ Features
- **100% Client-Side Engine**: Generates complete architecture blueprints locally in <0.01s.
- **Zero API Cost**: No external LLM key required.
- **Dark Mode First**: Clean IDE-inspired interface built with Tailwind CSS.
- **Export Utility**: One-click ZIP export for instant project documentation bundling.

## 🛠️ Tech Stack
${techStack.map(t => `- **${t}**`).join('\n')}

## 🚀 Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/user/${projectName ? projectName.toLowerCase().replace(/\s+/g, '-') : 'devcontext-engine'}.git

# Navigate into directory
cd ${projectName ? projectName.toLowerCase().replace(/\s+/g, '-') : 'devcontext-engine'}

# Install dependencies
npm install

# Start local dev server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
`;
}
