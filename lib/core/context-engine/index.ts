import { ProjectModel, ContextSignals } from '../project-model/schemas';

/**
 * ============================================================================
 * CONTEXT ENGINE
 * ============================================================================
 * Evaluates raw project facts and computes contextual signals:
 * - Data Sensitivity Score (0-10)
 * - Risk Level (low, medium, high, critical)
 * - Financial Involvement (boolean)
 * - Auth Complexity (none, basic, jwt_session, rbac, multi_tenant_rls)
 * - Scalability Tier
 * - Design & Database Complexity Tiers
 * ============================================================================
 */

export function evaluateContextSignals(project: Partial<ProjectModel>): ContextSignals {
  const domainKey = project.domain?.industryType || 'custom';
  const desc = (project.description || '').toLowerCase();
  const rawPrompt = (project.rawPrompt || '').toLowerCase();
  const techNames = (project.techStack || []).map(t => t.name.toLowerCase());
  const features = (project.features || []).map(f => f.toLowerCase());

  const fullText = `${desc} ${rawPrompt} ${features.join(' ')}`;

  // 1. Financial Involvement
  const financialKeywords = ['payment', 'billing', 'stripe', 'invoice', 'checkout', 'money', 'harga', 'bayar', 'sub', 'keuangan', 'donasi'];
  const hasFinancial =
    domainKey === 'ecommerce' ||
    domainKey === 'finance' ||
    techNames.some(t => t.includes('stripe') || t.includes('midtrans')) ||
    financialKeywords.some(kw => fullText.includes(kw));

  // 2. Data Sensitivity Score (0 to 10)
  let sensitivity = 3; // Default baseline
  if (domainKey === 'healthcare') sensitivity += 5; // HIPAA / Patient data
  if (domainKey === 'finance') sensitivity += 4; // Financial accounts
  if (domainKey === 'education') sensitivity += 2; // Minor / Student records
  if (hasFinancial) sensitivity += 2;
  if (fullText.includes('medical') || fullText.includes('pasien') || fullText.includes('rekam medis')) sensitivity += 3;
  sensitivity = Math.min(10, sensitivity);

  // 3. Auth Complexity
  let authComplexity: ContextSignals['authComplexity'] = 'basic';
  const hasRBAC = features.some(f => f.includes('rbac') || f.includes('role')) || fullText.includes('rbac') || fullText.includes('role');
  const hasMultiTenant = features.some(f => f.includes('workspace') || f.includes('tenant')) || fullText.includes('tenant') || fullText.includes('workspace');

  if (hasMultiTenant) {
    authComplexity = 'multi_tenant_rls';
  } else if (hasRBAC) {
    authComplexity = 'rbac';
  } else if (techNames.some(t => t.includes('supabase') || t.includes('auth'))) {
    authComplexity = 'jwt_session';
  }

  // 4. Risk Level
  let riskLevel: ContextSignals['riskLevel'] = 'low';
  if (sensitivity >= 8 || (hasFinancial && hasMultiTenant)) {
    riskLevel = 'critical';
  } else if (sensitivity >= 6 || hasFinancial || hasRBAC) {
    riskLevel = 'high';
  } else if (sensitivity >= 4) {
    riskLevel = 'medium';
  }

  // 5. Scalability Tier
  let expectedScalability: ContextSignals['expectedScalability'] = 'serverless_edge';
  if (techNames.some(t => t.includes('docker') || t.includes('kubernetes') || t.includes('microservice'))) {
    expectedScalability = 'distributed_cluster';
  }

  // 6. Design Complexity Tier
  let designComplexity: ContextSignals['designComplexity'] = 'moderate';
  if (domainKey === 'saas' || domainKey === 'finance' || fullText.includes('dashboard') || fullText.includes('analytics')) {
    designComplexity = 'high_density_dashboard';
  }

  // 7. Database Complexity Tier
  let databaseComplexity: ContextSignals['databaseComplexity'] = 'relational_fk';
  if (hasMultiTenant || sensitivity >= 7) {
    databaseComplexity = 'multi_tenant_schema';
  }

  return {
    dataSensitivityScore: sensitivity,
    authComplexity,
    financialInvolvement: hasFinancial,
    riskLevel,
    expectedScalability,
    designComplexity,
    databaseComplexity,
  };
}
