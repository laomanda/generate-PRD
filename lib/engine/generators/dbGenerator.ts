import { ProjectConfig } from '../types';

export function generateDatabase(config: ProjectConfig): string {
  const { dbEngine } = config;
  const engine = dbEngine || 'PostgreSQL';

  return `# 🗄️ DATABASE SCHEMA & ERD DOCUMENTATION

## 1. Engine Configuration
- **Selected Engine**: \`${engine}\`
- **Migration Strategy**: Code-first ORM migration pipelines.

## 2. Entity Relationship Diagram (ERD)

\`\`\`mermaid
erDiagram
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ PROJECTS : creates
    PROJECTS ||--o{ ARCHITECTURE_BLUEPRINTS : contains

    USERS {
        uuid id PK
        string email
        string name
        timestamp created_at
    }

    PROJECTS {
        uuid id PK
        uuid user_id FK
        string name
        string type
        timestamp created_at
    }

    ARCHITECTURE_BLUEPRINTS {
        uuid id PK
        uuid project_id FK
        json content
        timestamp generated_at
    }
\`\`\`

## 3. SQL DDL Blueprint

\`\`\`sql
-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    app_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
\`\`\`
`;
}
