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
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import * as LucideIcons from 'lucide-react';

/* ─────────────────────────────────────────────
   Icon Helper
   ───────────────────────────────────────────── */
const DynamicIcon = ({ name, size = 16, color = "currentColor", className = "" }: { name: string, size?: number, color?: string, className?: string }) => {
  // Convert kebab-case to PascalCase (e.g., shopping-cart -> ShoppingCart)
  const iconName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') as keyof typeof LucideIcons;
  const IconComponent = LucideIcons[iconName] as React.FC<any>;
  
  if (!IconComponent) {
    const Fallback = LucideIcons['Box'] as React.FC<any>;
    return <Fallback size={size} color={color} className={className} />;
  }
  
  return <IconComponent size={size} color={color} className={className} />;
};

/* ─────────────────────────────────────────────
   Root Node (Tingkat 1)
   ───────────────────────────────────────────── */
function RootNode({ data, isConnectable }: NodeProps<{ label: string; description?: string }>) {
  return (
    <div
      style={{
        minWidth: 220,
        padding: '16px 20px',
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#1e293b',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: 'rgba(239, 68, 68, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ef4444'
      }}>
        <DynamicIcon name="layout-dashboard" size={20} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc' }}>
          {data.label}
        </span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>
          {data.description || 'Perencanaan'}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: '#94a3b8', border: 'none', width: 6, height: 6, right: -3 }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Feature Node (Tingkat 2)
   ───────────────────────────────────────────── */
function FeatureNode({ data, isConnectable }: NodeProps<{ label: string; icon: string; status: string; phase: string }>) {
  return (
    <div
      style={{
        minWidth: 240,
        padding: '16px',
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#1e293b',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: '#94a3b8', border: 'none', width: 6, height: 6, left: -3 }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ color: '#cbd5e1' }}>
          <DynamicIcon name={data.icon} size={20} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: '#f8fafc' }}>
            {data.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b' }} />
            <span style={{ fontSize: 10, color: '#94a3b8' }}>
              {data.status || 'Direncanakan'}
            </span>
          </div>
        </div>
      </div>

      {data.phase && (
        <div style={{
          position: 'absolute',
          top: -8,
          right: 12,
          background: '#ef4444',
          color: 'white',
          fontSize: 8,
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: 4,
          letterSpacing: '0.05em'
        }}>
          {data.phase}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: '#94a3b8', border: 'none', width: 6, height: 6, right: -3 }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Subfeature Node (Tingkat 3)
   ───────────────────────────────────────────── */
function SubfeatureNode({ data, isConnectable }: NodeProps<{ items: { name: string; icon: string }[] }>) {
  return (
    <div
      style={{
        minWidth: 260,
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#1e293b',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: '#94a3b8', border: 'none', width: 6, height: 6, left: -3 }}
      />

      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <DynamicIcon name="layout-list" size={14} color="#64748b" />
        <span style={{ fontWeight: 600, fontSize: 10, letterSpacing: '0.05em', color: '#94a3b8' }}>
          SUB FITUR
        </span>
      </div>

      {/* List */}
      <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
        {data.items.slice(0, 4).map((item, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            padding: '8px 16px',
            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ 
              width: 20, 
              height: 20, 
              borderRadius: 6, 
              background: '#0f172a', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#94a3b8'
            }}>
              <DynamicIcon name={item.icon || 'box'} size={12} />
            </div>
            <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 500 }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <span style={{ fontSize: 10, color: '#94a3b8', cursor: 'pointer' }}>
          Lihat semua ({data.items.length}) &gt;
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component & Layout Logic
   ───────────────────────────────────────────── */

interface SubFeatureData {
  name: string;
  icon: string;
}

interface FeatureData {
  name: string;
  phase: string;
  status: string;
  icon: string;
  subfeatures: SubFeatureData[];
}

interface StructureData {
  name: string;
  description: string;
  features: FeatureData[];
}

interface StructureDiagramProps {
  data?: StructureData | null;
}

function parseStructureToFlow(data?: StructureData | null): { nodes: Node[]; edges: Edge[] } {
  if (!data) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const NODE_HEIGHT = 80;
  const X_SPACING = 380;
  const Y_SPACING = 280; // Diperbesar dari 180 agar tidak mepet

  // Root Node
  nodes.push({
    id: 'root',
    type: 'rootNode',
    position: { x: 0, y: (data.features.length * Y_SPACING) / 2 - NODE_HEIGHT / 2 },
    data: { label: data.name, description: data.description },
  });

  data.features.forEach((feature, index) => {
    const featureId = `feature-${index}`;
    const yPos = index * Y_SPACING;

    // Feature Node
    nodes.push({
      id: featureId,
      type: 'featureNode',
      position: { x: X_SPACING, y: yPos + 10 },
      data: { 
        label: feature.name,
        icon: feature.icon,
        status: feature.status,
        phase: feature.phase
      },
    });

    edges.push({
      id: `e-root-${featureId}`,
      source: 'root',
      target: featureId,
      type: 'bezier',
      style: { stroke: '#475569', strokeWidth: 1.5 },
    });

    // Subfeature Node
    const subfeatureId = `sub-${index}`;
    nodes.push({
      id: subfeatureId,
      type: 'subfeatureNode',
      position: { x: X_SPACING * 2, y: yPos - 30 },
      data: { items: feature.subfeatures },
    });

    edges.push({
      id: `e-${featureId}-${subfeatureId}`,
      source: featureId,
      target: subfeatureId,
      type: 'bezier',
      style: { stroke: '#475569', strokeWidth: 1.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#475569',
      },
    });
  });

  return { nodes, edges };
}

function FlowInner({ data }: StructureDiagramProps) {
  const nodeTypes = useMemo(() => ({ 
    rootNode: RootNode,
    featureNode: FeatureNode,
    subfeatureNode: SubfeatureNode
  }), []);
  
  const { nodes, edges } = useMemo(() => parseStructureToFlow(data), [data]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      proOptions={{ hideAttribution: true }}
      style={{ background: '#0f172a', width: '100%', height: '100%' }}
    >
      <Background color="#334155" gap={20} size={1.5} variant={BackgroundVariant.Dots} />
      <Controls
        position="bottom-left"
        showInteractive={false}
        style={{ 
          background: 'rgba(15, 23, 42, 0.9)', 
          borderRadius: 8, 
          border: '1px solid rgba(255,255,255,0.1)', 
          fill: '#cbd5e1',
          padding: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
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
