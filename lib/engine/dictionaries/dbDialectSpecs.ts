export interface DBDialectSpec {
  engine: string;
  uuidSyntax: string;
  autoIncrementSyntax: string;
  timestampSyntax: string;
  jsonSyntax: string;
  migrationTool: string;
  migrationCommands: {
    generate: string;
    apply: string;
    rollback: string;
  };
  indexingRules: { type: string; syntax: string; description: string }[];
  securityRules: string[];
  backupProcedure: string;
}

export const DB_DIALECT_SPECS: Record<string, DBDialectSpec> = {
  PostgreSQL: {
    engine: 'PostgreSQL 16+',
    uuidSyntax: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    autoIncrementSyntax: 'BIGSERIAL PRIMARY KEY',
    timestampSyntax: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP',
    jsonSyntax: 'JSONB',
    migrationTool: 'Prisma / Drizzle ORM / SQL Migrations',
    migrationCommands: {
      generate: 'npx prisma migrate dev --name init_schema',
      apply: 'npx prisma migrate deploy',
      rollback: 'npx prisma migrate resolve --rolled-back <migration_name>',
    },
    indexingRules: [
      { type: 'UNIQUE INDEX', syntax: 'CREATE UNIQUE INDEX idx_users_email ON users(email);', description: 'Enforces 100% email uniqueness and speeds up login queries.' },
      { type: 'BTREE INDEX', syntax: 'CREATE INDEX idx_projects_user_id ON projects(user_id);', description: 'Optimizes foreign key lookup speeds when querying user projects.' },
      { type: 'GIN INDEX', syntax: 'CREATE INDEX idx_events_dimensions ON analytics_events USING GIN (dimensions);', description: 'Enables ultra-fast JSONB key-value searching.' },
    ],
    securityRules: [
      'Enable Row Level Security (RLS) policies on tenant tables.',
      'Hash passwords using Argon2id or Bcrypt with minimum cost factor 12.',
      'Never expose superuser postgres credentials in client applications.',
      'Enforce SSL/TLS connections (`sslmode=require`) in production environments.',
    ],
    backupProcedure: 'Execute automated daily `pg_dump -Fc` snapshots stored in encrypted S3/GCS buckets with 30-day retention policies.',
  },

  MySQL: {
    engine: 'MySQL 8.0+',
    uuidSyntax: 'VARCHAR(36) PRIMARY KEY DEFAULT (UUID())',
    autoIncrementSyntax: 'BIGINT AUTO_INCREMENT PRIMARY KEY',
    timestampSyntax: 'DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    jsonSyntax: 'JSON',
    migrationTool: 'Prisma / TypeORM / Laravel Migrations',
    migrationCommands: {
      generate: 'php artisan make:migration create_tables',
      apply: 'php artisan migrate',
      rollback: 'php artisan migrate:rollback',
    },
    indexingRules: [
      { type: 'UNIQUE INDEX', syntax: 'CREATE UNIQUE INDEX idx_users_email ON users(email);', description: 'Guarantees unique email logins.' },
      { type: 'INDEX', syntax: 'CREATE INDEX idx_orders_user_id ON orders(user_id);', description: 'Accelerates user order history queries.' },
    ],
    securityRules: [
      'Restrict MySQL root user login to localhost only.',
      'Use Bcrypt or Argon2 password hashing.',
      'Ensure strict mode `sql_mode = STRICT_TRANS_TABLES`.',
    ],
    backupProcedure: 'Daily `mysqldump` automated backups stored in cold storage with 14-day retention.',
  },

  SQLite: {
    engine: 'SQLite 3.x',
    uuidSyntax: 'TEXT PRIMARY KEY',
    autoIncrementSyntax: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    timestampSyntax: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    jsonSyntax: 'TEXT',
    migrationTool: 'Drizzle ORM / Better-SQLite3 / Prisma',
    migrationCommands: {
      generate: 'npx drizzle-kit generate:sqlite',
      apply: 'npx drizzle-kit push:sqlite',
      rollback: 'Manual database restore from backup file.',
    },
    indexingRules: [
      { type: 'UNIQUE INDEX', syntax: 'CREATE UNIQUE INDEX idx_users_email ON users(email);', description: 'Enforces fast lookup & email uniqueness.' },
    ],
    securityRules: [
      'Enforce strict file-level read/write permissions (`chmod 600 app.db`).',
      'Do not store SQLite database files inside public HTTP directories.',
    ],
    backupProcedure: 'Automated nightly file copy snapshot of `sqlite.db` file to cloud backup location.',
  },

  MongoDB: {
    engine: 'MongoDB 7.0+',
    uuidSyntax: 'ObjectId / String UUID',
    autoIncrementSyntax: 'Auto-increment sequence helper or ObjectId',
    timestampSyntax: 'ISODate()',
    jsonSyntax: 'BSON Document',
    migrationTool: 'migrate-mongo / Mongoose',
    migrationCommands: {
      generate: 'npx migrate-mongo create init_collections',
      apply: 'npx migrate-mongo up',
      rollback: 'npx migrate-mongo down',
    },
    indexingRules: [
      { type: 'UNIQUE INDEX', syntax: 'db.users.createIndex({ "email": 1 }, { unique: true });', description: 'Fast document search & unique constraint.' },
      { type: 'COMPOUND INDEX', syntax: 'db.orders.createIndex({ "user_id": 1, "created_at": -1 });', description: 'Optimizes paginated user order queries.' },
    ],
    securityRules: [
      'Enable MongoDB authentication (`auth = true`).',
      'Restrict IP access using network security groups.',
    ],
    backupProcedure: 'Automated daily `mongodump` collection archives sent to encrypted cloud bucket.',
  },
};
