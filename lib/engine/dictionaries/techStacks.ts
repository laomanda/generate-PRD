import { TechStack } from '../types';

export const TECH_STACKS: TechStack[] = [
  { id: 'nextjs', name: 'Next.js 14+ (App Router)', category: 'frontend', description: 'React framework with SSR, App Router & Server Actions' },
  { id: 'react', name: 'React + Vite', category: 'frontend', description: 'Fast client-side React SPA builder' },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'frontend', description: 'Utility-first CSS framework' },
  { id: 'typescript', name: 'TypeScript', category: 'fullstack', description: 'Typed JavaScript for type safety' },
  { id: 'nodejs', name: 'Node.js + Express', category: 'backend', description: 'Event-driven server engine' },
  { id: 'hono', name: 'Hono.js', category: 'backend', description: 'Ultrafast web framework for Edge' },
  { id: 'fastapi', name: 'FastAPI (Python)', category: 'backend', description: 'High performance async Python API' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', description: 'Robust relational SQL database' },
  { id: 'supabase', name: 'Supabase', category: 'backend', description: 'Firebase alternative with PostgreSQL, Auth & Realtime' },
  { id: 'prisma', name: 'Prisma ORM', category: 'database', description: 'Next-generation ORM for Node.js & TypeScript' },
  { id: 'drizzle', name: 'Drizzle ORM', category: 'database', description: 'Lightweight TypeScript ORM' },
];
