import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildArchitectureIR(project: ProjectModel): DocumentIR {
  const appSlug = project.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return new DocumentIRBuilder('ARCHITECTURE', `🏗️ SYSTEM ARCHITECTURE DOCUMENT`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Database Engine', project.dbEngine)
    .setMetadata('Auth Complexity', project.signals.authComplexity)
    .addSection({
      id: 'system-diagram',
      title: '1. High-Level System Architecture',
      level: 2,
      nodes: [
        {
          type: 'diagram',
          data: {
            diagramType: 'mermaid',
            code: `graph TD
    ClientUI["Browser / Mobile Client UI"]
    StateStore["Zustand Client State Store"]
    APIHandlers["Next.js Route Handlers / API Layer"]
    DatabaseEngine["${project.dbEngine} Database Cluster"]

    ClientUI --> StateStore
    StateStore --> APIHandlers
    APIHandlers --> DatabaseEngine`,
          },
        },
      ],
    })
    .addSection({
      id: 'directory-structure',
      title: '2. Domain Directory Structure',
      level: 2,
      nodes: [
        {
          type: 'code',
          data: {
            language: 'text',
            code: `${appSlug}/
├── app/                        # Application routes and page views
│   └── api/                    # Route handlers
├── components/                 # UI components
├── lib/                        # Domain logic & data access
│   ├── engine/                 # Domain rule engine
│   └── types.ts                # TypeScript models
└── database/                   # Migrations`,
          },
        },
      ],
    })
    .build();
}

export function generateArchitecture(project: ProjectModel): string {
  const ir = buildArchitectureIR(project);
  return renderDocumentIRToMarkdown(ir);
}
