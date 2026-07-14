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
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import * as LucideIcons from 'lucide-react';

/* ─────────────────────────────────────────────
   Icon Helper
   ───────────────────────────────────────────── */
const DynamicIcon = ({ name, size = 16, color = "currentColor", className = "" }: { name: string, size?: number, color?: string, className?: string }) => {
  const iconName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') as keyof typeof LucideIcons;
  const IconComponent = LucideIcons[iconName] as React.FC<any>;
  
  if (!IconComponent) {
    const Fallback = LucideIcons['CheckSquare'] as React.FC<any>;
    return <Fallback size={size} color={color} className={className} />;
  }
  return <IconComponent size={size} color={color} className={className} />;
};

/* ─────────────────────────────────────────────
   Root Node
   ───────────────────────────────────────────── */
function RootTaskNode({ data, isConnectable }: NodeProps<{ label: string }>) {
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
        background: 'rgba(99, 102, 241, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#818cf8'
      }}>
        <DynamicIcon name="list-checks" size={20} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc' }}>
          {data.label}
        </span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>
          Daftar Pengerjaan
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
   Category Node with Checklist
   ───────────────────────────────────────────── */
function CategoryTaskNode({ data, isConnectable }: NodeProps<{ title: string; tasks: {text: string, checked: boolean}[] }>) {
  return (
    <div
      style={{
        minWidth: 320,
        maxWidth: 380,
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#0f172a',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        position: 'relative',
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

      <div style={{
        padding: '12px 16px',
        background: '#1e293b',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
         <div style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'rgba(56, 189, 248, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <DynamicIcon name="folder" size={14} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc' }}>
            {data.title}
          </span>
      </div>

      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.tasks.map((task, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{
              marginTop: '2px',
              width: 14,
              height: 14,
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              background: task.checked ? '#38bdf8' : 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {task.checked && <DynamicIcon name="check" size={10} color="#fff" />}
            </div>
            <span style={{ fontSize: 12, color: '#cbd5e1', lineHeight: '1.4' }}>
              {task.text}
            </span>
          </div>
        ))}
        {data.tasks.length === 0 && (
          <span style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>Tidak ada task.</span>
        )}
      </div>
    </div>
  );
}

const nodeTypes = {
  rootTask: RootTaskNode,
  categoryTask: CategoryTaskNode,
};

/* ─────────────────────────────────────────────
   Markdown Parser to Flow Data
   ───────────────────────────────────────────── */
interface ParsedCategory {
  title: string;
  tasks: { text: string; checked: boolean }[];
}

function parseMarkdownTasks(markdown: string) {
  const lines = markdown.split('\n');
  const categories: ParsedCategory[] = [];
  
  let currentCategory: ParsedCategory | null = null;
  const defaultCategory: ParsedCategory = { title: 'General Tasks', tasks: [] };

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line.startsWith('#')) {
      const title = line.replace(/^#+\s*/, '').trim();
      currentCategory = { title, tasks: [] };
      categories.push(currentCategory);
    } 
    else if (line.match(/^-\s*\[([ xX])\]\s+(.*)/)) {
      const match = line.match(/^-\s*\[([ xX])\]\s+(.*)/);
      if (match) {
        const isChecked = match[1].toLowerCase() === 'x';
        const text = match[2];
        const taskObj = { text, checked: isChecked };
        
        if (currentCategory) {
          currentCategory.tasks.push(taskObj);
        } else {
          defaultCategory.tasks.push(taskObj);
        }
      }
    }
    else if (line.match(/^-\s+(.*)/)) {
       const match = line.match(/^-\s+(.*)/);
       if (match) {
         const taskObj = { text: match[1], checked: false };
         if (currentCategory) {
            currentCategory.tasks.push(taskObj);
          } else {
            defaultCategory.tasks.push(taskObj);
          }
       }
    }
  }

  if (categories.length === 0 && defaultCategory.tasks.length > 0) {
    categories.push(defaultCategory);
  }

  return categories;
}

function buildFlowData(categories: ParsedCategory[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const X_START = 0;
  const X_SPACING = 400;
  const X_CHILD = X_START + X_SPACING;
  
  nodes.push({
    id: 'root',
    type: 'rootTask',
    position: { x: X_START, y: 0 },
    data: { label: 'Development Tasks' },
  });

  let currentY = 0;

  categories.forEach((cat, index) => {
    const id = `cat-${index}`;
    
    // Estimate height dynamically based on items
    const estimatedHeight = 50 + (cat.tasks.length * 28) + 30;
    
    nodes.push({
      id,
      type: 'categoryTask',
      position: { x: X_CHILD, y: currentY },
      data: { 
        title: cat.title,
        tasks: cat.tasks
      },
    });

    edges.push({
      id: `edge-root-${id}`,
      source: 'root',
      target: id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#475569', strokeWidth: 1.5 },
    });

    currentY += estimatedHeight + 40;
  });
  
  if (nodes.length > 1) {
      const totalHeight = currentY - 40;
      nodes[0].position.y = (totalHeight / 2) - 40; 
  }

  return { nodes, edges };
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
interface TaskDiagramProps {
  markdown: string;
}

function FlowInner({ markdown }: TaskDiagramProps) {
  const { nodes, edges } = useMemo(() => {
    const categories = parseMarkdownTasks(markdown);
    return buildFlowData(categories);
  }, [markdown]);

  return (
    <>
      <style>{`
        .react-flow__controls-button {
          background-color: #1e293b !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 4px;
        }
        .react-flow__controls-button:hover {
          background-color: #334155 !important;
        }
        .react-flow__controls-button path {
          fill: #cbd5e1 !important;
        }
      `}</style>
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
            padding: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        />
      </ReactFlow>
    </>
  );
}

export default function TaskDiagram({ markdown }: TaskDiagramProps) {
  if (!markdown) return null;
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <FlowInner markdown={markdown} />
      </ReactFlowProvider>
    </div>
  );
}
