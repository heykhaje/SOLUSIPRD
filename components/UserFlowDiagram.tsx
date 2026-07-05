'use client';

import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

/* ─────────────────────────────────────────────
   Custom Glassmorphism Node
   ───────────────────────────────────────────── */

interface GlassNodeData {
  label: string;
  emoji?: string;
  variant?: 'start' | 'process' | 'end' | 'decision' | 'default';
}

const variantStyles: Record<string, { border: string; bgDark: string; accent: string; textDark: string }> = {
  start: {
    border: '1px solid rgba(52, 211, 153, 0.3)',
    bgDark: 'rgba(16, 185, 129, 0.15)',
    accent: '#34d399',
    textDark: '#a7f3d0',
  },
  process: {
    border: '1px solid rgba(129, 140, 248, 0.3)',
    bgDark: 'rgba(99, 102, 241, 0.15)',
    accent: '#818cf8',
    textDark: '#c7d2fe',
  },
  decision: {
    border: '1px solid rgba(251, 191, 36, 0.3)',
    bgDark: 'rgba(245, 158, 11, 0.15)',
    accent: '#fbbf24',
    textDark: '#fde68a',
  },
  end: {
    border: '1px solid rgba(251, 113, 133, 0.3)',
    bgDark: 'rgba(244, 63, 94, 0.15)',
    accent: '#fb7185',
    textDark: '#fecdd3',
  },
  default: {
    border: '1px solid rgba(148, 163, 184, 0.3)',
    bgDark: 'rgba(148, 163, 184, 0.15)',
    accent: '#94a3b8',
    textDark: '#e2e8f0',
  },
};

function GlassNode({ data }: NodeProps<GlassNodeData>) {
  const isDark = true; // Always dark blue aesthetic for nodes
  const variant = data.variant || 'default';
  const s = variantStyles[variant] || variantStyles.default;

  return (
    <div
      style={{
        minWidth: 160,
        padding: '12px 20px',
        borderRadius: 12,
        border: s.border,
        background: isDark
          ? `linear-gradient(135deg, ${s.bgDark} 0%, rgba(10, 15, 37, 0.8) 100%)`
          : `linear-gradient(135deg, ${s.bgDark} 0%, rgba(255, 255, 255, 0.4) 100%)`,
        backdropFilter: 'blur(12px)',
        boxShadow: isDark 
          ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 8px 32px rgba(30,30,30,0.05), inset 0 1px 0 rgba(255,255,255,0.6)',
        position: 'relative',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 16,
          right: 16,
          height: 2,
          borderRadius: 999,
          background: s.accent,
          boxShadow: `0 0 8px ${s.accent}`,
          opacity: isDark ? 0.8 : 1,
        }}
      />

      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: 8,
          height: 8,
          background: isDark ? '#0a0f25' : '#ffffff',
          border: `2px solid ${s.accent}`,
          borderRadius: '50%',
          top: -4,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: 8,
          height: 8,
          background: isDark ? '#0a0f25' : '#ffffff',
          border: `2px solid ${s.accent}`,
          borderRadius: '50%',
          bottom: -4,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {data.emoji && (
          <span style={{ fontSize: 18, lineHeight: 1, userSelect: 'none' }}>{data.emoji}</span>
        )}
        <span
          style={{
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '-0.01em',
            color: isDark ? s.textDark : s.textLight,
          }}
        >
          {data.label}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Robust Mermaid Parser
   ───────────────────────────────────────────── */

function parseMermaidToFlow(mermaidCode: string): { nodes: Node[]; edges: Edge[] } {
  const lines = mermaidCode.split('\n').map((l) => l.trim()).filter(Boolean);
  const nodeMap = new Map<string, { label: string; variant: string }>();
  const edgeList: { source: string; target: string; label?: string }[] = [];

  for (const line of lines) {
    if (/^(graph|flowchart|subgraph|end$|style |classDef |class |%%)/i.test(line)) continue;

    const edgeRegex = /^(\w+)(?:\[([^\]]*)\]|\{([^}]*)\}|\(([^)]*)\)|\(\[([^\]]*)\]\))?\s*(-+>+|-+\.+>+|=+>+)\s*(?:\|([^|]*)\|)?\s*(\w+)(?:\[([^\]]*)\]|\{([^}]*)\}|\(([^)]*)\)|\(\[([^\]]*)\]\))?/;
    const m = line.match(edgeRegex);

    if (m) {
      const srcId = m[1];
      const srcLabel = m[2] || m[3] || m[4] || m[5] || '';
      const edgeLabel = m[7] || '';
      const tgtId = m[8];
      const tgtLabel = m[9] || m[10] || m[11] || m[12] || '';

      if (!nodeMap.has(srcId)) {
        nodeMap.set(srcId, {
          label: (srcLabel || srcId).replace(/"/g, '').trim(),
          variant: m[3] ? 'decision' : '',
        });
      } else if (srcLabel && nodeMap.get(srcId)!.label === srcId) {
        nodeMap.get(srcId)!.label = srcLabel.replace(/"/g, '').trim();
      }

      if (!nodeMap.has(tgtId)) {
        nodeMap.set(tgtId, {
          label: (tgtLabel || tgtId).replace(/"/g, '').trim(),
          variant: m[10] ? 'decision' : '',
        });
      } else if (tgtLabel && nodeMap.get(tgtId)!.label === tgtId) {
        nodeMap.get(tgtId)!.label = tgtLabel.replace(/"/g, '').trim();
      }

      edgeList.push({
        source: srcId,
        target: tgtId,
        label: edgeLabel.replace(/"/g, '').trim() || undefined,
      });
      continue;
    }

    const nodeRegex = /^(\w+)(?:\[([^\]]*)\]|\{([^}]*)\}|\(([^)]*)\))/;
    const nm = line.match(nodeRegex);
    if (nm) {
      const id = nm[1];
      const label = nm[2] || nm[3] || nm[4] || id;
      if (!nodeMap.has(id)) {
        nodeMap.set(id, {
          label: label.replace(/"/g, '').trim(),
          variant: nm[3] ? 'decision' : '',
        });
      }
    }
  }

  const defaultNodes: Node[] = [
    { id: '1', type: 'glassNode', position: { x: 250, y: 0 }, data: { label: 'Mulai', emoji: '🟢', variant: 'start' } },
    { id: '2', type: 'glassNode', position: { x: 250, y: 120 }, data: { label: 'Proses', emoji: '⚙️', variant: 'process' } },
    { id: '3', type: 'glassNode', position: { x: 250, y: 240 }, data: { label: 'Selesai', emoji: '🏁', variant: 'end' } },
  ];

  const defaultEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true, style: { stroke: '#6366f1', strokeWidth: 2, opacity: 0.7 } },
    { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true, style: { stroke: '#6366f1', strokeWidth: 2, opacity: 0.7 } },
  ];

  if (nodeMap.size === 0) {
    return { nodes: defaultNodes, edges: defaultEdges };
  }

  const emojiMap: Record<string, string> = {
    start: '🟢',
    process: '⚙️',
    decision: '🔀',
    end: '🏁',
    default: '📦',
  };

  const nodeIds = Array.from(nodeMap.keys());
  const hasIncoming = new Set(edgeList.map((e) => e.target));
  const hasOutgoing = new Set(edgeList.map((e) => e.source));

  const nodes: Node[] = nodeIds.map((id, index) => {
    const info = nodeMap.get(id)!;
    let variant = info.variant;

    if (!variant) {
      if (!hasIncoming.has(id)) variant = 'start';
      else if (!hasOutgoing.has(id)) variant = 'end';
      else variant = 'process';
    }

    return {
      id,
      type: 'glassNode',
      position: { x: 250, y: index * 130 },
      data: {
        label: info.label,
        variant,
        emoji: emojiMap[variant] || '📦',
      },
    };
  });

  const edges: Edge[] = edgeList.map((e, i) => ({
    id: `e-${e.source}-${e.target}-${i}`,
    source: e.source,
    target: e.target,
    type: 'smoothstep',
    animated: true,
    label: e.label || undefined,
    style: { stroke: '#6366f1', strokeWidth: 2, opacity: 0.7 },
    labelStyle: { fontSize: 11, fontWeight: 600, fill: '#e2e8f0' },
    labelBgStyle: { fill: '#0a0f25', fillOpacity: 0.8 },
  }));

  return { nodes, edges };
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */

interface UserFlowDiagramProps {
  mermaidCode?: string;
}

function FlowInner({ mermaidCode }: UserFlowDiagramProps) {
  const nodeTypes = useMemo(() => ({ glassNode: GlassNode }), []);
  const isDark = true; // Always dark blue aesthetic

  const { nodes, edges } = useMemo(() => {
    if (mermaidCode && mermaidCode.trim()) {
      return parseMermaidToFlow(mermaidCode);
    }
    return parseMermaidToFlow(''); // Fallback dummy
  }, [mermaidCode]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      proOptions={{ hideAttribution: true }}
      style={{ background: isDark ? '#060918' : 'transparent', width: '100%', height: '100%' }}
    >
      <Background color={isDark ? '#1e293b' : '#cbd5e1'} gap={16} size={2} />
      <Controls
        position="bottom-right"
        style={{ 
          background: isDark ? 'rgba(10,15,37,0.8)' : 'rgba(255,255,255,0.8)', 
          borderRadius: 12, 
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', 
          fill: isDark ? '#e2e8f0' : '#1e293b' 
        }}
      />
    </ReactFlow>
  );
}

export default function UserFlowDiagram({ mermaidCode }: UserFlowDiagramProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <FlowInner mermaidCode={mermaidCode} />
      </ReactFlowProvider>
    </div>
  );
}
