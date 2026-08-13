import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildDatabaseIR(project: ProjectModel): DocumentIR {
  const dbName = project.projectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const builder = new DocumentIRBuilder('DATABASE', `🗄️ DATABASE SCHEMA & ERD DOCUMENTATION`)
    .setMetadata('DBMS Engine', project.dbEngine)
    .setMetadata('Database Name', dbName)
    .setMetadata('Domain Industry', project.domain.domainName)
    .setMetadata('Database Complexity', project.signals.databaseComplexity);

  // 1. Overview
  builder.addSection({
    id: 'db-overview',
    title: '1. Database Overview',
    level: 2,
    nodes: [
      {
        type: 'paragraph',
        text: `Relational schema design for **${project.projectName}** supporting ACID transactional integrity and index-optimized access patterns.`,
      },
    ],
  });

  // 2. ERD Diagram
  const primaryEntity = project.domain.primaryEntityNames[0] || 'entity';
  const entitySingular = primaryEntity.toLowerCase().replace(/[^a-z0-9]/g, '');
  const entityPlural = `${entitySingular}s`;

  const mermaidChart = `erDiagram
    USERS {
        uuid id PK
        string email "UNIQUE"
        string password_hash
        timestamp created_at
    }

    ${entityPlural.toUpperCase()} {
        uuid id PK
        uuid user_id FK
        string name
        string code "UNIQUE"
        string status
        timestamp created_at
    }

    USERS ||--o{ ${entityPlural.toUpperCase()} : owns`;

  builder.addSection({
    id: 'erd',
    title: '2. Entity Relationship Diagram (ERD)',
    level: 2,
    nodes: [
      {
        type: 'diagram',
        data: {
          diagramType: 'mermaid',
          code: mermaidChart,
        },
      },
    ],
  });

  // 3. Table Specifications
  builder.addSection({
    id: 'tables',
    title: '3. Data Table Specifications',
    level: 2,
    nodes: [
      {
        type: 'paragraph',
        text: `Primary catalog table for \`${entityPlural}\`:`,
      },
      {
        type: 'table',
        data: {
          headers: ['Column', 'Type', 'Nullable', 'Key', 'Description'],
          rows: [
            ['id', 'UUID', 'No', 'PK', 'Primary key identifier'],
            ['user_id', 'UUID', 'No', 'FK', 'References users(id) owner'],
            ['name', 'VARCHAR(255)', 'No', '-', 'Display name'],
            ['code', 'VARCHAR(50)', 'No', 'UNIQUE', 'Unique code constraint'],
            ['status', 'VARCHAR(30)', 'No', '-', 'Operational status'],
            ['created_at', 'TIMESTAMP', 'No', '-', 'Record creation timestamp'],
          ],
        },
      },
    ],
  });

  // 4. Inferred RLS Security Rules (if applicable)
  if (project.signals.authComplexity === 'multi_tenant_rls' || project.signals.dataSensitivityScore >= 7) {
    builder.addSection({
      id: 'rls-policies',
      title: '4. Row Level Security (RLS) & Authorization Policies',
      level: 2,
      nodes: [
        {
          type: 'callout',
          data: {
            type: 'CAUTION',
            title: 'Row Level Security Active',
            content: `PostgreSQL RLS is enabled for ${entityPlural}. Direct queries without tenant auth context will be rejected by database policies.`,
          },
        },
        {
          type: 'code',
          data: {
            language: 'sql',
            code: `-- Enable RLS on ${entityPlural}
ALTER TABLE ${entityPlural} ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policy
CREATE POLICY ${entitySingular}_tenant_isolation ON ${entityPlural}
    FOR ALL
    USING (user_id = auth.uid());`,
          },
        },
      ],
    });
  }

  return builder.build();
}

export function generateDatabase(project: ProjectModel): string {
  const ir = buildDatabaseIR(project);
  return renderDocumentIRToMarkdown(ir);
}
