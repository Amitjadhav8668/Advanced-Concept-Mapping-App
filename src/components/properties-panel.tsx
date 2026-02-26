import { useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { 
  X, 
  Trash2, 
  Eye, 
  Palette,
  Tag,
  FileText,
  Circle,
  Square,
  Diamond,
  Hexagon,
  Star,
  Cloud,
  Triangle,
  Brain,
  Lightbulb,
  Target,
  Zap,
  Heart,
  Book,
  Settings,
  Users
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ColorPicker } from './color-picker';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
  onUpdateEdge: (edgeId: string, updates: any) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
}

const shapes = [
  { value: 'circle', label: 'Circle', icon: Circle },
  { value: 'rectangle', label: 'Rectangle', icon: Square },
  { value: 'diamond', label: 'Diamond', icon: Diamond },
  { value: 'hexagon', label: 'Hexagon', icon: Hexagon },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'cloud', label: 'Cloud', icon: Cloud },
  { value: 'triangle', label: 'Triangle', icon: Triangle },
];

const icons = [
  { value: 'Brain', label: 'Brain', icon: Brain },
  { value: 'Lightbulb', label: 'Lightbulb', icon: Lightbulb },
  { value: 'Target', label: 'Target', icon: Target },
  { value: 'Zap', label: 'Zap', icon: Zap },
  { value: 'Heart', label: 'Heart', icon: Heart },
  { value: 'Book', label: 'Book', icon: Book },
  { value: 'Settings', label: 'Settings', icon: Settings },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'Circle', label: 'Circle', icon: Circle },
];

const colors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#6366f1', '#14b8a6', '#f43f5e'
];

export function PropertiesPanel({ 
  selectedNode, 
  selectedEdge, 
  onUpdateNode, 
  onUpdateEdge,
  onDeleteNode,
  onDeleteEdge
}: PropertiesPanelProps) {
  const [nodeData, setNodeData] = useState<any>({});
  const [edgeData, setEdgeData] = useState<any>({});
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data);
    }
  }, [selectedNode]);

  useEffect(() => {
    if (selectedEdge) {
      setEdgeData(selectedEdge.data || {});
    }
  }, [selectedEdge]);

  const handleUpdateNode = (field: string, value: any) => {
    const updatedData = { ...nodeData, [field]: value };
    setNodeData(updatedData);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, updatedData);
    }
  };

  const addTag = () => {
    if (newTag && !nodeData.tags?.includes(newTag)) {
      const updatedTags = [...(nodeData.tags || []), newTag];
      handleUpdateNode('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = nodeData.tags?.filter((tag: string) => tag !== tagToRemove) || [];
    handleUpdateNode('tags', updatedTags);
  };

  const handleUpdateEdge = (field: string, value: any) => {
    const updatedData = { ...edgeData, [field]: value };
    setEdgeData(updatedData);
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, updatedData);
    }
  };

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-80 bg-card border-l border-border p-6 flex flex-col items-center justify-center text-center">
        <Eye className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">No Selection</h3>
        <p className="text-sm text-muted-foreground">
          Select a node or connection to view and edit its properties.
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border overflow-y-auto">
      {selectedNode && (
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Node Properties</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectedNode && onDeleteNode(selectedNode.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={nodeData.label || ''}
                  onChange={(e) => handleUpdateNode('label', e.target.value)}
                  placeholder="Enter node label"
                />
              </div>

              <div>
                <Label>Shape</Label>
                <Select
                  value={nodeData.shape || 'circle'}
                  onValueChange={(value) => handleUpdateNode('shape', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shapes.map((shape) => (
                      <SelectItem key={shape.value} value={shape.value}>
                        <div className="flex items-center gap-2">
                          <shape.icon className="w-4 h-4" />
                          {shape.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Icon</Label>
                <Select
                  value={nodeData.icon || 'Circle'}
                  onValueChange={(value) => handleUpdateNode('icon', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {icons.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        <div className="flex items-center gap-2">
                          <icon.icon className="w-4 h-4" />
                          {icon.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Styling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Color</Label>
                <div className="mt-2">
                  <ColorPicker
                    color={nodeData.color || '#3b82f6'}
                    onChange={(color) => handleUpdateNode('color', color)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Quick Colors</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 transition-all hover:scale-105 ${
                        nodeData.color === color ? 'border-foreground ring-2 ring-blue-200' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleUpdateNode('color', color)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {nodeData.tags?.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={nodeData.notes || ''}
                onChange={(e) => handleUpdateNode('notes', e.target.value)}
                placeholder="Add notes about this node..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {selectedEdge && (
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Connection Properties</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectedEdge && onDeleteEdge(selectedEdge.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Connection Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Connection Type</Label>
                <Select 
                  value={edgeData.connectionType || 'straight'}
                  onValueChange={(value) => handleUpdateEdge('connectionType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="straight">Straight Line</SelectItem>
                    <SelectItem value="curved">Curved Line</SelectItem>
                    <SelectItem value="step">Step Line</SelectItem>
                    <SelectItem value="arrow">Arrow</SelectItem>
                    <SelectItem value="circle">Circle End</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Thickness</Label>
                <Select 
                  value={String(edgeData.thickness || 2)}
                  onValueChange={(value) => handleUpdateEdge('thickness', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Thin (1px)</SelectItem>
                    <SelectItem value="2">Normal (2px)</SelectItem>
                    <SelectItem value="3">Medium (3px)</SelectItem>
                    <SelectItem value="4">Thick (4px)</SelectItem>
                    <SelectItem value="6">Very Thick (6px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color & Style
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Color</Label>
                <div className="mt-2">
                  <ColorPicker
                    color={edgeData.color || '#64748b'}
                    onChange={(color) => handleUpdateEdge('color', color)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Quick Colors</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 transition-all hover:scale-105 ${
                        edgeData.color === color ? 'border-foreground ring-2 ring-blue-200' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleUpdateEdge('color', color)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Connection Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={edgeData.notes || ''}
                onChange={(e) => handleUpdateEdge('notes', e.target.value)}
                placeholder="Add notes about this connection..."
                rows={3}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Notes will appear as labels on the connection line
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Connection Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From:</span>
                <span>Node {selectedEdge.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To:</span>
                <span>Node {selectedEdge.target}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>Just now</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}