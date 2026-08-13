import JSZip from 'jszip';
import saveAs from 'file-saver';
import { GeneratedFile } from '../engine/types';
import { qualityGatePipeline } from '../core/pipeline/qualityGate';
import { analyzeProjectConfig } from '../core/analyzer';

export async function exportFilesToZip(files: GeneratedFile[], zipFilename: string = 'devcontext-blueprint.zip') {
  // Enforce Hard Quality Gate validation before archive creation
  const docMap: Record<string, string> = {};
  files.forEach((f) => { docMap[f.filename] = f.content; });

  const { projectModel } = analyzeProjectConfig({
    projectName: 'Export Validation',
    description: 'Export validation',
    appType: 'custom',
    techStack: ['TypeScript'],
    features: [],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  });

  const gateReport = qualityGatePipeline.runQualityGate(projectModel, docMap);

  if (!gateReport.passed) {
    throw new Error(`[Export Blocked] Document bundle failed Quality Gate validation: ${gateReport.errors.join(' | ')}`);
  }

  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.path || file.filename, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, zipFilename);
}
