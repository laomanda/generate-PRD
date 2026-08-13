import { ProjectConfig } from '../types';
import { DESIGN_VIBE_SPECS } from '../dictionaries/designVibeSpecs';
import { composeProjectSpec } from '../composer';

export function generateDesignSystem(config: ProjectConfig): string {
  const { designVibe } = config;
  const spec = composeProjectSpec(config);
  const { appName, uiPages, tables } = spec;

  const vibeName = designVibe || 'Modern IDE Dark (Zinc & Indigo)';
  const vibe = DESIGN_VIBE_SPECS[vibeName] || DESIGN_VIBE_SPECS['Modern IDE Dark (Zinc & Indigo)'];
  const primaryEntity = tables[0]?.name || 'record';
  const entityTitle = primaryEntity.charAt(0).toUpperCase() + primaryEntity.slice(1);

  return `# 🎨 DESIGN SYSTEM & VISUAL GUIDELINES

> **Single Source of Truth UI/UX Visual Directive**  
> **Target Product**: **${appName}**  
> **Theme Concept**: **${vibe.name}**  
> **Core Direction**: *${vibe.direction}*

---

## 1. Design Overview ⭐
- **Design Direction**: ${vibe.direction}
- **Vibe Concept**: ${vibe.concept}
- **Primary Typography**: UI font \`${vibe.fontFamily.ui}\`, Code font \`${vibe.fontFamily.code}\`.
- **Target Product Domain**: **${appName}** (${uiPages.length} screens defined).

---

## 2. Design Principles
1. **High Contrast & Clarity**: Text and UI elements must meet WCAG AA contrast standards (>4.5:1 ratio).
2. **Domain-First Visual Hierarchy**: Essential ${primaryEntity} data points highlighted using high-density status badges and crisp borders.
3. **Monospaced Precision**: Numerical metrics, codes, table data, and timestamps use monospaced fonts for exact visual alignment.
4. **Deterministic UI Feedback**: All interactive buttons, forms, and modals provide instant visual state feedback (Hover, Active, Loading, Focus).

---

## 3. Design System ⭐

### 3.1 Color Token Matrix
| Token Name | Hex Code | Tailwind Utility Class | Usage |
| :--- | :--- | :--- | :--- |
${vibe.colors.map(c => `| \`${c.name}\` | \`${c.hex}\` | \`${c.tailwind}\` | ${c.usage} |`).join('\n')}

### 3.2 Typography Scale
- **UI Font Stack**: \`${vibe.fontFamily.ui}\`
- **Code Font Stack**: \`${vibe.fontFamily.code}\`
- **Headings**:
  - **H1 (Page Title)**: \`text-3xl sm:text-5xl font-mono font-extrabold tracking-tight\`
  - **H2 (Section Header)**: \`text-2xl sm:text-3xl font-mono font-bold\`
  - **H3 (Card / Subsection)**: \`text-sm sm:text-base font-mono font-bold uppercase tracking-wider\`
- **Body & Subtitles**:
  - **Body Normal**: \`text-sm font-sans text-zinc-300\`
  - **Muted Subtitle**: \`text-xs font-sans text-zinc-400\`
  - **Inline Code / Badges**: \`font-mono text-xs text-indigo-400 bg-zinc-950 px-1.5 py-0.5 rounded\`

### 3.3 Spacing Scale
| Name | Pixel Value | Tailwind Utility Class |
| :--- | :--- | :--- |
${vibe.spacingScale.map(s => `| \`${s.name}\` | \`${s.px}\` | \`${s.tailwind}\` |`).join('\n')}

### 3.4 Border Radius Scale
| Name | Pixel Value | Tailwind Utility Class |
| :--- | :--- | :--- |
${vibe.borderRadius.map(r => `| \`${r.name}\` | \`${r.px}\` | \`${r.tailwind}\` |`).join('\n')}

---

## 4. Layout & Grid ⭐
- **Desktop Grid (>1024px)**: Max-width \`1280px\` (\`max-w-7xl mx-auto\`), 12-column grid layout, \`32px\` horizontal padding.
- **Tablet Grid (768px - 1024px)**: 2-column grid layout, \`24px\` horizontal padding.
- **Mobile Grid (<768px)**: 1-column stacked layout, \`16px\` horizontal padding.

---

## 5. Required Pages & Screen Map for ${appName} ⭐
${uiPages.map((page, idx) => `
### 5.${idx + 1} Screen: ${page}
- **Layout**: High-density card layout with responsive filter bar and table container.
- **Key Elements**: Search bar, status badges, pagination controls, action buttons.
`).join('\n')}

---

## 6. Components Specifications ⭐

### 6.1 Buttons
- **Primary CTA**: \`${vibe.buttonStates.primary}\`
- **Secondary**: \`${vibe.buttonStates.secondary}\`
- **Outline**: \`${vibe.buttonStates.outline}\`
- **Danger / Destructive**: \`${vibe.buttonStates.danger}\`

### 6.2 Domain Component Code Snippet (TSX for ${appName})

\`\`\`tsx
// Domain Component: ${entityTitle} Data Card for ${appName}
export function ${entityTitle}Card({ title, status, details }: { title: string; status: string; details: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl text-zinc-100 font-mono">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-indigo-400">{title}</h3>
        <span className="bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
          {status}
        </span>
      </div>
      <p className="text-xs text-zinc-400 font-sans">{details}</p>
    </div>
  );
}
\`\`\`

---

## 7. Interaction & Behavior ⭐
- **Hover States**: Subtly brightens element backgrounds (\`hover:bg-zinc-800\`) and borders (\`hover:border-indigo-500/50\`).
- **Active Click States**: Button shrinks slightly (\`active:scale-95\`) for tactile user feedback.
- **Loading Indicator**: Pulsing skeleton lines (\`animate-pulse\`) during data fetching operations.

---

## 8. Accessibility (a11y) ⭐
- **Keyboard Focus**: Interactive elements include visible focus rings (\`focus:outline-none focus:border-indigo-500\`).
- **Color Contrast**: All text tokens maintain minimum 4.5:1 contrast against dark background surfaces.
- **Semantic HTML**: Headers use \`<h1>\` through \`<h3>\`, lists use \`<ul>\`/\`<li>\`, buttons use \`<button>\`.

---

## 9. Design Tokens & Tailwind Mapping ⭐
| Design Token | Tailwind CSS Class |
| :--- | :--- |
${vibe.tailwindMapping.map(m => `| **${m.token}** | \`${m.class}\` |`).join('\n')}

---

## 10. Design Changelog
| Date | Version | Summary of Visual Changes |
| :--- | :--- | :--- |
| ${new Date().toISOString().split('T')[0]} | \`v1.0.0\` | Established ${vibe.name} Design System for ${appName} (${uiPages.length} screens) |
`;
}
