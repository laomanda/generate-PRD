import { ProjectConfig } from '../types';

export function generatePRD(config: ProjectConfig): string {
  const { projectName, appType, description, features, techStack } = config;
  return `# 📋 PRODUCT REQUIREMENT DOCUMENT (PRD)

## 1. Project Overview
- **Project Name**: ${projectName || 'DevContext App'}
- **Application Type**: ${appType.toUpperCase()}
- **Core Summary**: ${description || 'Custom software solution generated with DevContext Engine.'}

## 2. Target Persona & Problem Statement
- **Target Audience**: Developers, Tech Leads, and End-Users seeking streamlined workflows.
- **Key Pain Point**: Fragmented documentation, lack of architecture consensus, and AI code generation hallucinations.
- **Solution**: A structured, deterministic tech stack architecture built with ${techStack.join(', ') || 'modern web standards'}.

## 3. Scope & Key Features
${features.length > 0 ? features.map(f => `- **${f}**: Core feature requirement implementation.`).join('\n') : '- **Core System Workspace**: Main interactive interface and user workflow.\n- **Data Management**: Persistence and client state synchronization.'}

## 4. Technical Non-Functional Requirements
- **Performance**: High reactivity and responsive render cycles.
- **Security**: Strict client-side validation, secure token storage, and safe data handling.
- **Maintainability**: Modular component layout and strict TypeScript type-safety.
`;
}
