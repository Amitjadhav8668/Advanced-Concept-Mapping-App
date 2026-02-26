
import { Handle, Position, NodeProps } from 'reactflow';
import { 
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
import { Badge } from './ui/badge';

const iconMap = {
  Circle: Circle,
  Square: Square,
  Diamond: Diamond,
  Hexagon: Hexagon,
  Star: Star,
  Cloud: Cloud,
  Triangle: Triangle,
  Brain: Brain,
  Lightbulb: Lightbulb,
  Target: Target,
  Zap: Zap,
  Heart: Heart,
  Book: Book,
  Settings: Settings,
  Users: Users,
};

const getShapeStyles = (shape: string) => {
  switch (shape) {
    case 'circle':
      return {
        className: 'rounded-full aspect-square',
        clipPath: '',
      };
    case 'rectangle':
      return {
        className: 'rounded-lg',
        clipPath: '',
      };
    case 'diamond':
      return {
        className: 'rounded-lg',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      };
    case 'hexagon':
      return {
        className: 'rounded-lg',
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
      };
    case 'star':
      return {
        className: 'rounded-lg',
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
      };
    case 'cloud':
      return {
        className: 'rounded-full',
        clipPath: '',
      };
    case 'ellipse':
      return {
        className: 'rounded-full',
        clipPath: '',
        transform: 'scaleX(1.4)',
      };
    case 'triangle':
      return {
        className: 'rounded-lg',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      };
    default:
      return {
        className: 'rounded-lg',
        clipPath: '',
      };
  }
};

export function CustomNode({ data, selected }: NodeProps) {
  const Icon = iconMap[data.icon as keyof typeof iconMap] || Circle;
  const shapeStyles = getShapeStyles(data.shape);
  
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 !bg-blue-500 border-2 border-white opacity-0 hover:opacity-100 group-hover:opacity-60 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 !bg-blue-500 border-2 border-white opacity-0 hover:opacity-100 group-hover:opacity-60 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="w-3 h-3 !bg-blue-500 border-2 border-white opacity-0 hover:opacity-100 group-hover:opacity-60 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 !bg-blue-500 border-2 border-white opacity-0 hover:opacity-100 group-hover:opacity-60 transition-opacity"
      />

      <div
        className={`
          group min-w-32 max-w-48 p-4 border-4 bg-card shadow-lg cursor-pointer transition-all duration-200
          ${shapeStyles.className}
          ${selected ? 'border-blue-500 shadow-xl scale-105 ring-2 ring-blue-200' : 'border-gray-400 hover:border-blue-300 hover:shadow-xl'}
        `}
        style={{
          backgroundColor: selected ? data.color + '30' : data.color + '20',
          borderColor: selected ? '#3b82f6' : data.color,
          borderWidth: '3px',
          borderStyle: 'solid',
          clipPath: shapeStyles.clipPath,
          transform: shapeStyles.transform,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Icon 
              className="w-5 h-5" 
              style={{ color: data.color }}
            />
            <span className="font-medium text-center break-words">
              {data.label}
            </span>
          </div>
          
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {data.tags.slice(0, 2).map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
              {data.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  +{data.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-3 h-3 !bg-green-500 border-2 border-white opacity-0 hover:opacity-100 group-hover:opacity-60 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3 !bg-green-500 border-2 border-white opacity-0 hover:opacity-100 group-hover:opacity-60 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 !bg-green-500 border-2 border-white opacity-0 hover:opacity-100 group-hover:opacity-60 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 !bg-green-500 border-2 border-white opacity-0 hover:opacity-100 group-hover:opacity-60 transition-opacity"
      />

      {/* Connection hint tooltip */}
      {selected && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
          Blue = Input • Green = Output
        </div>
      )}
    </div>
  );
}