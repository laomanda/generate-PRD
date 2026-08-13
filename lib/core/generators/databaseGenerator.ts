import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildDatabaseIR(project: ProjectModel): DocumentIR {
  const dbName = project.projectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const builder = new DocumentIRBuilder('DATABASE', `Database Documentation`)
    .setMetadata('DBMS Engine', project.dbEngine)
    .setMetadata('Database Name', dbName)
    .setMetadata('Domain Industry', project.domain.domainName)
    .setMetadata('Database Complexity', project.signals.databaseComplexity);

  const entity = project.domain.primaryEntityNames[0] || 'record';
  const entityPlural = `${entity.toLowerCase()}s`;

  const sections = [
    { id: 'db-overview', title: '1. Database Overview', text: `Relational schema design for **${project.projectName}** supporting ACID transactional integrity.` },
    { id: 'db-tech', title: '2. Database Technology', text: `Database Engine: ${project.dbEngine} with connection pooling.` },
    { id: 'db-architecture', title: '3. Database Architecture', text: 'Primary-Replica deployment model with automatic failover.' },
    { id: 'schema-overview', title: '4. Schema Overview', text: `Relational tables cataloging ${entityPlural} and authentication accounts.` },
    {
      id: 'erd',
      title: '5. Entity Relationship Diagram',
      code: `erDiagram\n    USERS ||--o{ ${entityPlural.toUpperCase()} : owns`,
    },
    { id: 'tables', title: '6. Tables', text: `Primary tables: \`users\`, \`${entityPlural}\`, \`audit_logs\`.` },
    { id: 'columns-types', title: '7. Columns & Data Types', text: 'UUID PKs, VARCHAR strings, TIMESTAMP WITH TIME ZONE timestamps.' },
    { id: 'primary-keys', title: '8. Primary Keys', text: 'All tables use RFC 4122 random UUID primary keys.' },
    { id: 'foreign-keys', title: '9. Foreign Keys', text: `\`${entityPlural}.user_id\` references \`users.id\` ON DELETE CASCADE.` },
    { id: 'relationships', title: '10. Relationships', text: 'One-to-Many ownership relationships between Users and Domain Entities.' },
    { id: 'constraints', title: '11. Constraints', text: 'NOT NULL constraints enforced on critical data fields.' },
    { id: 'unique-constraints', title: '12. Unique Constraints', text: 'UNIQUE indexes on user emails and domain codes.' },
    { id: 'indexes', title: '13. Indexes', text: 'B-Tree indexes on foreign key join columns and status fields.' },
    { id: 'business-rules', title: '14. Database Business Rules', text: 'State changes must pass database validation triggers.' },
    { id: 'auth-data', title: '15. Authentication Data', text: 'Stored in `users` table with Argon2id password hashing.' },
    { id: 'authorization-data', title: '16. Authorization Data', text: 'User permission levels and role assignments.' },
    { id: 'rls-policies', title: '17. Row-Level Security / Access Policies', text: `PostgreSQL RLS enabled on \`${entityPlural}\` tables.` },
    { id: 'data-validation', title: '18. Data Validation', text: 'CHECK constraints enforcing positive numerical boundaries.' },
    { id: 'migrations', title: '19. Migrations', text: 'Version-controlled migration scripts via ORM migration tool.' },
    { id: 'seed-data', title: '20. Seed Data', text: 'Development fixtures for initial user roles and domain records.' },
    { id: 'transactions-integrity', title: '21. Transactions & Data Integrity', text: 'SERIALIZABLE transaction isolation for financial mutations.' },
    { id: 'backup-recovery', title: '22. Backup & Recovery', text: 'Daily automated WAL archive snapshots with 30-day retention.' },
    { id: 'db-security', title: '23. Database Security', text: 'SSL/TLS encrypted connections (require SSL mode).' },
    { id: 'db-performance', title: '24. Performance Considerations', text: 'Query execution plan analysis via EXPLAIN ANALYZE.' },
    { id: 'data-retention', title: '25. Data Retention', text: 'Soft-delete pattern with 90-day archive retention policy.' },
    { id: 'change-log', title: '26. Database Change Log', text: 'Schema migration history log.' },
  ];

  sections.forEach(s => {
    builder.addSection({
      id: s.id,
      title: s.title,
      level: 2,
      nodes: s.code
        ? [{ type: 'diagram', data: { diagramType: 'mermaid', code: s.code } }]
        : [{ type: 'paragraph', text: s.text || '> Not specified.' }],
    });
  });

  return builder.build();
}

export function generateDatabase(project: ProjectModel): string {
  const ir = buildDatabaseIR(project);
  return renderDocumentIRToMarkdown(ir);
}
