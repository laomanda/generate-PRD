import { DatabasePreset } from '../types';

export const DB_PRESETS: DatabasePreset[] = [
  {
    id: 'postgres-saas',
    name: 'SaaS Multi-tenant Relational Preset',
    dialect: 'postgresql',
    tables: ['users', 'organizations', 'memberships', 'subscriptions', 'audit_logs'],
  },
  {
    id: 'postgres-ecommerce',
    name: 'E-Commerce Core Schema Preset',
    dialect: 'postgresql',
    tables: ['users', 'products', 'categories', 'orders', 'order_items', 'payments'],
  },
  {
    id: 'sqlite-light',
    name: 'Lightweight Local SQLite Preset',
    dialect: 'sqlite',
    tables: ['users', 'sessions', 'documents', 'settings'],
  },
];
