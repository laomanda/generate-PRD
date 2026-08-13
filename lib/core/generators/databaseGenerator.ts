import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildDatabaseIR(project: ProjectModel): DocumentIR {
  const dbName = project.projectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const cleanProjectName = project.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const usersTable = `${cleanProjectName}_users`;
  const builder = new DocumentIRBuilder('DATABASE', `Database Specification`)
    .setMetadata('DBMS Engine', project.dbEngine)
    .setMetadata('Database Name', dbName)
    .setMetadata('Domain Industry', project.domain.domainName)
    .setMetadata('Database Complexity', project.signals.databaseComplexity);

  const domainEntities = project.domain.entities;
  const tableNamesStr = domainEntities.map(e => `\`${e.tableName}\``).join(', ');

  // Construct dynamic ERD code ensuring safe node naming and standard relationship mapping
  let erdCode = 'erDiagram\n';
  
  // Define all tables first to ensure valid rendering even without relationships
  domainEntities.forEach(e => {
    erdCode += `    ${e.tableName.toUpperCase()} {\n`;
    e.attributes.slice(0, 4).forEach(attr => {
      // Clean type string for Mermaid
      const cleanType = attr.type.replace(/[\(\)\[\]\s]/g, '_');
      const modifier = attr.isPk ? ' PK' : attr.isFk ? ' FK' : '';
      erdCode += `        ${cleanType} ${attr.name}${modifier}\n`;
    });
    erdCode += `    }\n`;
  });
  
  // Define relationships
  const userEntity = domainEntities.find(te => te.name === 'User');
  const defaultUserTable = userEntity ? userEntity.tableName : 'users';

  domainEntities.forEach(e => {
    e.relationships.forEach(rel => {
      const targetTable = domainEntities.find(te => te.name === rel.targetEntity)?.tableName || defaultUserTable;
      
      let relationSyntax = '}o--||';
      if (rel.type === '1:N') relationSyntax = '||--o{';
      else if (rel.type === '1:1') relationSyntax = '||--||';
      else if (rel.type === 'N:M') relationSyntax = '}o--o{';

      // Clean the description for valid Mermaid rendering
      const cleanDesc = rel.description.replace(/['"]/g, '');
      erdCode += `    ${targetTable.toUpperCase()} ${relationSyntax} ${e.tableName.toUpperCase()} : "${cleanDesc}"\n`;
    });
  });

  const sections = [
    { id: 'db-overview', title: '1. Database Overview', text: `Relational schema design for **${project.projectName}** supporting ACID transactional integrity across ${domainEntities.length} domain entity tables, optimized for the ${project.domain.industryType} sector.` },
    { id: 'db-tech', title: '2. Database Technology', text: `Database Engine: **${project.dbEngine}** configured specifically for ${project.projectName} schema storage with connection pooling.` },
    { id: 'db-architecture', title: '3. Database Architecture', text: `Primary-Replica HA deployment model supporting ${project.signals.expectedScalability} scalability requirements of ${project.projectName}.` },
    { id: 'schema-overview', title: '4. Schema Overview', text: `Relational tables cataloging domain entities for ${project.domain.domainName}: ${tableNamesStr}.` },
    { id: 'erd', title: '5. Entity Relationship Diagram', code: erdCode },
    { id: 'tables', title: '6. Tables', text: `Primary entity tables: ${tableNamesStr}, and system \`${dbName}_audit_logs\`.` },
    {
      id: 'columns-types',
      title: '7. Columns & Data Types',
      text: domainEntities.map(e => `**${e.tableName}**: ${e.attributes.map(a => `\`${a.name}\` (${a.type})`).join(', ')}`).join('\n\n'),
    },
    { id: 'primary-keys', title: '8. Primary Keys', text: `All ${project.projectName} domain tables enforce RFC 4122 random UUID primary keys.` },
    {
      id: 'foreign-keys',
      title: '9. Foreign Keys',
      text: domainEntities.flatMap(e => e.relationships.map(r => `\`${e.tableName}.${r.foreignKey}\` → \`${domainEntities.find(te => te.name === r.targetEntity)?.tableName || 'users'}.id\` ON DELETE CASCADE`)).join('\n\n') || `Foreign key constraints linked to user accounts in ${project.projectName}.`,
    },
    { id: 'relationships', title: '10. Relationships', text: domainEntities.flatMap(e => e.relationships.map(r => `**${e.name} → ${r.targetEntity}**: ${r.description} (${r.type})`)).join('\n\n') || 'One-to-Many entity relationships.' },
    { id: 'constraints', title: '11. Constraints', text: domainEntities.flatMap(e => e.constraints).join('; ') || `NOT NULL constraints enforced on critical columns for ${project.projectName}.` },
    { id: 'unique-constraints', title: '12. Unique Constraints', text: `UNIQUE indexes on natural key identifiers and authentication email addresses in the ${dbName} catalog.` },
    { id: 'indexes', title: '13. Indexes', text: domainEntities.flatMap(e => e.indexes).join(', ') || 'B-Tree indexes on foreign keys.' },
    { id: 'business-rules', title: '14. Database Business Rules', text: `Enforces domain business state transitions across entity lifecycles (${domainEntities.flatMap(e => e.lifecycleStates || []).slice(0, 6).join(', ')}).` },
    { id: 'auth-data', title: '15. Authentication Data', text: `User credentials and security tokens managed in \`${usersTable}\` with Argon2id hashing.` },
    { id: 'authorization-data', title: '16. Authorization Data', text: `Role-Based Access Control (RBAC) permissions stored in \`${usersTable}.role\` attributes.` },
    { id: 'rls-policies', title: '17. Row-Level Security / Access Policies', text: `PostgreSQL Row-Level Security (RLS) policies enabled on ${tableNamesStr} for client-level isolation.` },
    { id: 'data-validation', title: '18. Data Validation', text: `CHECK constraints enforcing positive boundaries and non-empty strings on ${project.projectName} records.` },
    { id: 'migrations', title: '19. Migrations', text: `Version-controlled SQL migration scripts executing pre-release schema updates for the ${dbName} schema.` },
    { id: 'seed-data', title: '20. Seed Data', text: `Initial development seed fixtures for ${tableNamesStr}.` },
    { id: 'transactions-integrity', title: '21. Transactions & Data Integrity', text: `ACID transactional boundaries with SERIALIZABLE isolation for mutations in ${project.projectName}.` },
    { id: 'backup-recovery', title: '22. Backup & Recovery', text: `Automated WAL archive snapshots for ${project.projectName} with point-in-time recovery (PITR).` },
    { id: 'db-security', title: '23. Database Security', text: `Encrypted connections requiring TLS 1.3 and secret key vault integration for ${project.projectName}.` },
    { id: 'db-performance', title: '24. Performance Considerations', text: `Sub-50ms query latency targets using EXPLAIN ANALYZE execution plan auditing on the ${project.dbEngine} engine.` },
    { id: 'data-retention', title: '25. Data Retention', text: 'Soft-delete pattern with 90-day archive retention policies.' },
    { id: 'change-log', title: '26. Database Change Log', text: `Audit table logging schema migration versions for ${project.projectName}.` },
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
