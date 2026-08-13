'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'JetBrains Mono, monospace',
    });

    const renderDiagram = async () => {
      if (!chart) return;
      try {
        setError(null);
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
      } catch (err: unknown) {
        console.error('Mermaid render error:', err);
        setError('Failed to render Mermaid diagram. Displaying raw block.');
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 bg-red-950/20 border border-red-900 rounded-lg text-red-300 font-mono text-xs">
        <p className="mb-2 font-bold">{error}</p>
        <pre className="p-2 bg-zinc-950 rounded text-zinc-400 overflow-x-auto">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl overflow-x-auto flex justify-center items-center"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
