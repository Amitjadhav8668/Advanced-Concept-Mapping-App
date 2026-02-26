import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const defaultPresetColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#6366f1', '#14b8a6', '#f43f5e',
  '#64748b', '#374151', '#1f2937', '#000000',
];

export function ColorPicker({ 
  color, 
  onChange, 
  presetColors = defaultPresetColors 
}: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(color);

  const handleCustomColorChange = (newColor: string) => {
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full justify-start gap-2"
        >
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: color }}
          />
          <Palette className="w-4 h-4" />
          Color
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" side="right">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Preset Colors</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className={`
                    w-8 h-8 rounded border-2 transition-all hover:scale-105
                    ${color === presetColor ? 'border-foreground ring-2 ring-blue-200' : 'border-border'}
                  `}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => onChange(presetColor)}
                >
                  {color === presetColor && (
                    <Check className="w-3 h-3 text-white mx-auto" style={{
                      filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.8))'
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Custom Color</Label>
            <div className="flex gap-2 mt-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-12 h-8 rounded border border-border cursor-pointer"
              />
              <Input
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Recent Colors</Label>
            <div className="grid grid-cols-6 gap-1 mt-2">
              {[color, ...presetColors.slice(0, 5)].map((recentColor, index) => (
                <button
                  key={`recent-${index}`}
                  className="w-6 h-6 rounded border border-border hover:scale-105 transition-all"
                  style={{ backgroundColor: recentColor }}
                  onClick={() => onChange(recentColor)}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}