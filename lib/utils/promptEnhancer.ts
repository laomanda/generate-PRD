/**
 * Pure client-side rule-based prompt enhancer ("Smart Polish").
 * Transforms informal, raw user text into structured technical requirements.
 */
export function enhancePrompt(rawPrompt: string): {
  polishedPrompt: string;
  suggestedStack: string[];
  suggestedFeatures: string[];
} {
  const lower = rawPrompt.toLowerCase();

  const suggestedStack: string[] = ['TypeScript', 'Tailwind CSS'];
  const suggestedFeatures: string[] = ['User Authentication & Authorization', 'Responsive Dashboard Layout'];

  if (lower.includes('saas') || lower.includes('sub')) {
    suggestedStack.push('Next.js 14+ (App Router)', 'PostgreSQL', 'Supabase');
    suggestedFeatures.push('Subscription Tier Billing', 'Multi-tenant Workspaces');
  } else if (lower.includes('shop') || lower.includes('store') || lower.includes('e-commerce')) {
    suggestedStack.push('React + Vite', 'PostgreSQL', 'Prisma ORM');
    suggestedFeatures.push('Product Catalog Search', 'Cart & Stripe Checkout');
  } else {
    suggestedStack.push('Next.js 14+ (App Router)', 'PostgreSQL');
    suggestedFeatures.push('Real-time Notifications', 'Role-Based Access Control');
  }

  const polishedPrompt = `[POLISHED ARCHITECTURE SPECIFICATION]
Project Goal: ${rawPrompt.trim() || 'Modern Web Application'}
Target Standard: Production-grade client architecture with zero server latency.
Inferred Domain Requirements: High performance, type-safe data pipelines, and modular design.`;

  return {
    polishedPrompt,
    suggestedStack: Array.from(new Set(suggestedStack)),
    suggestedFeatures: Array.from(new Set(suggestedFeatures)),
  };
}
