import { ProjectConfig } from '../types';
import { composeProjectSpec } from '../composer';
import { DB_DIALECT_SPECS } from '../dictionaries/dbDialectSpecs';

/**
 * Sanitize data types to valid, single-word Mermaid ERD types.
 * Mermaid ERD requires types without spaces, parens, or special characters.
 */
function toMermaidType(rawType: string): string {
  if (!rawType) return 'string';
  const clean = rawType.split('(')[0].trim().toLowerCase();
  if (clean.includes('timestamp')) return 'timestamp';
  if (clean.includes('varchar') || clean.includes('text') || clean.includes('char')) return 'string';
  if (clean.includes('numeric') || clean.includes('decimal') || clean.includes('float') || clean.includes('double')) return 'number';
  if (clean.includes('int')) return 'integer';
  if (clean.includes('bool')) return 'boolean';
  if (clean.includes('json')) return 'json';
  if (clean.includes('date')) return 'date';
  if (clean.includes('uuid')) return 'uuid';
  const sanitized = clean.replace(/[^a-z0-9_]/gi, '');
  return sanitized || 'string';
}

/**
 * Format a single column line strictly conforming to Mermaid erDiagram syntax:
 * `<type> <name> [PK|FK] ["comment"]`
 * Note: Mermaid ERD ONLY supports 'PK' or 'FK' as key specifiers.
 * 'UNIQUE' must be formatted as a string comment `"UNIQUE"`.
 */
function formatMermaidColumn(col: { name: string; type: string; key?: 'PK' | 'FK' | 'UNIQUE'; description?: string }): string {
  const type = toMermaidType(col.type);
  const name = col.name.replace(/[^a-z0-9_]/gi, '_');

  if (col.key === 'PK') {
    return `        ${type} ${name} PK`;
  }
  if (col.key === 'FK') {
    return `        ${type} ${name} FK`;
  }
  if (col.key === 'UNIQUE') {
    return `        ${type} ${name} "UNIQUE"`;
  }
  return `        ${type} ${name}`;
}

export function generateDatabase(config: ProjectConfig): string {
  const { dbEngine } = config;
  const spec = composeProjectSpec(config);
  const { appName, tables, mermaidRelationships, detectedModules, securityNotes } = spec;

  const engineName = dbEngine || 'PostgreSQL';
  const dbSpec = DB_DIALECT_SPECS[engineName] || DB_DIALECT_SPECS.PostgreSQL;
  const dbName = appName.toLowerCase().replace(/[^a-z0-9]/g, '_');

  const moduleCount = detectedModules.length;

  // Filter relationships so only relationships between active tables are included in ERD
  const activeTableNames = new Set(tables.map(t => t.name.toUpperCase()));
  const validRelationships = mermaidRelationships.filter(rel => {
    // Relationship format: TABLE_A ||--o{ TABLE_B : label
    const parts = rel.split(/\|\|--o\{|\|\|--\|\||\|\|--o\||\}o--o\{|\}o--\|\|/);
    if (parts.length < 2) return true;
    const t1 = parts[0].trim().toUpperCase();
    const t2 = parts[1].split(':')[0].trim().toUpperCase();
    return activeTableNames.has(t1) && activeTableNames.has(t2);
  });

  return `# 🗄️ DATABASE SCHEMA & ERD DOCUMENTATION

> **Single Source of Truth (SSOT) Database Blueprint**  
> **Engine**: \`${dbSpec.engine}\`  
> **Database Name**: \`${dbName}\`  
> **Feature Modules**: **${moduleCount}** detected → **${tables.length}** tables  
> **Environment**: \`Development / Production\`  
> **ORM / Migration Tool**: \`${dbSpec.migrationTool}\`

---

## 1. Database Overview
- **Database Engine**: ${dbSpec.engine}
- **Primary Database Name**: \`${dbName}\`
- **Total Tables**: ${tables.length}
- **Architecture Pattern**: Centralized relational schema with strict foreign key integrity and indexed access patterns.
- **Migration Strategy**: Code-first ORM schema versioning via \`${dbSpec.migrationTool}\`.
- **Feature Coverage**: ${detectedModules.map(m => m.name).join(', ') || 'Base schema'}

---

## 2. Database Architecture & ERD Diagram ⭐

\`\`\`mermaid
erDiagram
${tables.map(table => `    ${table.name.toUpperCase()} {
${table.columns.map(col => formatMermaidColumn(col)).join('\n')}
    }`).join('\n\n')}

${validRelationships.map(rel => `    ${rel}`).join('\n')}
\`\`\`

---

## 3. Table Documentation ⭐

${tables.map((table, idx) => `
### 3.${idx + 1} \`${table.name}\`
*${table.description}*

| Column | Type | Nullable | Default | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
${table.columns.map(c => `| \`${c.name}\` | \`${c.type}\` | ${c.nullable ? 'Yes' : '**No**'} | \`${c.defaultVal || '-'}\` | ${c.key ? `**${c.key}**` : '-'} | ${c.description} |`).join('\n')}
`).join('\n')}

---

## 4. Relationships ⭐
${validRelationships.length > 0 ? validRelationships.map(rel => `- **${rel}**`).join('\n') : '- *No cross-table relationships defined for current scope.*'}

---

## 5. Constraints & Business Rules
${tables.some(t => t.columns.some(c => c.key === 'UNIQUE')) ? `- **Unique Constraints**: ${tables.flatMap(t => t.columns.filter(c => c.key === 'UNIQUE').map(c => `\`${t.name}.${c.name}\``)).join(', ')} enforced at database level.` : ''}
- **Foreign Key Cascades**: Deleting a parent entity automatically cascades and purges associated child records.
- **NOT NULL Enforcement**: ${tables.reduce((acc, t) => acc + t.columns.filter(c => !c.nullable).length, 0)} columns enforce NOT NULL constraints across ${tables.length} tables.
${securityNotes.length > 0 ? `- **Row Level Security**: Queries must filter tenant data using workspace/user boundary parameters.` : ''}

---

## 6. Indexing Strategy ⭐
${dbSpec.indexingRules.map((idx, i) => `
### 6.${i + 1} ${idx.type}
- **SQL Syntax**: \`${idx.syntax}\`
- **Technical Rationale**: ${idx.description}
`).join('\n')}

### Auto-Generated Indexes for ${appName}:
${tables.flatMap(t => t.columns.filter(c => c.key === 'FK').map(c => `- \`CREATE INDEX idx_${t.name}_${c.name} ON ${t.name}(${c.name});\` — Optimizes join queries on ${t.name}.`)).join('\n') || '- *No FK indexes to generate for current schema.*'}

---

## 7. Migration & Schema Versioning
- **Migration Directory**: \`prisma/migrations/\` or \`drizzle/migrations/\`
- **Commands**:
  - **Generate Migration**: \`${dbSpec.migrationCommands.generate}\`
  - **Apply Migration**: \`${dbSpec.migrationCommands.apply}\`
  - **Rollback Migration**: \`${dbSpec.migrationCommands.rollback}\`

---

## 8. Seed & Development Data
- **Seed Script**: Executable via \`npm run db:seed\` or \`npx prisma db seed\`.
- **Default Seed Records**:
${tables.some(t => t.name === 'users') ? `  - **System Admin**: \`admin@${dbName.replace(/_/g, '')}.local\` (Password hashed via Argon2id).` : ''}
${tables.some(t => t.name === 'workspaces') ? `  - **Demo Workspace**: \`${appName} Demo Workspace\` with seed member data.` : ''}
${tables.some(t => t.name === 'products') ? `  - **Sample Products**: 5 sample product records with variant data for testing.` : ''}
${tables.some(t => t.name === 'posts') ? `  - **Sample Posts**: 3 draft and 2 published blog posts for content preview testing.` : ''}
  - **Test Entity**: Seeded test record(s) for local sandbox development and testing.

---

## 9. Data Security
${dbSpec.securityRules.map(rule => `- **${rule}**`).join('\n')}
${securityNotes.length > 0 ? `\n### Module-Specific Security:\n${securityNotes.map(s => `- ${s}`).join('\n')}` : ''}

> [!CAUTION]
> Never commit actual \`.env\` database credentials, passwords, or production connection URIs to version control.

---

## 10. Backup & Recovery Procedure
- **Backup Strategy**: ${dbSpec.backupProcedure}
- **RPO (Recovery Point Objective)**: Maximum 1 hour data loss window.
- **RTO (Recovery Time Objective)**: Sub-30 minute database restoration SLA.

---

## 11. Production vs Development Rules
- **Development**: Local ${engineName} instance with sample seed datasets (${tables.length} tables).
- **Production**: Managed High-Availability database cluster with connection pooling and automated backups.

---

## 12. Database Change Log
| Version | Date | Author | Description of Changes |
| :--- | :--- | :--- | :--- |
| \`v1.0.0\` | ${new Date().toISOString().split('T')[0]} | DevContext Engine | Initial schema: ${tables.length} tables for ${appName} (${detectedModules.map(m => m.id).join(', ')}) |
`;
}
