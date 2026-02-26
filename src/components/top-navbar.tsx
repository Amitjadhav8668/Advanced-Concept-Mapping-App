import React, { useState, useRef, useEffect } from 'react';
import { 
  Undo, 
  Redo, 
  RotateCcw, 
  Share, 
  Settings,
  Moon,
  Sun,
  Monitor,
  Network,
  GitBranch,
  Radar,
  BarChart3,
  Pen
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { useTheme } from './theme-provider';
import { Badge } from './ui/badge';

interface TopNavbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onApplyLayout: (layout: string) => void;
  onShowSettings: () => void;
  onShowShare: () => void;
  viewMode: string;
  canUndo: boolean;
  canRedo: boolean;
  title?: string;
  onTitleChange?: (title: string) => void;
}

const layoutModes = [
  { name: 'free-flow', icon: Pen, label: 'Free-flow Whiteboard' },
  { name: 'tree', icon: GitBranch, label: 'Tree Graph' },
  { name: 'radial', icon: Radar, label: 'Radial Graph' },
  { name: 'network', icon: Network, label: 'Network Graph' },
  { name: 'histogram', icon: BarChart3, label: 'Histogram Graph' },
];

export function TopNavbar({ 
  onUndo, 
  onRedo, 
  onReset,
  onApplyLayout, 
  onShowSettings,
  onShowShare,
  viewMode, 
  canUndo, 
  canRedo,
  title = "Concept Map",
  onTitleChange 
}: TopNavbarProps) {
  const { setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLayout = layoutModes.find(mode => mode.name === viewMode);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    if (onTitleChange) {
      setIsEditing(true);
      setEditingTitle(title);
    }
  };

  const handleTitleSubmit = () => {
    if (onTitleChange && editingTitle.trim()) {
      onTitleChange(editingTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditingTitle(title);
    }
  };

  return (
    <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left Section - File & Edit */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleKeyPress}
            className="font-semibold bg-transparent border-b-2 border-blue-500 outline-none min-w-[140px]"
          />
        ) : (
          <h1 
            className={`font-semibold ${onTitleChange ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
            onClick={handleTitleClick}
          >
            {title}
          </h1>
        )}
        <Separator orientation="vertical" className="h-6" />
        
        {/* Edit Actions */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo className="w-4 h-4 mr-2" />
            Redo
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Center Section - View Mode */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {currentLayout && <currentLayout.icon className="w-4 h-4" />}
              <span>{currentLayout?.label || 'View Mode'}</span>
              <Badge variant="secondary" className="ml-2">
                {viewMode}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="p-2">
              <h4 className="font-medium mb-2">Layout Modes</h4>
              {layoutModes.map((mode) => (
                <DropdownMenuItem
                  key={mode.name}
                  onClick={() => onApplyLayout(mode.name)}
                  className="flex items-center gap-2"
                >
                  <mode.icon className="w-4 h-4" />
                  <span>{mode.label}</span>
                  {viewMode === mode.name && (
                    <Badge variant="default" className="ml-auto text-xs">
                      Active
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onShowShare}>
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-2">
              <h4 className="font-medium mb-2">Quick Theme</h4>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="w-4 h-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="w-4 h-4 mr-2" />
                System
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onShowSettings}>
              <Settings className="w-4 h-4 mr-2" />
              Settings & Preferences
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}