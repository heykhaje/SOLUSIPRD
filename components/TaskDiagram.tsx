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
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} style={{ background: '#94a3b8', border: 'none', width: 6, height: 6, right: -3 }} />
    </div>
  );
}

// Exactly like FeatureNode in WBS
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
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} style={{ background: '#94a3b8', border: 'none', width: 6, height: 6, left: -3 }} />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} style={{ background: '#94a3b8', border: 'none', width: 6, height: 6, right: -3 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ padding: '4px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', fontSize: 9, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em' }}>
          {data.phase}
        </div>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: data.status === 'Selesai' ? '#10b981' : data.status === 'Proses' ? '#f59e0b' : '#64748b' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
          <DynamicIcon name={data.icon || 'box'} size={20} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#f8fafc' }}>
            {data.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// Exactly like SubfeatureNode in WBS, but without items inside
function SubfeatureNode({ data, isConnectable }: NodeProps<{ name: string; icon: string }>) {
  return (
    <div
      style={{
        minWidth: 200,
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
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} style={{ background: '#94a3b8', border: 'none', width: 6, height: 6, right: -3 }} />

      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          <DynamicIcon name={data.icon || 'box'} size={12} />
        </div>
        <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>
          {data.name}
        </span>
      </div>
    </div>
  );
}

// NEW: Task List Node (Spawns horizontally from Features/Subfeatures)
function TaskListNode({ data, isConnectable }: NodeProps<{ title: string; tasks: TaskItem[] }>) {
  return (
    <div
      style={{
        minWidth: 280,
        maxWidth: 340,
        borderRadius: 12,
        border: '1px solid rgba(56, 189, 248, 0.3)', // cyan border for emphasis
        background: '#0f172a',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} style={{ background: '#38bdf8', border: 'none', width: 6, height: 6, left: -3 }} />

      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(56, 189, 248, 0.05)' }}>
         <DynamicIcon name="list-checks" size={14} color="#38bdf8" />
         <span style={{ fontWeight: 700, fontSize: 12, color: '#38bdf8', letterSpacing: '0.05em' }}>
           TASKS: {data.title.toUpperCase()}
         </span>
      </div>
      
      {/* Task List */}
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
      </div>
    </div>
  );
}

const nodeTypes = {
  rootTaskNode: RootNode,
  featureTaskNode: FeatureNode,
  subfeatureTaskNode: SubfeatureNode,
  taskListNode: TaskListNode,
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
   Flow Builder Logic (Branching Tasks)
   ───────────────────────────────────────────── */
function buildCombinedFlowData(structure: StructureData | null, markdown: string) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const parsedCategories = parseMarkdownTasks(markdown);

  const X_SPACING = 380;
  
  const findTasksFor = (name: string) => {
    const target = name.toLowerCase();
    const cat = parsedCategories.find(c => {
      const cTitle = c.title.toLowerCase();
      return cTitle === target || cTitle.includes(target) || target.includes(cTitle);
    });
    
    if (cat) {
      cat.title = `_USED_${cat.title}`; 
      return cat.tasks;
    }
    return [];
  };

  if (!structure) {
    let currentY = 0;
    nodes.push({ id: 'root', type: 'rootTaskNode', position: { x: 0, y: 0 }, data: { label: 'Tasks' } });
    parsedCategories.forEach((cat, idx) => {
      nodes.push({
        id: `cat-${idx}`,
        type: 'taskListNode',
        position: { x: X_SPACING, y: currentY },
        data: { title: cat.title, tasks: cat.tasks }
      });
      edges.push({ id: `e-r-${idx}`, source: 'root', target: `cat-${idx}`, type: 'smoothstep', style: { stroke: '#475569' } });
      currentY += 100 + (cat.tasks.length * 28) + 40;
    });
    return { nodes, edges };
  }

  let currentY = 0;
  
  nodes.push({
    id: 'root',
    type: 'rootTaskNode',
    position: { x: 0, y: 0 },
    data: { label: structure.name, description: 'Development Tasks' },
  });

  structure.features.forEach((feature, fIndex) => {
    const featureId = `feature-${fIndex}`;
    const featureTasks = findTasksFor(feature.name);
    
    // Y position for this entire feature block (feature + subfeatures + task nodes)
    const featureStartY = currentY;
    let maxBlockY = currentY;

    // Place Feature Node
    nodes.push({
      id: featureId,
      type: 'featureTaskNode',
      position: { x: X_SPACING, y: featureStartY },
      data: { 
        label: feature.name,
        icon: feature.icon,
        status: feature.status,
        phase: feature.phase,
      },
    });

    edges.push({
      id: `e-root-${featureId}`,
      source: 'root',
      target: featureId,
      type: 'bezier',
      style: { stroke: '#475569', strokeWidth: 1.5 },
    });
    
    let nextAvailableY = featureStartY + 120; // Default gap below feature node if no subfeatures
    
    // If there are tasks for the feature itself, spawn them to the right (x * 2)
    if (featureTasks.length > 0) {
      const fTaskId = `${featureId}-tasks`;
      nodes.push({
        id: fTaskId,
        type: 'taskListNode',
        position: { x: X_SPACING * 2, y: featureStartY },
        data: { title: feature.name, tasks: featureTasks }
      });
      edges.push({
        id: `e-${featureId}-${fTaskId}`,
        source: featureId,
        target: fTaskId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#38bdf8', strokeWidth: 1.5 }, // cyan edge to task
      });
      const taskHeight = 50 + (featureTasks.length * 28);
      nextAvailableY = Math.max(nextAvailableY, featureStartY + taskHeight + 20);
    }

    if (feature.subfeatures && feature.subfeatures.length > 0) {
      let subY = nextAvailableY; 

      feature.subfeatures.forEach((sub, sIndex) => {
        const subId = `${featureId}-sub-${sIndex}`;
        const subTasks = findTasksFor(sub.name);
        
        nodes.push({
          id: subId,
          type: 'subfeatureTaskNode',
          position: { x: X_SPACING * 2, y: subY },
          data: { name: sub.name, icon: sub.icon },
        });

        edges.push({
          id: `e-${featureId}-${subId}`,
          source: featureId,
          target: subId,
          type: 'smoothstep',
          style: { stroke: '#475569', strokeWidth: 1 },
        });
        
        let currentSubMaxY = subY + 70; // min height of subfeature node
        
        // Spawn Task node for Subfeature
        if (subTasks.length > 0) {
          const sTaskId = `${subId}-tasks`;
          nodes.push({
            id: sTaskId,
            type: 'taskListNode',
            position: { x: X_SPACING * 3, y: subY },
            data: { title: sub.name, tasks: subTasks }
          });
          edges.push({
            id: `e-${subId}-${sTaskId}`,
            source: subId,
            target: sTaskId,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#38bdf8', strokeWidth: 1.5 },
          });
          
          const taskHeight = 50 + (subTasks.length * 28);
          currentSubMaxY = Math.max(currentSubMaxY, subY + taskHeight + 20);
        }

        subY = currentSubMaxY + 20;
      });
      
      maxBlockY = subY;
    } else {
      maxBlockY = nextAvailableY;
    }

    currentY = maxBlockY + 40; // Add gap between major feature blocks
  });

  // Unused tasks
  const unusedCategories = parsedCategories.filter(c => !c.title.startsWith('_USED_'));
  if (unusedCategories.length > 0) {
    const unusedTasks = unusedCategories.flatMap(c => c.tasks);
    if (unusedTasks.length > 0) {
      const extraId = 'feature-extra-general';
      const extraTaskId = 'feature-extra-tasks';
      
      nodes.push({
        id: extraId,
        type: 'featureTaskNode',
        position: { x: X_SPACING, y: currentY },
        data: { label: 'Tugas Lainnya', icon: 'list-todo', phase: 'TAMBAHAN' }
      });
      edges.push({
        id: `e-root-${extraId}`,
        source: 'root',
        target: extraId,
        type: 'bezier',
        style: { stroke: '#475569', strokeWidth: 1.5, strokeDasharray: '5 5' },
      });
      
      nodes.push({
        id: extraTaskId,
        type: 'taskListNode',
        position: { x: X_SPACING * 2, y: currentY },
        data: { title: 'Tugas Lainnya', tasks: unusedTasks }
      });
      edges.push({
        id: `e-${extraId}-${extraTaskId}`,
        source: extraId,
        target: extraTaskId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#38bdf8', strokeWidth: 1.5 },
      });
      
      currentY += 90 + (unusedTasks.length * 28) + 60;
    }
  }

  if (nodes.length > 0) {
    nodes[0].position.y = currentY / 2 - 40;
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
