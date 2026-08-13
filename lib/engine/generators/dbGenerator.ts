import { ProjectConfig } from '../types';
import { APP_TYPE_SPECS } from '../dictionaries/appTypeSpecs';
import { DB_DIALECT_SPECS } from '../dictionaries/dbDialectSpecs';

export function generateDatabase(config: ProjectConfig): string {
  const { projectName, appType, dbEngine } = config;
  const appSpec = APP_TYPE_SPECS[appType] || APP_TYPE_SPECS.saas;
  const engineName = dbEngine || 'PostgreSQL';
  const dbSpec = DB_DIALECT_SPECS[engineName] || DB_DIALECT_SPECS.PostgreSQL;

  const appName = projectName ? projectName.toLowerCase().replace(/\s+/g, '_') : 'devcontext_db';

  return `# 🗄️ DATABASE SCHEMA & ERD DOCUMENTATION

> **Single Source of Truth (SSOT) Database Blueprint**  
> **Engine**: \`${dbSpec.engine}\`  
> **Database Name**: \`${appName}\`  
> **Environment**: \`Development / Production\`  
> **ORM / Migration Tool**: \`${dbSpec.migrationTool}\`

---

## 1. Database Overview
- **Database Engine**: ${dbSpec.engine}
- **Primary Database Name**: \`${appName}\`
- **Architecture Pattern**: Centralized relational schema with strict foreign key integrity and indexed access patterns.
- **Migration Strategy**: Code-first ORM schema versioning via \`${dbSpec.migrationTool}\`.

---

## 2. Database Architecture & ERD Diagram ⭐

\`\`\`mermaid
erDiagram
${appSpec.tables.map(table => `    ${table.name.toUpperCase()} {
${table.columns.map(col => `        ${col.type.toLowerCase()} ${col.name} ${col.key ? col.key : ''}`).join('\n')}
    }`).join('\n\n')}

    USERS ||--o{ WORKSPACES : owns
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : contains
    WORKSPACES ||--o{ API_KEYS : issues
\`\`\`

---

## 3. Table Documentation ⭐

${appSpec.tables.map(table => `
### 3.${table.name} (\`${table.name}\`)
*${table.description}*

| Column | Type | Nullable | Default | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
${table.columns.map(c => `| \`${c.name}\` | \`${c.type}\` | ${c.nullable ? 'Yes' : '**No**'} | \`${c.defaultVal || '-'}\` | ${c.key ? `**${c.key}**` : '-'} | ${c.description} |`).join('\n')}
`).join('\n')}

---

## 4. Relationships ⭐
- **\`users\` 1 ──── N \`workspaces\`**: One user can create and own multiple workspaces (\`workspaces.owner_id\` -> \`users.id\`).
- **\`workspaces\` 1 ──── N \`workspace_members\`**: Workspaces contain multiple members linked via junction table (\`workspace_members.workspace_id\` -> \`workspaces.id\`).
- **\`users\` 1 ──── N \`workspace_members\`**: Users can join multiple workspaces (\`workspace_members.user_id\` -> \`users.id\`).
- **\`workspaces\` 1 ──── N \`api_keys\`**: One workspace can generate multiple developer API keys (\`api_keys.workspace_id\` -> \`workspaces.id\`).

---

## 5. Constraints & Business Rules
- **Email Uniqueness**: \`users.email\` must be unique across the entire database system.
- **Slug Format**: \`workspaces.slug\` must be URL-safe (lowercase alphanumeric with hyphens only).
- **Foreign Key Cascades**: Deleting a workspace automatically cascades and purges its associated \`workspace_members\` and \`api_keys\`.
- **Row Level Security (RLS)**: Queries must always filter tenant data using \`WHERE workspace_id = :current_workspace_id\`.

---

## 6. Indexing Strategy ⭐
${dbSpec.indexingRules.map((idx, i) => `
### 6.${i + 1} ${idx.type}
- **SQL Syntax**: \`${idx.syntax}\`
- **Technical Rationale**: ${idx.description}
`).join('\n')}

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
  - **System Admin**: \`admin@devcontext.local\` (Password hashed via Argon2id, Role: \`owner\`).
  - **Test Workspace**: \`DevContext Demo Workspace\` (\`slug: devcontext-demo\`).
  - **Demo API Key**: Preseded test token for local sandbox testing.

---

## 9. Data Security
${dbSpec.securityRules.map(rule => `- **${rule}**`).join('\n')}

> [!CAUTION]
> Never commit actual \`.env\` database credentials, passwords, or production connection URIs to version control.

---

## 10. Backup & Recovery Procedure
- **Backup Strategy**: ${dbSpec.backupProcedure}
- **RPO (Recovery Point Objective)**: Maximum 1 hour data loss window.
- **RTO (Recovery Time Objective)**: Sub-30 minute database restoration SLA.

---

## 11. Production vs Development Rules
- **Development**: Local PostgreSQL / SQLite instance with sample seed datasets.
- **Production**: Managed High-Availability database cluster with connection pooling (e.g., PgBouncer / Supabase).

---

## 12. Database Change Log
| Version | Date | Author | Description of Changes |
| :--- | :--- | :--- | :--- |
| \`v1.0.0\` | ${new Date().toISOString().split('T')[0]} | DevContext Engine | Initial production schema setup for ${appName} |
`;
}
