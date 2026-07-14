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
    const Fallback = LucideIcons['Box'] as React.FC<any>;
    return <Fallback size={size} color={color} className={className} />;
  }
  return <IconComponent size={size} color={color} className={className} />;
};

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface TaskItem {
  text: string;
  checked: boolean;
}

interface ParsedCategory {
  title: string;
  tasks: TaskItem[];
}

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

interface TaskDiagramProps {
  markdown: string;
  structureData?: StructureData | null;
}

/* ─────────────────────────────────────────────
   Node Components
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

const TaskList = ({ tasks }: { tasks: TaskItem[] }) => {
  if (!tasks || tasks.length === 0) return null;
  return (
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
      {tasks.map((task, idx) => (
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
    </div>
  );
};

function FeatureTaskNode({ data, isConnectable }: NodeProps<{ label: string; icon: string; status: string; phase: string; tasks: TaskItem[] }>) {
  return (
    <div
      style={{
        minWidth: 280,
        maxWidth: 340,
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#1e293b',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} style={{ background: '#94a3b8', border: 'none', width: 6, height: 6, left: -3 }} />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} style={{ background: '#94a3b8', border: 'none', width: 6, height: 6, right: -3 }} />

      {/* Header */}
      <div style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <DynamicIcon name={data.icon || 'box'} size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#f8fafc' }}>{data.label}</span>
            <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>{data.phase || 'PHASE 1'}</span>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      <TaskList tasks={data.tasks} />
    </div>
  );
}

function SubfeatureTaskNode({ data, isConnectable }: NodeProps<{ name: string; icon: string; tasks: TaskItem[] }>) {
  return (
    <div
      style={{
        minWidth: 260,
        maxWidth: 320,
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#1e293b',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} style={{ background: '#94a3b8', border: 'none', width: 6, height: 6, left: -3 }} />

      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: data.tasks && data.tasks.length > 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          <DynamicIcon name={data.icon || 'box'} size={12} />
        </div>
        <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{data.name}</span>
      </div>

      {/* Task List */}
      <TaskList tasks={data.tasks} />
    </div>
  );
}

const nodeTypes = {
  rootTaskNode: RootNode,
  featureTaskNode: FeatureTaskNode,
  subfeatureTaskNode: SubfeatureTaskNode,
};

/* ─────────────────────────────────────────────
   Markdown Parser
   ───────────────────────────────────────────── */
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
        if (currentCategory) currentCategory.tasks.push(taskObj);
        else defaultCategory.tasks.push(taskObj);
      }
    }
    else if (line.match(/^-\s+(.*)/)) {
       const match = line.match(/^-\s+(.*)/);
       if (match) {
         const taskObj = { text: match[1], checked: false };
         if (currentCategory) currentCategory.tasks.push(taskObj);
         else defaultCategory.tasks.push(taskObj);
       }
    }
  }

  if (defaultCategory.tasks.length > 0) {
    categories.push(defaultCategory);
  }

  return categories;
}

/* ─────────────────────────────────────────────
   Flow Builder Logic (Merging Structure + Tasks)
   ───────────────────────────────────────────── */
function buildCombinedFlowData(structure: StructureData | null, markdown: string) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const parsedCategories = parseMarkdownTasks(markdown);

  const X_SPACING = 380;
  const Y_SPACING_BASE = 150;
  
  // Helper to find tasks for a specific name
  const findTasksFor = (name: string) => {
    const target = name.toLowerCase();
    const cat = parsedCategories.find(c => {
      const cTitle = c.title.toLowerCase();
      // Try exact, or if AI added extra words like "Fitur Autentikasi" vs "Autentikasi"
      return cTitle === target || cTitle.includes(target) || target.includes(cTitle);
    });
    
    if (cat) {
      cat.title = `_USED_${cat.title}`; // mark as used so we can collect unused later
      return cat.tasks;
    }
    return [];
  };

  // If no structure data, just fallback to standard horizontal layout (like previous iteration)
  if (!structure) {
    let currentY = 0;
    nodes.push({ id: 'root', type: 'rootTaskNode', position: { x: 0, y: 0 }, data: { label: 'Tasks' } });
    parsedCategories.forEach((cat, idx) => {
      nodes.push({
        id: `cat-${idx}`,
        type: 'featureTaskNode',
        position: { x: X_SPACING, y: currentY },
        data: { label: cat.title, icon: 'folder', phase: 'TUGAS', tasks: cat.tasks }
      });
      edges.push({ id: `e-r-${idx}`, source: 'root', target: `cat-${idx}`, type: 'smoothstep', style: { stroke: '#475569' } });
      currentY += 100 + (cat.tasks.length * 28) + 40;
    });
    return { nodes, edges };
  }

  // --- MERGE LOGIC ---
  let currentY = 0;
  const rootYAnchor = currentY;

  nodes.push({
    id: 'root',
    type: 'rootTaskNode',
    position: { x: 0, y: 0 }, // We'll center this later
    data: { label: structure.name, description: 'Development Tasks' },
  });

  structure.features.forEach((feature, fIndex) => {
    const featureId = `feature-${fIndex}`;
    const featureTasks = findTasksFor(feature.name);
    
    const featureNodeY = currentY;
    nodes.push({
      id: featureId,
      type: 'featureTaskNode',
      position: { x: X_SPACING, y: featureNodeY },
      data: { 
        label: feature.name,
        icon: feature.icon,
        status: feature.status,
        phase: feature.phase,
        tasks: featureTasks
      },
    });

    edges.push({
      id: `e-root-${featureId}`,
      source: 'root',
      target: featureId,
      type: 'bezier',
      style: { stroke: '#475569', strokeWidth: 1.5 },
    });

    const fNodeHeight = 90 + (featureTasks.length * 28);
    currentY += fNodeHeight + 30; // initial gap for subfeatures

    // If feature has subfeatures, render them as well
    if (feature.subfeatures && feature.subfeatures.length > 0) {
      let subY = featureNodeY; // start subfeatures roughly parallel to feature

      feature.subfeatures.forEach((sub, sIndex) => {
        const subId = `${featureId}-sub-${sIndex}`;
        const subTasks = findTasksFor(sub.name);
        
        nodes.push({
          id: subId,
          type: 'subfeatureTaskNode',
          position: { x: X_SPACING * 2, y: subY },
          data: { name: sub.name, icon: sub.icon, tasks: subTasks },
        });

        edges.push({
          id: `e-${featureId}-${subId}`,
          source: featureId,
          target: subId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#475569', strokeWidth: 1 },
        });

        const subNodeHeight = 50 + (subTasks.length * 28);
        subY += subNodeHeight + 20;
      });

      // Update currentY if subfeatures went further down than the feature node
      currentY = Math.max(currentY, subY + 20);
    }
  });

  // Collect unused tasks (e.g. general tasks or AI generated sections not in WBS)
  const unusedCategories = parsedCategories.filter(c => !c.title.startsWith('_USED_'));
  
  if (unusedCategories.length > 0) {
    const unusedTasks = unusedCategories.flatMap(c => c.tasks);
    if (unusedTasks.length > 0) {
      const extraId = 'feature-extra-general';
      nodes.push({
        id: extraId,
        type: 'featureTaskNode',
        position: { x: X_SPACING, y: currentY },
        data: { label: 'Tugas Lainnya', icon: 'list-todo', phase: 'TAMBAHAN', tasks: unusedTasks }
      });
      edges.push({
        id: `e-root-${extraId}`,
        source: 'root',
        target: extraId,
        type: 'bezier',
        style: { stroke: '#475569', strokeWidth: 1.5, strokeDasharray: '5 5' },
      });
      currentY += 90 + (unusedTasks.length * 28) + 40;
    }
  }

  // Center Root Node vertically
  if (nodes.length > 0) {
    const totalHeight = currentY;
    nodes[0].position.y = totalHeight / 2 - 40;
  }

  return { nodes, edges };
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
function FlowInner({ markdown, structureData }: TaskDiagramProps) {
  const { nodes, edges } = useMemo(() => {
    return buildCombinedFlowData(structureData || null, markdown);
  }, [markdown, structureData]);

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

export default function TaskDiagram({ markdown, structureData }: TaskDiagramProps) {
  if (!markdown) return null;
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <FlowInner markdown={markdown} structureData={structureData} />
      </ReactFlowProvider>
    </div>
  );
}
