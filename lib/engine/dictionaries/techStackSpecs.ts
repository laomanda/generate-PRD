export interface TechnologyDetail {
  name: string;
  version: string;
  category: 'ui' | 'animation' | 'state' | 'fetching' | 'form' | 'backend' | 'database' | 'orm' | 'testing' | 'tooling';
  purpose: string;
  rationale: string;
  envVars?: string[];
}

export const TECH_STACK_DATABASE: Record<string, TechnologyDetail> = {
  'Next.js 14+ (App Router)': {
    name: 'Next.js',
    version: '16.3.0',
    category: 'backend',
    purpose: 'React Framework for Server-Side Rendering, App Router routing, and static export compilation.',
    rationale: 'Next.js App Router delivers zero-JS initial server renders, built-in layout nesting, and optimal SEO out-of-the-box.',
  },
  'React 19': {
    name: 'React',
    version: '19.2.8',
    category: 'ui',
    purpose: 'Declarative component-based UI rendering engine.',
    rationale: 'React 19 introduces automatic memoization compiler features and robust server component primitives.',
  },
  'TypeScript': {
    name: 'TypeScript',
    version: '5.x',
    category: 'tooling',
    purpose: 'Static type checking and interface contract verification across client and engine modules.',
    rationale: 'Prevents runtime null/undefined crashes, improves IDE autocomplete, and enforces strict data models across all code paths.',
  },
  'Tailwind CSS': {
    name: 'Tailwind CSS',
    version: '4.0.0',
    category: 'ui',
    purpose: 'Utility-first CSS framework for high-performance responsive UI styling.',
    rationale: 'Eliminates CSS specificity bugs, generates zero unused CSS rules in production builds, and enables instant design token mapping.',
  },
  'Zustand': {
    name: 'Zustand',
    version: '5.0.14',
    category: 'state',
    purpose: 'Lightweight, unopinionated client state management with local persistence middleware.',
    rationale: 'Avoids React Context re-render performance bottlenecks while providing clean, deterministic state mutations.',
  },
  'Lucide React': {
    name: 'Lucide React',
    version: '1.31.0',
    category: 'ui',
    purpose: 'Consistent, modern pixel-perfect icon set.',
    rationale: 'Clean vector iconography with zero layout shift and lightweight bundle size impact.',
  },
  'Mermaid.js': {
    name: 'Mermaid',
    version: '11.16.1',
    category: 'ui',
    purpose: 'Browser-native text-to-diagram rendering engine for ERDs, flowcharts, and architecture visualizers.',
    rationale: 'Allows architecture and ERD diagrams to be defined in pure Markdown text and dynamically rendered in client UI without external server image generators.',
  },
  'JSZip & FileSaver': {
    name: 'JSZip & FileSaver',
    version: '3.10.1',
    category: 'tooling',
    purpose: 'Client-side ZIP archiving and browser file download trigger.',
    rationale: 'Enables users to download complete 8-file architecture documentation bundles in a single click with zero server memory footprint.',
  },
  'React Hook Form & Zod': {
    name: 'React Hook Form & Zod',
    version: '7.85.0 / 4.4.3',
    category: 'form',
    purpose: 'Form state handling with schema-driven input validation.',
    rationale: 'Guarantees 100% input type safety and zero unnecessary re-renders during form input typing.',
  },
  'PostgreSQL': {
    name: 'PostgreSQL',
    version: '16.x',
    category: 'database',
    purpose: 'Relational ACID-compliant transactional database.',
    rationale: 'Proven industry standard for reliability, strong JSONB document query capabilities, and foreign key integrity constraints.',
  },
  'MySQL': {
    name: 'MySQL',
    version: '8.0',
    category: 'database',
    purpose: 'High-throughput relational database management system.',
    rationale: 'Widespread hosting compatibility, fast read query execution, and robust replication support.',
  },
  'SQLite': {
    name: 'SQLite',
    version: '3.x',
    category: 'database',
    purpose: 'Zero-configuration, serverless, self-contained embedded SQL database engine.',
    rationale: 'Ideal for local desktop tools, edge deployments, and fast unit test execution without database server setups.',
  },
  'MongoDB': {
    name: 'MongoDB',
    version: '7.0',
    category: 'database',
    purpose: 'Document-oriented NoSQL database engine for flexible schema models.',
    rationale: 'Allows high velocity schema iterations for dynamic data attributes and nested document structures.',
  },
  'Framer Motion': {
    name: 'Framer Motion',
    version: '11.x',
    category: 'animation',
    purpose: 'Production-ready animation and gesture library for React.',
    rationale: 'Provides smooth 60fps micro-interactions, layout transitions, and modal entry/exit animations.',
  },
  'Shiki': {
    name: 'Shiki',
    version: '4.4.3',
    category: 'ui',
    purpose: 'VS Code accurate syntax highlighter for code snippets and raw Markdown displays.',
    rationale: 'Renders code blocks using TextMate grammars for identical visual fidelity to modern IDEs.',
  },
};

export const CORE_VERSION_COMPATIBILITY = [
  { requirement: 'Node.js Runtime', constraint: '>= 20.10.0 LTS', rationale: 'Required for modern ESNext features and native fetch API.' },
  { requirement: 'React Framework', constraint: '^19.0.0', rationale: 'Ensures support for modern React hooks and compiler optimizations.' },
  { requirement: 'TypeScript Strict Mode', constraint: '>= 5.0.0', rationale: 'Enforces strict null checks, noImplicitAny, and exact optional property types.' },
  { requirement: 'Tailwind CSS PostCSS', constraint: '^4.0.0', rationale: 'Utilizes high-speed Rust-based CSS engine for sub-millisecond compilation.' },
];
