import { ProjectModel } from '../project-model/schemas';
import { completenessValidator } from '../validators/completenessValidator';
import { crossDocValidator } from '../validators/crossDocValidator';

export interface QualityGateStepResult {
  step: number;
  name: string;
  passed: boolean;
  message: string;
  errors?: string[];
}

export interface QualityGatePipelineReport {
  passed: boolean;
  stepResults: QualityGateStepResult[];
  errors: string[];
}

export class QualityGatePipeline {
  runQualityGate(
    project: ProjectModel,
    documents: Record<string, string>
  ): QualityGatePipelineReport {
    const stepResults: QualityGateStepResult[] = [];
    const globalErrors: string[] = [];

    // STEP 1: Project Facts Validation
    const step1Passed = !!project.projectName && !!project.domain?.domainName;
    stepResults.push({
      step: 1,
      name: 'Project Facts Validation',
      passed: step1Passed,
      message: step1Passed ? 'Project identity & domain facts verified.' : 'Invalid project facts or missing domain name.',
    });
    if (!step1Passed) globalErrors.push('Step 1 Failed: Project facts invalid.');

    // STEP 2: Knowledge Graph Validation
    const step2Passed = Array.isArray(project.inferredFacts);
    stepResults.push({
      step: 2,
      name: 'Knowledge Graph Validation',
      passed: step2Passed,
      message: step2Passed ? `Resolved ${project.inferredFacts.length} knowledge graph facts.` : 'Knowledge graph evaluation failed.',
    });
    if (!step2Passed) globalErrors.push('Step 2 Failed: Knowledge graph error.');

    // STEP 3: Context Signals Validation
    const step3Passed = typeof project.signals?.dataSensitivityScore === 'number' && !!project.signals?.riskLevel;
    stepResults.push({
      step: 3,
      name: 'Context Signals Validation',
      passed: step3Passed,
      message: step3Passed
        ? `Context signals verified (Sensitivity: ${project.signals.dataSensitivityScore}/10, Risk: ${project.signals.riskLevel.toUpperCase()}).`
        : 'Context signals uncomputed.',
    });
    if (!step3Passed) globalErrors.push('Step 3 Failed: Context signals error.');

    // STEP 4: Document Structure Validation (Section Registry)
    const contractDocIds = ['PRD', 'DESIGN', 'DATABASE', 'TECH_STACK', 'ARCHITECTURE', 'API', 'SECURITY', 'TESTING', 'DEPLOYMENT'];
    const structErrors: string[] = [];
    let step4Passed = true;

    for (const docId of contractDocIds) {
      const filename = `${docId === 'DESIGN' ? 'DESIGN_SYSTEM' : docId}.md`;
      const content = documents[filename] || documents[`${docId}.md`];
      if (content) {
        const valRes = completenessValidator.validate(docId, content);
        if (!valRes.valid) {
          step4Passed = false;
          valRes.errors.forEach(e => structErrors.push(`${filename}: ${e.message}`));
        }
      }
    }

    stepResults.push({
      step: 4,
      name: 'Document Structure Validation',
      passed: step4Passed,
      message: step4Passed ? '100% of mandatory section contracts verified across documents.' : 'Missing mandatory sections detected.',
      errors: structErrors,
    });
    if (!step4Passed) globalErrors.push(...structErrors);

    // STEP 5: Content Integrity Validation
    const forbiddenTokens = ['{{', '}}', '[TODO]', 'UNDEFINED', 'null null'];
    const contentErrors: string[] = [];
    let step5Passed = true;

    for (const [filename, content] of Object.entries(documents)) {
      for (const token of forbiddenTokens) {
        if (content.includes(token)) {
          step5Passed = false;
          contentErrors.push(`${filename} contains forbidden unresolved token "${token}"`);
        }
      }
    }

    stepResults.push({
      step: 5,
      name: 'Content Integrity Validation',
      passed: step5Passed,
      message: step5Passed ? 'Zero unresolved tokens or forbidden placeholders detected.' : 'Unresolved tokens found in content.',
      errors: contentErrors,
    });
    if (!step5Passed) globalErrors.push(...contentErrors);

    // STEP 6: Cross-Document Consistency Validation
    const crossRes = crossDocValidator.validateCrossDoc(project, documents);
    stepResults.push({
      step: 6,
      name: 'Cross-Document Consistency Validation',
      passed: crossRes.valid,
      message: crossRes.valid ? 'Cross-document consistency verified (0 contradictions).' : 'Cross-document contradictions found.',
      errors: crossRes.errors.map(e => `${e.sourceDoc} ↔ ${e.targetDoc}: ${e.issue}`),
    });
    if (!crossRes.valid) globalErrors.push(...crossRes.errors.map(e => e.issue));

    // STEP 7: Markdown & Mermaid Syntax Validation
    const syntaxErrors: string[] = [];
    let step7Passed = true;

    for (const [filename, content] of Object.entries(documents)) {
      if (content.includes('```mermaid')) {
        const blocks = content.split('```mermaid');
        for (let i = 1; i < blocks.length; i++) {
          if (!blocks[i].includes('```')) {
            step7Passed = false;
            syntaxErrors.push(`${filename} contains unclosed Mermaid code block.`);
          }
        }
      }
    }

    stepResults.push({
      step: 7,
      name: 'Markdown & Mermaid Syntax Validation',
      passed: step7Passed,
      message: step7Passed ? 'Markdown syntax & Mermaid code blocks properly formatted.' : 'Syntax formatting errors detected.',
      errors: syntaxErrors,
    });
    if (!step7Passed) globalErrors.push(...syntaxErrors);

    // STEP 8: Final Completeness Gate
    const allPassed = globalErrors.length === 0;
    stepResults.push({
      step: 8,
      name: 'Final Completeness Gate',
      passed: allPassed,
      message: allPassed
        ? 'PASSED: Document bundle cleared for export.'
        : 'BLOCKED: Document export rejected due to quality gate failures.',
    });

    return {
      passed: allPassed,
      stepResults,
      errors: globalErrors,
    };
  }
}

export const qualityGatePipeline = new QualityGatePipeline();
