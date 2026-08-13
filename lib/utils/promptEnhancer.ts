import { FEATURE_MODULES } from '../engine/dictionaries/featureModules';
import { TECH_STACKS } from '../engine/dictionaries/techStacks';

/**
 * Pure client-side rule-based prompt enhancer ("Smart Polish").
 * Transforms informal, raw user text into structured technical requirements
 * by dynamically scanning feature modules and tech stack dictionaries.
 */
export function enhancePrompt(rawPrompt: string): {
  polishedPrompt: string;
  suggestedStack: string[];
  suggestedFeatures: string[];
  suggestedAppName: string;
} {
  const lower = rawPrompt.toLowerCase();

  // 1. Dynamic Feature Extraction from FEATURE_MODULES
  const suggestedFeatures: string[] = [];
  for (const [moduleName, mod] of Object.entries(FEATURE_MODULES)) {
    const hasKeyword = mod.keywords.some(kw => lower.includes(kw));
    if (hasKeyword) {
      suggestedFeatures.push(moduleName);
    }
  }

  // Fallback defaults if no features detected
  if (suggestedFeatures.length === 0) {
    suggestedFeatures.push('Authentication & Authorization', 'User Profile Management');
  }

  // 2. Dynamic Tech Stack Extraction
  const suggestedStack: string[] = ['TypeScript', 'Tailwind CSS'];
  
  for (const tech of TECH_STACKS) {
    const techLower = tech.name.toLowerCase();
    const idLower = tech.id.toLowerCase();
    if (lower.includes(idLower) || lower.includes(techLower) || tech.keywords?.some(kw => lower.includes(kw))) {
      suggestedStack.push(tech.name);
    }
  }

  // Contextual tech defaults if missing core layers
  if (lower.includes('saas') || lower.includes('sub')) {
    if (!suggestedStack.some(s => s.includes('Next'))) suggestedStack.push('Next.js 14+ (App Router)');
    if (!suggestedStack.some(s => s.includes('Postgre'))) suggestedStack.push('PostgreSQL');
  } else if (lower.includes('shop') || lower.includes('store') || lower.includes('e-commerce') || lower.includes('toko')) {
    if (!suggestedStack.some(s => s.includes('React'))) suggestedStack.push('React + Vite');
    if (!suggestedStack.some(s => s.includes('Postgre'))) suggestedStack.push('PostgreSQL');
    if (!suggestedStack.some(s => s.includes('Prisma'))) suggestedStack.push('Prisma ORM');
  } else {
    if (!suggestedStack.some(s => s.includes('Next'))) suggestedStack.push('Next.js 14+ (App Router)');
    if (!suggestedStack.some(s => s.includes('Postgre'))) suggestedStack.push('PostgreSQL');
  }

  // 3. Extract/Infer Project Name
  const cleanPrompt = rawPrompt.trim().replace(/^bikin\s+|^buat\s+|^create\s+|^build\s+/i, '');
  const suggestedAppName = cleanPrompt.length > 0
    ? cleanPrompt.slice(0, 30).trim()
    : 'Custom Web Application';

  const polishedPrompt = `[POLISHED ARCHITECTURE SPECIFICATION]
Target Application: ${suggestedAppName}
Prompt Input: ${rawPrompt.trim() || 'Modern Web Application'}
Extracted Modules (${suggestedFeatures.length}): ${suggestedFeatures.join(', ')}
Extracted Stack: ${suggestedStack.join(', ')}`;

  return {
    polishedPrompt,
    suggestedStack: Array.from(new Set(suggestedStack)),
    suggestedFeatures: Array.from(new Set(suggestedFeatures)),
    suggestedAppName,
  };
}
