/**
 * ============================================================================
 * SMART COMPOSER ENGINE
 * ============================================================================
 * Pure function that takes ProjectConfig and composes a unified spec by:
 * 1. Detecting relevant feature modules from features[] and description keywords
 * 2. Merging tables (deduplicating shared tables like `users`)
 * 3. Merging requirements, goals, problem fragments, user flows
 * 4. Injecting projectName and description throughout
 *
 * This is the core that ensures DIFFERENT INPUTS = DIFFERENT OUTPUTS.
 * ============================================================================
 */

import { ProjectConfig } from './types';
import { FEATURE_MODULES, FeatureModule, FeatureModuleTable, FeatureModuleRequirement } from './dictionaries/featureModules';
import { APP_TYPE_SPECS, AppTypeSpec } from './dictionaries/appTypeSpecs';

export interface ComposedSpec {
  /** Resolved app name — always uses user's projectName */
  appName: string;
  /** Resolved app description — always uses user's description */
  appDescription: string;
  /** App type spec (base) */
  appTypeSpec: AppTypeSpec;
  /** Detected feature modules */
  detectedModules: FeatureModule[];
  /** Merged & deduplicated tables */
  tables: FeatureModuleTable[];
  /** Merged Mermaid relationships */
  mermaidRelationships: string[];
  /** Merged functional requirements */
  requirements: FeatureModuleRequirement[];
  /** Composed problem statement */
  problemStatement: string;
  /** Composed goals */
  goals: string[];
  /** Composed user flow steps */
  userFlowSteps: string[];
  /** Composed target users */
  targetUsers: { role: string; need: string }[];
  /** Composed in-scope items */
  inScope: string[];
  /** Composed out-of-scope items */
  outOfScope: string[];
  /** Composed security notes */
  securityNotes: string[];
  /** Composed API endpoints */
  apiEndpoints: string[];
  /** Composed UI pages */
  uiPages: string[];
  /** Composed KPIs */
  kpis: string[];
}

/**
 * Detect which feature modules match the user's selected features and description keywords.
 */
function detectFeatureModules(features: string[], description: string): FeatureModule[] {
  const descLower = description.toLowerCase();
  const detected = new Map<string, FeatureModule>();

  // 1. Direct match: user's features[] directly match module names
  for (const featureName of features) {
    if (FEATURE_MODULES[featureName]) {
      detected.set(featureName, FEATURE_MODULES[featureName]);
    }
  }

  // 2. Keyword match: scan description for module keywords
  for (const [moduleName, mod] of Object.entries(FEATURE_MODULES)) {
    if (detected.has(moduleName)) continue;
    const hasKeyword = mod.keywords.some(kw => descLower.includes(kw));
    if (hasKeyword) {
      detected.set(moduleName, mod);
    }
  }

  // 3. Fuzzy match: user's features[] partially match module names
  for (const featureName of features) {
    const featureLower = featureName.toLowerCase();
    for (const [moduleName, mod] of Object.entries(FEATURE_MODULES)) {
      if (detected.has(moduleName)) continue;
      const moduleNameLower = moduleName.toLowerCase();
      if (
        moduleNameLower.includes(featureLower) ||
        featureLower.includes(moduleNameLower) ||
        mod.keywords.some(kw => featureLower.includes(kw))
      ) {
        detected.set(moduleName, mod);
      }
    }
  }

  return Array.from(detected.values());
}

/**
 * Merge tables from multiple modules, deduplicating by table name.
 * When two modules both define a `users` table, merge their columns
 * (keeping unique columns from both, preferring the first occurrence).
 */
function mergeTables(modules: FeatureModule[]): FeatureModuleTable[] {
  const tableMap = new Map<string, FeatureModuleTable>();

  for (const mod of modules) {
    for (const table of mod.tables) {
      if (tableMap.has(table.name)) {
        // Merge columns: add new columns from this module's table
        const existing = tableMap.get(table.name)!;
        const existingColNames = new Set(existing.columns.map(c => c.name));
        for (const col of table.columns) {
          if (!existingColNames.has(col.name)) {
            existing.columns.push(col);
          }
        }
        // Keep the richer description
        if (table.description.length > existing.description.length) {
          existing.description = table.description;
        }
      } else {
        // Deep clone to avoid mutation
        tableMap.set(table.name, {
          ...table,
          columns: [...table.columns],
        });
      }
    }
  }

  return Array.from(tableMap.values());
}

/**
 * Compose a unified spec from ProjectConfig by detecting and merging feature modules.
 */
export function composeProjectSpec(config: ProjectConfig): ComposedSpec {
  const { projectName, appType, description, features } = config;
  const appTypeSpec = APP_TYPE_SPECS[appType] || APP_TYPE_SPECS.saas;

  const appName = projectName || 'Untitled Project';
  const appDescription = description || appTypeSpec.summary;

  // Detect feature modules
  const detectedModules = detectFeatureModules(features, description);

  // If no modules detected, fall back to base appType modules
  const hasModules = detectedModules.length > 0;

  // Merge tables
  const tables = hasModules
    ? mergeTables(detectedModules)
    : appTypeSpec.tables.map(t => ({
        ...t,
        columns: [...t.columns],
      }));

  // Merge mermaid relationships (deduplicate)
  const mermaidRelationships = hasModules
    ? [...new Set(detectedModules.flatMap(m => m.mermaidRelationships))]
    : appTypeSpec.mermaidRelationships;

  // Merge requirements
  const requirements = hasModules
    ? detectedModules.flatMap(m => m.requirements)
    : appTypeSpec.functionalRequirements;

  // Compose problem statement from fragments
  const problemStatement = hasModules
    ? `${appName} addresses critical pain points: ${detectedModules.map(m => m.problemFragment).join(' Additionally, ')}`
    : appTypeSpec.problemStatement;

  // Compose goals — take up to 2 goals from each module, deduplicate
  const goals = hasModules
    ? [...new Set(detectedModules.flatMap(m => m.goals.slice(0, 2)))]
    : appTypeSpec.goals;

  // Compose user flow steps
  const userFlowSteps = hasModules
    ? detectedModules.flatMap(m => m.userFlowSteps.slice(0, 3))
    : appTypeSpec.userFlow;

  // Compose target users from modules
  const targetUsers = hasModules
    ? deriveTargetUsers(detectedModules, appTypeSpec)
    : appTypeSpec.targetUsers;

  // Compose in-scope from module names + user features
  const inScope = hasModules
    ? [...detectedModules.map(m => `${m.name}: Full implementation with ${m.tables.length} database table(s) and ${m.requirements.length} functional requirement(s).`)]
    : appTypeSpec.inScope;

  // Compose out-of-scope
  const outOfScope = hasModules
    ? deriveOutOfScope(detectedModules)
    : appTypeSpec.outOfScope;

  // Compose security notes
  const securityNotes = hasModules
    ? [...new Set(detectedModules.flatMap(m => m.securityNotes.slice(0, 2)))]
    : [];

  // Compose API endpoints
  const apiEndpoints = hasModules
    ? detectedModules.flatMap(m => m.apiEndpoints)
    : [];

  // Compose UI pages
  const uiPages = hasModules
    ? [...new Set(detectedModules.flatMap(m => m.uiPages))]
    : [];

  // Compose KPIs
  const kpis = hasModules
    ? deriveKPIs(detectedModules)
    : appTypeSpec.kpis;

  return {
    appName,
    appDescription,
    appTypeSpec,
    detectedModules,
    tables,
    mermaidRelationships,
    requirements,
    problemStatement,
    goals,
    userFlowSteps,
    targetUsers,
    inScope,
    outOfScope,
    securityNotes,
    apiEndpoints,
    uiPages,
    kpis,
  };
}

/**
 * Derive target users from detected modules and base spec.
 */
function deriveTargetUsers(modules: FeatureModule[], baseSpec: AppTypeSpec): { role: string; need: string }[] {
  const users: { role: string; need: string }[] = [...baseSpec.targetUsers];
  const roleSet = new Set(users.map(u => u.role));

  // Add module-specific user roles
  const moduleRoles: Record<string, { role: string; need: string }> = {
    auth: { role: 'Registered User', need: 'Secure login, session management, and account recovery.' },
    payment: { role: 'Paying Customer', need: 'Transparent pricing, fast checkout, and accessible invoice history.' },
    analytics: { role: 'Data Analyst / Product Owner', need: 'Real-time metrics visualization, trend analysis, and data export.' },
    chat: { role: 'Team Collaborator', need: 'Instant messaging, channel organization, and real-time presence.' },
    blog: { role: 'Content Author / Editor', need: 'Rich text editing, draft management, and SEO metadata control.' },
    inventory: { role: 'Store Manager / Warehouse Admin', need: 'Stock level monitoring, restock alerts, and movement audit logs.' },
    booking: { role: 'Customer / Client', need: 'Easy appointment scheduling, calendar view, and booking management.' },
    rbac: { role: 'System Administrator', need: 'Role assignment, permission matrix management, and access audit.' },
  };

  for (const mod of modules) {
    const targetRole = moduleRoles[mod.id];
    if (targetRole && !roleSet.has(targetRole.role)) {
      users.push(targetRole);
      roleSet.add(targetRole.role);
    }
  }

  return users.slice(0, 5); // Cap at 5 for readability
}

/**
 * Derive out-of-scope items based on which modules are NOT selected.
 */
function deriveOutOfScope(selectedModules: FeatureModule[]): string[] {
  const selectedIds = new Set(selectedModules.map(m => m.id));
  const outOfScope: string[] = [];

  const exclusions: Record<string, string> = {
    'chat': 'Real-time WebSocket chat & messaging system.',
    'booking': 'Calendar-based appointment booking & scheduling.',
    'i18n': 'Multi-language internationalization (i18n/L10n).',
    'email-marketing': 'Email campaign management & subscriber segmentation.',
    'social': 'Social feed features (likes, comments, reactions).',
    'inventory': 'Inventory warehouse management & stock tracking.',
    'analytics': 'Analytics dashboard & custom reporting engine.',
    'file-upload': 'Cloud media file upload & CDN management.',
    'search': 'Full-text search engine & faceted filtering.',
    'api-webhooks': 'Developer API key management & webhook delivery pipeline.',
  };

  for (const [id, description] of Object.entries(exclusions)) {
    if (!selectedIds.has(id)) {
      outOfScope.push(`${description}: Excluded from current scope — may be implemented in future releases.`);
    }
  }

  return outOfScope.slice(0, 5); // Cap at 5 for readability
}

/**
 * Derive KPIs from detected modules.
 */
function deriveKPIs(modules: FeatureModule[]): string[] {
  const kpiMap: Record<string, string> = {
    auth: 'User Activation Rate (>65% within first 48 hours)',
    payment: 'Checkout Conversion Rate (>85%)',
    notification: 'Notification Delivery Latency (<500ms)',
    chat: 'Message Delivery Latency (<100ms P99)',
    analytics: 'Dashboard Render Time (<300ms)',
    blog: 'Content Publish-to-Index Time (<60 seconds)',
    inventory: 'Stock Accuracy Rate (>99.5%)',
    booking: 'Booking Completion Rate (>90%)',
    search: 'Search Result Latency (<150ms P95)',
    rbac: 'Permission Enforcement Coverage (100% of protected routes)',
    workspace: 'Workspace Provisioning Time (<3 seconds)',
    'file-upload': 'Upload Success Rate (>99%)',
    profile: 'Profile Completion Rate (>80%)',
    social: 'User Engagement Rate (>40% daily active)',
    'email-marketing': 'Email Open Rate (>25%)',
    'api-webhooks': 'Webhook Delivery Success Rate (>99.9%)',
    i18n: 'Translation Coverage (>95% of UI strings)',
  };

  return modules
    .map(m => kpiMap[m.id])
    .filter((kpi): kpi is string => !!kpi);
}
