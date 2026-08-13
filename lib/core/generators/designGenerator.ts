import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildDesignIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('DESIGN', `Design System & UX Specification`)
    .setMetadata('Target System', project.projectName)
    .setMetadata('Visual Vibe', project.designVibe)
    .setMetadata('Design Complexity', project.signals.designComplexity);

  const designVibe = project.designVibe || 'Clean and Minimalist';
  const entities = project.domain.entities;
  const entityNames = entities.map(e => e.name).filter(n => n !== 'User');
  const roles = project.domain.userRoles.map(r => r.role);
  const workflows = project.domain.coreWorkflows;
  const domainText = (project.domain.domainName + ' ' + project.description).toLowerCase();

  const primaryRole = roles[0] || 'User';
  const secondaryRole = roles[1] || 'Operator';
  const primaryEntity = entityNames[0] || 'Record';
  const secondaryEntity = entityNames[1] || 'Item';

  let colorSchemeName = 'Zinc Slate & Indigo Accent';
  if (domainText.includes('health') || domainText.includes('patient') || domainText.includes('medical')) {
    colorSchemeName = 'Clinical Clean (Calm Teal #0D9488, Soft Slate #0F172A, Pure White #FFFFFF)';
  } else if (domainText.includes('vehicle') || domainText.includes('rental') || domainText.includes('car')) {
    colorSchemeName = 'Industrial Fleet (Steel Blue #1E3A8A, Safety Amber #F59E0B, Dark Metal #111827)';
  } else if (domainText.includes('drone') || domainText.includes('flight') || domainText.includes('telemetry')) {
    colorSchemeName = 'High-Visibility Tactical (Tactical Amber #D97706, Radar Cyan #06B6D4, Stealth Black #09090B)';
  } else if (domainText.includes('product') || domainText.includes('cart') || domainText.includes('store') || domainText.includes('shop')) {
    colorSchemeName = 'Conversion Emerald (Emerald Green #059669, Vivid Violet #7C3AED, Warm Neutral #FAF5FF)';
  } else if (domainText.includes('event') || domainText.includes('ticket')) {
    colorSchemeName = 'High-Energy Neon (Electric Purple #9333EA, Neon Cyan #22D3EE, Midnight Background #0F172A)';
  }

  const colorSystem = `Color palette tokens: ${colorSchemeName} defined in CSS variables matching ${designVibe} aesthetics for ${project.projectName}.`;
  const typography = `Typography tokens: Inter / Geist Sans for ${project.projectName} UI body text, JetBrains Mono for ${primaryEntity} code identifiers.`;
  const uxRules = `Never hide active loading indicators. Always require confirm modal for destructive ${primaryEntity} state changes.`;
  const designRationale = `High-legibility layout and contrast scale chosen to minimize cognitive friction for ${primaryRole} and ${secondaryRole} users.`;
  const visualDir = `Modern UI design direction utilizing ${colorSchemeName} guidelines tailored specifically for ${project.projectName}.`;
  const spacingSystem = `Tailwind baseline scale (4px/8px) configured for data-dense ${primaryEntity} grid tables and forms.`;

  const gridCols = 12;
  const gutter = 20;

  const layoutGrid = `${gridCols}-column responsive fluid layout grid with ${gutter}px gutters customized for ${project.projectName}.`;
  const responsiveDesign = `Fluid responsive viewports scaling across mobile, tablet, and desktop displays for ${roles.join(', ')}.`;
  const principles = `Interface Clarity, ${primaryEntity} Data Legibility, Task Efficiency, Operational Speed.`;

  const sections = [
    { id: 'design-overview', title: '1. Design Overview', text: `Visual design system for **${project.projectName}** supporting ${project.domain.domainName} operations.` },
    { id: 'design-principles', title: '2. Design Principles', text: principles },
    { id: 'visual-direction', title: '3. Visual Direction', text: visualDir },
    { id: 'color-system', title: '4. Color System', text: colorSystem },
    { id: 'typography', title: '5. Typography', text: typography },
    { id: 'spacing-system', title: '6. Spacing System', text: spacingSystem },
    { id: 'border-radius', title: '7. Border Radius', text: `Rounded corner tokens customized for ${primaryRole} views: sm (4px) for ${primaryEntity} tags, md (6px) for ${secondaryEntity} inputs, lg (8px) for modal containers.` },
    { id: 'elevation-shadows', title: '8. Elevation & Shadows', text: `Elevation surfaces layered specifically for ${primaryEntity} list items and ${secondaryEntity} drawer dialogs.` },
    { id: 'layout-grid', title: '9. Layout & Grid', text: layoutGrid },
    { id: 'responsive-design', title: '10. Responsive Design', text: responsiveDesign },
    { id: 'breakpoints', title: '11. Breakpoints', text: `Responsive layout breakpoints tuned for ${primaryRole} viewports: Mobile (sm: 640px), Tablet (md: 768px), Desktop Workspace (lg: 1024px, xl: 1280px).` },
    { id: 'components', title: '12. Components', text: `Dedicated component suite for ${project.projectName}: ${entityNames.map(e => `${e}Card, ${e}Table, ${e}FormModal`).join(', ')}.` },
    { id: 'component-variants', title: '13. Component Variants', text: `Status badges and button variants for ${entityNames.slice(0, 3).join(', ')} lifecycle states.` },
    { id: 'component-states', title: '14. Component States', text: `Interactive UI states (Default, Hover, Active, Focus-Visible, Disabled, Loading) for ${roles.join(' and ')} actions.` },
    { id: 'pages-screens', title: '15. Pages & Screens', text: `Primary application views: ${workflows.map(w => `${w} Screen`).join(', ')}.` },
    { id: 'navigation', title: '16. Navigation', text: `Navigation sidebar mapping core domain workspaces: ${entityNames.map(e => `${e} Management`).join(', ')}.` },
    { id: 'user-flows', title: '17. User Flows', text: `Step-by-step UI task flow for executing ${workflows[0] || 'primary domain actions'}.` },
    { id: 'interaction-behavior', title: '18. Interaction & Behavior', text: `Optimistic UI state updates for ${primaryEntity} mutations with sub-16ms touch responsiveness.` },
    { id: 'forms-ux', title: '19. Forms & Validation UX', text: `Strict Zod schema form validation with inline error messages for ${entityNames.slice(0, 3).join(', ')} inputs.` },
    { id: 'loading-states', title: '20. Loading States', text: `Skeleton shimmer loading placeholders geometry-matched to ${primaryEntity} data tables.` },
    { id: 'empty-states', title: '21. Empty States', text: `Empty state callout encouraging ${primaryRole} users to register their first ${primaryEntity}.` },
    { id: 'error-states', title: '22. Error States', text: `Toast notifications and alert banners for ${project.projectName} operational failure events.` },
    { id: 'success-feedback', title: '23. Success Feedback', text: `Auto-dismissing success toasts confirming ${primaryEntity} creation and state updates.` },
    { id: 'animation-motion', title: '24. Animation & Motion', text: `150ms ease-out transitions for ${secondaryEntity} detail drawers and modal dialogs.` },
    { id: 'ux-rules', title: '25. UX Rules', text: uxRules },
    { id: 'accessibility', title: '26. Accessibility', text: `WCAG 2.1 AA accessibility compliance for ${roles.join(', ')} viewports.` },
    { id: 'iconography', title: '27. Iconography', text: `Lucide-React icon set customized for ${primaryEntity} actions and ${roles.join(', ')} workflows.` },
    { id: 'imagery-assets', title: '28. Imagery & Assets', text: `Optimized WebP graphics and vector icons representing ${project.projectName} resources.` },
    { id: 'design-tokens', title: '29. Design Tokens', text: `Design token schema exporting ${colorSchemeName} variables directly to Tailwind CSS.` },
    { id: 'design-decisions', title: '30. Design Decisions & Rationale', text: designRationale },
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

export function generateDesignSystem(project: ProjectModel): string {
  const ir = buildDesignIR(project);
  return renderDocumentIRToMarkdown(ir);
}
