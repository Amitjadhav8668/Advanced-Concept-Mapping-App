
import { EdgeProps, getBezierPath, getStraightPath, getSmoothStepPath } from 'reactflow';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style = {},
  selected,
}: EdgeProps) {
  const connectionType = data?.connectionType || 'straight';
  const color = data?.color || '#64748b';
  const thickness = data?.thickness || 2;
  const notes = data?.notes || '';

  // Calculate different path types
  let edgePath = '';
  if (connectionType === 'straight') {
    [edgePath] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  } else if (connectionType === 'step') {
    [edgePath] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  } else {
    [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  const edgeStyles = {
    straight: {},
    curved: {},
    step: {},
    arrow: {},
    dotted: { strokeDasharray: '5,5' },
    dashed: { strokeDasharray: '10,10' },
  };

  // Calculate label position (middle of the edge)
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2;

  const strokeWidth = selected ? thickness + 1 : thickness;
  const strokeColor = selected ? '#3b82f6' : color;

  return (
    <>
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L9,3 z"
            fill={strokeColor}
          />
        </marker>
        <marker
          id={`circle-${id}`}
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <circle
            cx="4"
            cy="4"
            r="3"
            fill={strokeColor}
          />
        </marker>
      </defs>

      {/* Main edge path */}
      <path
        id={id}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          ...edgeStyles[connectionType as keyof typeof edgeStyles],
        }}
        className={`react-flow__edge-path ${selected ? 'selected' : ''}`}
        d={edgePath}
        markerEnd={
          connectionType === 'arrow' 
            ? `url(#arrow-${id})` 
            : connectionType === 'circle'
            ? `url(#circle-${id})`
            : markerEnd
        }
      />

      {/* Invisible wider path for better click detection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={Math.max(20, strokeWidth + 10)}
        className="react-flow__edge-interaction"
      />

      {/* Edge label/notes */}
      {notes && (
        <foreignObject
          width={120}
          height={40}
          x={labelX - 60}
          y={labelY - 20}
          className="edge-label"
        >
          <div
            className={`
              px-2 py-1 text-xs rounded border shadow-sm bg-white dark:bg-gray-800 
              border-gray-200 dark:border-gray-700 text-center
              ${selected ? 'border-blue-500 ring-1 ring-blue-500' : ''}
            `}
            style={{
              fontSize: '11px',
              maxWidth: '120px',
              wordWrap: 'break-word',
              lineHeight: '1.2',
            }}
          >
            {notes.length > 20 ? `${notes.substring(0, 20)}...` : notes}
          </div>
        </foreignObject>
      )}

      {/* Selection indicator */}
      {selected && (
        <circle
          cx={labelX}
          cy={labelY}
          r="4"
          fill="#3b82f6"
          stroke="white"
          strokeWidth="2"
          className="animate-pulse"
        />
      )}
    </>
  );
}