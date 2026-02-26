import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  EdgeTypes,
  NodeTypes,
  ReactFlowProvider,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { LoginPage } from './components/login-page';
import { SettingsPage } from './components/settings-page';
import { Sidebar } from './components/sidebar';
import { TopNavbar } from './components/top-navbar';
import { PropertiesPanel } from './components/properties-panel';
import { AIAssistant } from './components/ai-assistant';
import { CustomNode } from './components/custom-node';
import { CustomEdge } from './components/custom-edge';
import { ShareDialog } from './components/share-dialog';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// Define custom node and edge types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 250 },
    data: {
      label: 'Central Concept',
      shape: 'circle',
      color: '#3b82f6',
      icon: 'Brain',
      tags: ['main'],
      notes: 'This is the central concept of your map',
    },
  },
];

const initialEdges: Edge[] = [];

interface AppSettings {
  backgroundColor: string;
  backgroundPattern: string;
  theme: string;
  autoSave: boolean;
  snapToGrid: boolean;
  showMinimap: boolean;
}

function ConceptMapFlow({ 
  settings, 
  onSettingsChange 
}: { 
  settings: AppSettings; 
  onSettingsChange: (settings: AppSettings) => void; 
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [viewMode, setViewMode] = useState<string>('free-flow');
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[]; viewMode: string }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [layoutPositions, setLayoutPositions] = useState<Record<string, { nodes: Node[] }>>({});
  const [mapTitle, setMapTitle] = useState("Concept Map");
  const [showAI, setShowAI] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Initialize history with initial state
  React.useEffect(() => {
    if (history.length === 0) {
      setHistory([{ nodes: initialNodes, edges: initialEdges, viewMode: 'free-flow' }]);
      setHistoryIndex(0);
    }
  }, [history.length]);

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ 
      nodes: [...nodes], 
      edges: [...edges],
      viewMode: viewMode
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [nodes, edges, history, historyIndex, viewMode]);

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'custom',
        data: {
          connectionType: 'straight',
          color: '#64748b',
          notes: '',
          thickness: 2,
          sourceHandle: params.sourceHandle || 'bottom-source',
          targetHandle: params.targetHandle || 'top',
          sourceLabel: sourceNode?.data.label || 'Unknown',
          targetLabel: targetNode?.data.label || 'Unknown',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      saveToHistory();
      
      // Show connection details in toast
      const direction = params.sourceHandle?.includes('top') ? 'from top' : 
                       params.sourceHandle?.includes('bottom') ? 'from bottom' :
                       params.sourceHandle?.includes('left') ? 'from left' :
                       params.sourceHandle?.includes('right') ? 'from right' : '';
      
      const sanitizedLabel = (sourceNode?.data.label || 'node').replace(/[<>"'&]/g, '');
      toast.success(`Connection created ${direction} of ${sanitizedLabel}`);
    },
    [nodes, setEdges, saveToHistory]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      if (prevState.viewMode) {
        setViewMode(prevState.viewMode);
      }
      setHistoryIndex(historyIndex - 1);
      toast.success('Undone');
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      if (nextState.viewMode) {
        setViewMode(nextState.viewMode);
      }
      setHistoryIndex(historyIndex + 1);
      toast.success('Redone');
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const addNode = useCallback(
    (type: string) => {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'custom',
        position: {
          x: Math.random() * 500 + 100,
          y: Math.random() * 500 + 100,
        },
        data: {
          label: 'New Node',
          shape: type,
          color: '#3b82f6',
          icon: 'Circle',
          tags: [],
          notes: '',
        },
      };
      setNodes((nds) => nds.concat(newNode));
      saveToHistory();
      toast.success('Node added');
    },
    [setNodes, saveToHistory]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setSelectedNode(null);
      saveToHistory();
      toast.success('Node deleted');
    },
    [setNodes, setEdges, saveToHistory]
  );

  const updateNode = useCallback(
    (nodeId: string, updates: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      );
      // Debounce history saves for real-time updates
      const timeoutId = setTimeout(() => saveToHistory(), 500);
      return () => clearTimeout(timeoutId);
    },
    [setNodes, saveToHistory]
  );

  const updateEdge = useCallback(
    (edgeId: string, updates: any) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId
            ? { ...edge, data: { ...edge.data, ...updates } }
            : edge
        )
      );
      // Debounce history saves for real-time updates
      const timeoutId = setTimeout(() => saveToHistory(), 500);
      return () => clearTimeout(timeoutId);
    },
    [setEdges, saveToHistory]
  );

  const deleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
      setSelectedEdge(null);
      saveToHistory();
      toast.success('Connection deleted');
    },
    [setEdges, saveToHistory]
  );

  const resetWorkspace = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNode(null);
    setSelectedEdge(null);
    setViewMode('free-flow');
    setLayoutPositions({});
    const newHistory = [{ nodes: initialNodes, edges: initialEdges, viewMode: 'free-flow' }];
    setHistory(newHistory);
    setHistoryIndex(0);
    setMapTitle("Concept Map");
    toast.success('Workspace reset to default');
  }, [setNodes, setEdges]);

  const sanitizeFileName = (filename: string): string => {
    return filename.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
  };

  const sanitizeCSVValue = (value: string): string => {
    return value.replace(/"/g, '""');
  };

  const exportMap = useCallback(
    (format: string) => {
      const data = { nodes, edges, viewMode, settings, title: mapTitle };
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sanitizeFileName(mapTitle)}.json`;
        link.click();
        toast.success('Map exported as JSON');
      } else if (format === 'csv') {
        const csvData = nodes.map(node => ({
          id: node.id,
          label: sanitizeCSVValue(node.data.label || ''),
          shape: sanitizeCSVValue(node.data.shape || 'circle'),
          color: sanitizeCSVValue(node.data.color || '#3b82f6'),
          tags: sanitizeCSVValue((node.data.tags || []).join(';')),
          notes: sanitizeCSVValue(node.data.notes || ''),
        }));
        const csv = [
          Object.keys(csvData[0]).join(','),
          ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sanitizeFileName(mapTitle)}.csv`;
        link.click();
        toast.success('Map exported as CSV');
      }
    },
    [nodes, edges, viewMode, settings, mapTitle]
  );

  const handleQuickAction = useCallback(
    (action: string) => {
      if (action === 'duplicate' && selectedNode) {
        const newNode: Node = {
          ...selectedNode,
          id: `node-${Date.now()}`,
          position: {
            x: selectedNode.position.x + 100,
            y: selectedNode.position.y + 50,
          },
          data: {
            ...selectedNode.data,
            label: selectedNode.data.label + ' (Copy)',
          },
        };
        setNodes((nds) => nds.concat(newNode));
        saveToHistory();
        toast.success('Node duplicated');
      } else if (action === 'align' && nodes.length > 1) {
        const avgX = nodes.reduce((sum, node) => sum + node.position.x, 0) / nodes.length;
        const updatedNodes = nodes.map(node => ({
          ...node,
          position: { ...node.position, x: avgX },
        }));
        setNodes(updatedNodes);
        saveToHistory();
        toast.success('Nodes aligned');
      } else if (action === 'group') {
        toast.info('Group functionality coming soon!');
      }
    },
    [selectedNode, nodes, setNodes, saveToHistory]
  );

  const importMap = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.nodes && data.edges) {
            setNodes(data.nodes);
            setEdges(data.edges);
            if (data.viewMode) setViewMode(data.viewMode);
            if (data.settings) onSettingsChange(data.settings);
            if (data.title) setMapTitle(data.title);
            saveToHistory();
            toast.success('Map imported successfully');
          }
        } catch (error) {
          toast.error('Failed to import map');
        }
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges, saveToHistory, onSettingsChange]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      setSelectedEdge(null);
    },
    []
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge);
      setSelectedNode(null);
    },
    []
  );

  const applyLayout = useCallback(
    (layoutType: string) => {
      // Save current positions for the current view mode
      if (viewMode !== layoutType) {
        setLayoutPositions(prev => ({
          ...prev,
          [viewMode]: { nodes: [...nodes] }
        }));
      }

      // Check if we have saved positions for the target layout
      if (layoutPositions[layoutType]) {
        setNodes(layoutPositions[layoutType].nodes);
        setViewMode(layoutType);
        saveToHistory();
        toast.success(`Switched back to ${layoutType} layout`);
        return;
      }

      let updatedNodes = [...nodes];
      
      if (layoutType === 'tree') {
        // Create a hierarchical tree layout
        const rootNodes = updatedNodes.filter(node => 
          !edges.some(edge => edge.target === node.id)
        );
        const rootNode = rootNodes[0] || updatedNodes[0];
        
        if (rootNode) {
          // Position root at top center
          rootNode.position = { x: 400, y: 100 };
          
          // Create levels based on connections
          const levels: Record<string, Node[]> = { '0': [rootNode] };
          const visited = new Set([rootNode.id]);
          
          let currentLevel = 0;
          while (visited.size < updatedNodes.length && currentLevel < 10) {
            const nextLevel = currentLevel + 1;
            levels[nextLevel] = [];
            
            levels[currentLevel].forEach(parentNode => {
              const children = edges
                .filter(edge => edge.source === parentNode.id)
                .map(edge => updatedNodes.find(node => node.id === edge.target))
                .filter(node => node && !visited.has(node.id));
              
              children.forEach(child => {
                if (child) {
                  levels[nextLevel].push(child);
                  visited.add(child.id);
                }
              });
            });
            
            currentLevel++;
          }
          
          // Position nodes in each level
          Object.keys(levels).forEach(levelKey => {
            const level = parseInt(levelKey);
            const levelNodes = levels[levelKey];
            const levelWidth = levelNodes.length * 250;
            const startX = 400 - levelWidth / 2;
            
            levelNodes.forEach((node, index) => {
              node.position = {
                x: startX + index * 250,
                y: 100 + level * 150,
              };
            });
          });
        }
      } else if (layoutType === 'radial') {
        const center = { x: 400, y: 300 };
        const baseRadius = 150;
        
        // Find root node (one with most connections or first node)
        const rootNode = updatedNodes.reduce((max, node) => {
          const connections = edges.filter(edge => 
            edge.source === node.id || edge.target === node.id
          ).length;
          const maxConnections = edges.filter(edge => 
            edge.source === max.id || edge.target === max.id
          ).length;
          return connections > maxConnections ? node : max;
        }, updatedNodes[0]);
        
        if (rootNode) {
          rootNode.position = center;
          
          // Create concentric circles
          const rings: Record<string, Node[]> = { '0': [rootNode] };
          const visited = new Set([rootNode.id]);
          
          let currentRing = 0;
          while (visited.size < updatedNodes.length && currentRing < 5) {
            const nextRing = currentRing + 1;
            rings[nextRing] = [];
            
            rings[currentRing].forEach(parentNode => {
              const connected = edges
                .filter(edge => 
                  edge.source === parentNode.id || edge.target === parentNode.id
                )
                .map(edge => {
                  const connectedId = edge.source === parentNode.id ? edge.target : edge.source;
                  return updatedNodes.find(node => node.id === connectedId);
                })
                .filter(node => node && !visited.has(node.id));
              
              connected.forEach(node => {
                if (node) {
                  rings[nextRing].push(node);
                  visited.add(node.id);
                }
              });
            });
            
            currentRing++;
          }
          
          // Position nodes in rings
          Object.keys(rings).forEach(ringKey => {
            const ring = parseInt(ringKey);
            if (ring === 0) return;
            
            const ringNodes = rings[ringKey];
            const radius = baseRadius * ring;
            
            ringNodes.forEach((node, index) => {
              const angle = (index * 2 * Math.PI) / ringNodes.length;
              node.position = {
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle),
              };
            });
          });
        }
      } else if (layoutType === 'network') {
        // Force-based layout simulation
        const iterations = 50;
        const repulsion = 5000;
        const attraction = 0.01;
        
        for (let i = 0; i < iterations; i++) {
          // Apply repulsion between all nodes
          updatedNodes.forEach(nodeA => {
            let fx = 0, fy = 0;
            
            updatedNodes.forEach(nodeB => {
              if (nodeA.id !== nodeB.id) {
                const dx = nodeA.position.x - nodeB.position.x;
                const dy = nodeA.position.y - nodeB.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                const force = repulsion / (distance * distance);
                
                fx += (dx / distance) * force;
                fy += (dy / distance) * force;
              }
            });
            
            // Apply attraction for connected nodes
            edges.forEach(edge => {
              if (edge.source === nodeA.id) {
                const nodeB = updatedNodes.find(n => n.id === edge.target);
                if (nodeB) {
                  const dx = nodeB.position.x - nodeA.position.x;
                  const dy = nodeB.position.y - nodeA.position.y;
                  fx += dx * attraction;
                  fy += dy * attraction;
                }
              }
              if (edge.target === nodeA.id) {
                const nodeB = updatedNodes.find(n => n.id === edge.source);
                if (nodeB) {
                  const dx = nodeB.position.x - nodeA.position.x;
                  const dy = nodeB.position.y - nodeA.position.y;
                  fx += dx * attraction;
                  fy += dy * attraction;
                }
              }
            });
            
            // Update position
            nodeA.position.x += fx * 0.01;
            nodeA.position.y += fy * 0.01;
            
            // Keep nodes within bounds
            nodeA.position.x = Math.max(50, Math.min(750, nodeA.position.x));
            nodeA.position.y = Math.max(50, Math.min(550, nodeA.position.y));
          });
        }
      } else if (layoutType === 'histogram') {
        // Arrange nodes in columns based on connections
        const connectionCounts = updatedNodes.map(node => ({
          node,
          connections: edges.filter(edge => 
            edge.source === node.id || edge.target === node.id
          ).length
        }));
        
        connectionCounts.sort((a, b) => b.connections - a.connections);
        
        const columns = 5;
        connectionCounts.forEach(({ node }, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);
          
          node.position = {
            x: 100 + col * 150,
            y: 100 + row * 120,
          };
        });
      } else if (layoutType === 'free-flow') {
        // Spread nodes randomly but organized
        updatedNodes.forEach((node, index) => {
          const angle = (index * 2.4) % (2 * Math.PI);
          const radius = 100 + (index * 20) % 200;
          
          node.position = {
            x: 400 + radius * Math.cos(angle),
            y: 300 + radius * Math.sin(angle),
          };
        });
      }
      
      setNodes(updatedNodes);
      setViewMode(layoutType);
      
      // Save the new layout positions
      setLayoutPositions(prev => ({
        ...prev,
        [layoutType]: { nodes: updatedNodes }
      }));
      
      saveToHistory();
      toast.success(`Applied ${layoutType} layout`);
    },
    [nodes, edges, setNodes, saveToHistory, viewMode, layoutPositions]
  );

  if (showSettings) {
    return (
      <SettingsPage
        settings={settings}
        onSettingsChange={onSettingsChange}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: settings.backgroundColor }}>
      <Sidebar
        onAddNode={addNode}
        onExport={exportMap}
        onImport={importMap}
        onToggleAI={() => setShowAI(!showAI)}
        showAI={showAI}
        onQuickAction={handleQuickAction}
      />
      
      <div className="flex-1 flex flex-col">
        <TopNavbar
          onUndo={undo}
          onRedo={redo}
          onReset={resetWorkspace}
          onApplyLayout={applyLayout}
          onShowSettings={() => setShowSettings(true)}
          onShowShare={() => setShowShareDialog(true)}
          viewMode={viewMode}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          title={mapTitle}
          onTitleChange={setMapTitle}
        />
        
        <div className="flex-1 relative">
          <div ref={reactFlowWrapper} className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              deleteKeyCode="Delete"
              multiSelectionKeyCode="Control"
              snapToGrid={settings.snapToGrid}
              snapGrid={[15, 15]}
              connectionLineStyle={{ stroke: '#64748b', strokeWidth: 2 }}
            >
              <Controls />
              <Background 
                variant={settings.backgroundPattern as any}
                gap={12}
                size={1}
              />
              {settings.showMinimap && (
                <Panel position="bottom-right" className="m-2">
                  <div className="bg-card border rounded-lg p-2 shadow-sm">
                    <span className="text-sm text-muted-foreground">
                      Minimap
                    </span>
                  </div>
                </Panel>
              )}
              <Panel position="top-right" className="m-2">
                <div className="bg-card border rounded-lg p-2 shadow-sm">
                  <span className="text-sm text-muted-foreground">
                    Mode: {viewMode} | Nodes: {nodes.length} | Connections: {edges.length}
                  </span>
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </div>
      </div>

      <PropertiesPanel
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onUpdateNode={updateNode}
        onUpdateEdge={updateEdge}
        onDeleteNode={deleteNode}
        onDeleteEdge={deleteEdge}
      />

      {showAI && (
        <AIAssistant
          nodes={nodes}
          edges={edges}
          onAddNode={addNode}
          onApplyLayout={applyLayout}
          onClose={() => setShowAI(false)}
        />
      )}

      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        mapData={{ nodes, edges, viewMode, settings }}
      />
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    backgroundColor: '#ffffff',
    backgroundPattern: 'dots',
    theme: 'system',
    autoSave: true,
    snapToGrid: false,
    showMinimap: false,
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast.success('Welcome!');
  };

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
    toast.success('Settings updated');
  };

  if (!isLoggedIn) {
    return (
      <ThemeProvider>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <ConceptMapFlow 
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
        <Toaster />
      </ReactFlowProvider>
    </ThemeProvider>
  );
}