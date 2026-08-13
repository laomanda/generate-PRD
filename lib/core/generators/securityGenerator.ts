import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildSecurityIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('SECURITY', `Security Documentation`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Data Sensitivity Score', `${project.signals.dataSensitivityScore}/10`)
    .setMetadata('Risk Level', project.signals.riskLevel.toUpperCase());

  // Consume internal provenance inferred facts
  const facts = project.inferredFacts.filter(f => f.category === 'security' || f.source === 'USER_EXPLICIT');
  const inferences = project.inferredFacts.filter(f => f.source === 'CONTEXT_INFERENCE' || f.source === 'KNOWLEDGE_GRAPH');

  const factSummary = facts.length > 0
    ? facts.map(f => f.fact).join('; ')
    : 'Standard application security profile.';

  const inferenceSummary = inferences.length > 0
    ? inferences.map(f => `${f.fact} (Confidence: ${Math.round(f.confidence * 100)}%)`).join('; ')
    : 'Low data sensitivity assumptions.';

  const sections = [
    { id: 'overview', title: '1. Security Overview', text: `Security architecture for **${project.projectName}** under ${project.signals.riskLevel.toUpperCase()} risk classification. Verified facts: ${factSummary}.` },
    { id: 'auth', title: '2. Authentication', text: project.signals.authComplexity === 'jwt_session' ? 'JWT session tokens with HTTP-only, Secure, SameSite cookies.' : 'Strict session-based authentication with CSRF token validation.' },
    { id: 'authorization', title: '3. Authorization', text: `Role-based access control engine (${project.signals.authComplexity}). Inferred security constraints: ${inferenceSummary}.` },
    { id: 'rbac-model', title: '4. Role & Permission Model', text: `Permissions catalog for roles: ${project.domain.userRoles.map(u => u.role).join(', ')}.` },
    { id: 'session-mgmt', title: '5. Session Management', text: project.signals.riskLevel === 'high' || project.signals.riskLevel === 'critical' ? '15-minute access token expiration with 1-day refresh token rotation. Absolute session termination on idle timeout.' : '1-day access token expiration with 7-day refresh token rotation.' },
    { id: 'password-sec', title: '6. Password Security', text: 'Argon2id or Bcrypt password hashing (work factor 12).' },
    { id: 'data-protection', title: '7. Data Protection', text: `Data Sensitivity Score ${project.signals.dataSensitivityScore}/10. ${project.signals.dataSensitivityScore >= 8 ? 'Column-level AES-256-GCM encryption for all PII/PHI. Hardware Security Module (HSM) key derivation.' : 'Encryption at rest via provider-level AES-256 disk encryption.'}` },
    { id: 'input-validation', title: '8. Input Validation', text: 'Strict server-side validation using Zod schemas on all endpoints.' },
    { id: 'output-encoding', title: '9. Output Encoding', text: 'Context-aware HTML/JSON escaping to prevent Cross-Site Scripting (XSS).' },
    { id: 'api-security', title: '10. API Security', text: project.signals.riskLevel === 'high' ? 'Strict IP whitelisting, mutual TLS (mTLS) for B2B endpoints, Rate limiting (100 req/min), CORS strict origin.' : 'Rate limiting, CORS whitelist, and request payload size limits (max 1MB).' },
    { id: 'db-security', title: '11. Database Security', text: 'Parameterized SQL queries preventing SQL Injection attacks.' },
    { id: 'file-upload-sec', title: '12. File Upload Security', text: 'MIME-type verification, magic byte scanning, and storage in isolated buckets.' },
    { id: 'secrets-mgmt', title: '13. Secrets Management', text: 'Environment variables loaded at runtime. Zero plaintext credentials committed.' },
    { id: 'env-security', title: '14. Environment Security', text: 'Isolated Staging and Production deployment environments.' },
    { id: 'access-control', title: '15. Access Control', text: 'Principle of Least Privilege (PoLP) enforced across all infrastructure.' },
    { id: 'audit-trail', title: '16. Logging & Audit Trail', text: project.signals.riskLevel === 'high' || project.signals.riskLevel === 'critical' ? 'Immutable append-only WORM (Write Once Read Many) audit log table recording all state mutations and read access for PII.' : 'Immutable append-only audit log table recording state mutations.' },
    { id: 'sec-headers', title: '17. Security Headers', text: 'HSTS, CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff.' },
    { id: 'dependency-sec', title: '18. Dependency Security', text: 'Automated vulnerability scanning via `npm audit` / Dependabot.' },
    { id: 'threat-considerations', title: '19. Threat Considerations', text: 'Mitigations against OWASP Top 10 web vulnerabilities.' },
    { id: 'recommendations', title: '20. Security Recommendations', text: project.signals.financialInvolvement ? 'Schedule annual PCI-DSS and SOC2 compliance audits. Implement rigorous financial anomaly detection.' : 'Schedule annual third-party penetration testing audits.' },
  ];

  sections.forEach(s => {
    builder.addSection({
      id: s.id,
      title: s.title,
      level: 2,
      nodes: [{ type: 'paragraph', text: s.text }],
    });
  });

  return builder.build();
}

export function generateSecurity(project: ProjectModel): string {
  const ir = buildSecurityIR(project);
  return renderDocumentIRToMarkdown(ir);
}
