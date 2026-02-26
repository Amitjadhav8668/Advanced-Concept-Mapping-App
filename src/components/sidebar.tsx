import React, { useRef } from 'react';
import { 
  Plus, 
  Upload, 
  Download, 
  Bot,
  Circle,
  Square,
  Diamond,
  Hexagon,
  Star,
  Cloud,
  Triangle,
  Copy,
  AlignCenter,
  Layers
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface SidebarProps {
  onAddNode: (shape: string) => void;
  onExport: (format: string) => void;
  onImport: (file: File) => void;
  onToggleAI: () => void;
  showAI: boolean;
  onQuickAction?: (action: string) => void;
}

const nodeShapes = [
  { name: 'circle', icon: Circle, label: 'Circle' },
  { name: 'rectangle', icon: Square, label: 'Rectangle' },
  { name: 'diamond', icon: Diamond, label: 'Diamond' },
  { name: 'hexagon', icon: Hexagon, label: 'Hexagon' },
  { name: 'star', icon: Star, label: 'Star' },
  { name: 'cloud', icon: Cloud, label: 'Cloud' },
  { name: 'triangle', icon: Triangle, label: 'Triangle' },
];

const quickActions = [
  { name: 'duplicate', icon: Copy, label: 'Duplicate Selected' },
  { name: 'align', icon: AlignCenter, label: 'Align Nodes' },
  { name: 'group', icon: Layers, label: 'Group Selection' },
];

export function Sidebar({ onAddNode, onExport, onImport, onToggleAI, showAI, onQuickAction }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <TooltipProvider>
      <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4 gap-4">
        {/* Add Node Section */}
        <div className="flex flex-col items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="w-12 h-12">
                <Plus className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-48">
              <div className="p-2">
                <h4 className="font-medium mb-2">Add Node</h4>
                <div className="grid grid-cols-2 gap-2">
                  {nodeShapes.map((shape) => (
                    <DropdownMenuItem
                      key={shape.name}
                      onClick={() => onAddNode(shape.name)}
                      className="flex flex-col items-center p-2 cursor-pointer"
                    >
                      <shape.icon className="w-4 h-4 mb-1" />
                      <span className="text-xs">{shape.label}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator />

        {/* Tools Section */}
        <div className="flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showAI ? "default" : "outline"} 
                size="icon" 
                className="w-12 h-12"
                onClick={onToggleAI}
              >
                <Bot className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>AI Assistant</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="w-12 h-12">
                    <Copy className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-48">
                  <div className="p-2">
                    <h4 className="font-medium mb-2">Quick Actions</h4>
                    {quickActions.map((action) => (
                      <DropdownMenuItem
                        key={action.name}
                        onClick={() => onQuickAction?.(action.name)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <action.icon className="w-4 h-4" />
                        <span>{action.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Quick Actions</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator />

        {/* Import/Export Section */}
        <div className="flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="w-12 h-12"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Import Map</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="w-12 h-12">
                    <Download className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right">
                  <DropdownMenuItem onClick={() => onExport('json')}>
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport('png')}>
                    Export as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Export Map</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.csv"
          onChange={handleImport}
          className="hidden"
        />

        <div className="flex-1" />

        {/* Status */}
        <div className="flex flex-col items-center gap-1">
          <Badge variant="secondary" className="text-xs px-1">
            Live
          </Badge>
        </div>
      </div>
    </TooltipProvider>
  );
}