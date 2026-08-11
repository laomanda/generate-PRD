import JSZip from 'jszip';
import saveAs from 'file-saver';
import { GeneratedFile } from '../engine/types';

export async function exportFilesToZip(files: GeneratedFile[], zipFilename: string = 'devcontext-blueprint.zip') {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.path || file.filename, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, zipFilename);
}
