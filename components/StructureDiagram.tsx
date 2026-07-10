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
  items?: string[];
  isRoot?: boolean;
}

function GlassNode({ data, isConnectable }: NodeProps<GlassNodeData>) {
  return (
    <div
      style={{
        minWidth: 200,
        padding: '16px 20px',
        borderRadius: 16,
        border: '1px solid rgba(129, 140, 248, 0.2)',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        position: 'relative',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: 2,
          borderRadius: 999,
          background: data.isRoot ? '#34d399' : '#818cf8',
          boxShadow: \`0 0 8px \${data.isRoot ? '#34d399' : '#818cf8'}\`,
          opacity: 0.8,
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: '#818cf8', border: 'none', width: 6, height: 6, left: -3 }}
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span
          style={{
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.05em',
            color: '#e2e8f0',
            textTransform: 'uppercase',
          }}
        >
          {data.label}
        </span>

        {data.items && data.items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {data.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#64748b' }} />
                <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: '#818cf8', border: 'none', width: 6, height: 6, right: -3 }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component & Layout Logic
   ───────────────────────────────────────────── */

interface StructureData {
  name: string;
  features: {
    name: string;
    subfeatures: string[];
  }[];
}

interface StructureDiagramProps {
  data?: StructureData | null;
}

function parseStructureToFlow(data?: StructureData | null): { nodes: Node[]; edges: Edge[] } {
  if (!data) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const NODE_WIDTH = 250;
  const NODE_HEIGHT = 80;
  const X_SPACING = 350;
  const Y_SPACING = 150;

  // Root Node
  nodes.push({
    id: 'root',
    type: 'glassNode',
    position: { x: 0, y: (data.features.length * Y_SPACING) / 2 - NODE_HEIGHT / 2 },
    data: { label: data.name, isRoot: true },
  });

  data.features.forEach((feature, index) => {
    const featureId = \`feature-\${index}\`;
    const yPos = index * Y_SPACING;

    // Feature Node
    nodes.push({
      id: featureId,
      type: 'glassNode',
      position: { x: X_SPACING, y: yPos },
      data: { label: feature.name },
    });

    edges.push({
      id: \`e-root-\${featureId}\`,
      source: 'root',
      target: featureId,
      type: 'bezier',
      animated: true,
      style: { stroke: '#4f46e5', strokeWidth: 1.5, opacity: 0.6 },
    });

    // Subfeature Node (Grouping list of strings)
    const subfeatureId = \`sub-\${index}\`;
    nodes.push({
      id: subfeatureId,
      type: 'glassNode',
      position: { x: X_SPACING * 2, y: yPos },
      data: { label: 'Sub Fitur', items: feature.subfeatures },
    });

    edges.push({
      id: \`e-\${featureId}-\${subfeatureId}\`,
      source: featureId,
      target: subfeatureId,
      type: 'bezier',
      animated: true,
      style: { stroke: '#4f46e5', strokeWidth: 1.5, opacity: 0.6 },
    });
  });

  return { nodes, edges };
}

function FlowInner({ data }: StructureDiagramProps) {
  const nodeTypes = useMemo(() => ({ glassNode: GlassNode }), []);
  const { nodes, edges } = useMemo(() => parseStructureToFlow(data), [data]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      proOptions={{ hideAttribution: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Background color="#1e293b" gap={16} size={2} />
      <Controls
        position="bottom-left"
        style={{ 
          background: 'rgba(10,15,37,0.8)', 
          borderRadius: 12, 
          border: '1px solid rgba(255,255,255,0.1)', 
          fill: '#e2e8f0' 
        }}
      />
    </ReactFlow>
  );
}

export default function StructureDiagram({ data }: StructureDiagramProps) {
  if (!data) return null;
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <FlowInner data={data} />
      </ReactFlowProvider>
    </div>
  );
}
