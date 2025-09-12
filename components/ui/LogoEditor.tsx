import { useState, useEffect, useRef } from 'react';
import { LogoConfig, IconData, PaletteData } from '@/lib/types';
import { Edit, Save, ShoppingCart, Download, Check, X, Crown, Zap, User, FileImage, Star, Award, Globe, Briefcase, TrendingUp, Users, Brush, Square, Eraser, Move, RotateCcw, Layers } from 'lucide-react';
import { fontCategories } from '@/lib/data';
import AdvancedFabricLogoEditor from '@/components/editor/AdvancedFabricLogoEditor';

interface LogoEditorProps {
  config: LogoConfig;
  onConfigUpdate: (newConfig: Partial<LogoConfig>) => void;
  availableIcons: IconData[];
  availablePalettes: PaletteData[];
}

// Types for drawing tools
interface Point {
  x: number;
  y: number;
}

interface Stroke {
  id: string;
  tool: 'brush' | 'eraser' | 'box';
  points: Point[];
  color: string;
  width: number;
  rect?: { x: number; y: number; width: number; height: number };
}

interface BoxShape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  rotation: number;
  selected: boolean;
}

interface EditLayer {
  id: string;
  name: string;
  visible: boolean;
  strokes: Stroke[];
}

const LogoEditor = ({ config, onConfigUpdate, availableIcons, availablePalettes }: LogoEditorProps) => {
  const [showFullscreenEditor, setShowFullscreenEditor] = useState(false);
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});
  const [localConfig, setLocalConfig] = useState<LogoConfig>(config);
  
  // Drawing tool states
  const [drawingTool, setDrawingTool] = useState<'brush' | 'eraser' | 'box' | 'line'>('brush');
  const [brushSize, setBrushSize] = useState(10);
  const [boxStrokeColor, setBoxStrokeColor] = useState('#000000');
  const [boxFillColor, setBoxFillColor] = useState('#ff0000');
  const [iconColor, setIconColor] = useState(config.palette?.colors[1] || '#000000');
  const [brandNameColor, setBrandNameColor] = useState(config.palette?.colors[1] || '#000000');
  const [sloganColor, setSloganColor] = useState(config.palette?.colors[1] || '#000000');
  
  // Box drawing state
  const [boxes, setBoxes] = useState<BoxShape[]>([]);
  const [currentBox, setCurrentBox] = useState<BoxShape | null>(null);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [brushColor, setBrushColor] = useState('#000000');
  const [boxWidth, setBoxWidth] = useState(50);
  const [boxHeight, setBoxHeight] = useState(50);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Rotation state
  const [isRotating, setIsRotating] = useState(false);
  const [rotatingBox, setRotatingBox] = useState<string | null>(null);
  const [rotationStart, setRotationStart] = useState<{
    centerX: number;
    centerY: number;
    startAngle: number;
    initialRotation: number;
  } | null>(null);

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizingBox, setResizingBox] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<'tl' | 'tr' | 'bl' | 'br' | null>(null);
  const [resizeStart, setResizeStart] = useState<{
    startX: number;
    startY: number;
    originalBox: BoxShape;
  } | null>(null);

  // Move state
  const [isMoving, setIsMoving] = useState(false);
  const [movingBox, setMovingBox] = useState<string | null>(null);
  const [moveStart, setMoveStart] = useState<{
    startX: number;
    startY: number;
    originalBox: BoxShape;
  } | null>(null);

  // Fill popup state
  const [showFillPopup, setShowFillPopup] = useState(false);
  const [fillColor, setFillColor] = useState('#ff0000');

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Line tool state
  const [lineColor, setLineColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [currentLine, setCurrentLine] = useState<{ start: Point; end: Point } | null>(null);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [editLayers, setEditLayers] = useState<EditLayer[]>([
    { id: 'layer-1', name: 'Drawing Layer', visible: true, strokes: [] }
  ]);
  
  // Canvas refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drawingRef = useRef({ drawing: false, startPoint: null as Point | null });
  
  // Sync local config with props
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  // Global mouse events for rotation, resize, and move
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      
      const rect = svgRef.current.getBoundingClientRect();
      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      // Handle rotation
      if (isRotating && rotatingBox && rotationStart) {
        const currentAngle = Math.atan2(point.y - rotationStart.centerY, point.x - rotationStart.centerX);
        const angleDifference = currentAngle - rotationStart.startAngle;
        const newRotation = rotationStart.initialRotation + (angleDifference * 180 / Math.PI);
        
        setBoxes(prev => prev.map(box => 
          box.id === rotatingBox 
            ? { ...box, rotation: newRotation }
            : box
        ));
      }

      // Handle resizing
      if (isResizing && resizingBox && resizeHandle && resizeStart) {
        const deltaX = point.x - resizeStart.startX;
        const deltaY = point.y - resizeStart.startY;
        const originalBox = resizeStart.originalBox;

        let newBox = { ...originalBox };

        switch (resizeHandle) {
          case 'tl': // Top-left
            newBox.x = originalBox.x + deltaX;
            newBox.y = originalBox.y + deltaY;
            newBox.width = originalBox.width - deltaX;
            newBox.height = originalBox.height - deltaY;
            break;
          case 'tr': // Top-right
            newBox.y = originalBox.y + deltaY;
            newBox.width = originalBox.width + deltaX;
            newBox.height = originalBox.height - deltaY;
            break;
          case 'bl': // Bottom-left
            newBox.x = originalBox.x + deltaX;
            newBox.width = originalBox.width - deltaX;
            newBox.height = originalBox.height + deltaY;
            break;
          case 'br': // Bottom-right
            newBox.width = originalBox.width + deltaX;
            newBox.height = originalBox.height + deltaY;
            break;
        }

        // Minimum size constraints
        if (newBox.width >= 10 && newBox.height >= 10) {
          setBoxes(prev => prev.map(box => 
            box.id === resizingBox ? newBox : box
          ));
        }
      }

      // Handle moving
      if (isMoving && movingBox && moveStart) {
        const deltaX = point.x - moveStart.startX;
        const deltaY = point.y - moveStart.startY;
        const originalBox = moveStart.originalBox;

        const newBox = {
          ...originalBox,
          x: originalBox.x + deltaX,
          y: originalBox.y + deltaY
        };

        setBoxes(prev => prev.map(box => 
          box.id === movingBox ? newBox : box
        ));
      }
    };

    const handleGlobalMouseUp = () => {
      if (isRotating) {
        setIsRotating(false);
        setRotatingBox(null);
        setRotationStart(null);
      }
      if (isResizing) {
        setIsResizing(false);
        setResizingBox(null);
        setResizeHandle(null);
        setResizeStart(null);
      }
      if (isMoving) {
        setIsMoving(false);
        setMovingBox(null);
        setMoveStart(null);
      }
    };

    if (isRotating || isResizing || isMoving) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isRotating, rotatingBox, rotationStart, isResizing, resizingBox, resizeHandle, resizeStart, isMoving, movingBox, moveStart]);
  
  // Update function that updates both local state and calls parent
  const updateLocalConfig = (updates: Partial<LogoConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onConfigUpdate(updates);
  };

  // Drawing functions
  const getPointFromEvent = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent) => {
    const point = getPointFromEvent(e);
    
    if (drawingTool === 'brush' || drawingTool === 'eraser') {
      const newStroke: Stroke = {
        id: `stroke-${Date.now()}`,
        tool: drawingTool,
        points: [point],
        color: drawingTool === 'eraser' ? '#FFFFFF' : brushColor,
        width: brushSize
      };
      setCurrentStroke(newStroke);
      setIsDrawing(true);
      drawingRef.current.drawing = true;
    } else if (drawingTool === 'box') {
      const newBox: BoxShape = {
        id: `box-${Date.now()}`,
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        strokeColor: boxStrokeColor,
        fillColor: 'transparent', // New boxes start transparent, use fill tool to color them
        strokeWidth: 0.5,
        rotation: 0,
        selected: false
      };
      setCurrentBox(newBox);
      setIsDrawing(true);
      drawingRef.current.drawing = true;
      drawingRef.current.startPoint = point;
    } else if (drawingTool === 'line') {
      setCurrentLine({ start: point, end: point });
      setIsDrawing(true);
      drawingRef.current.drawing = true;
      drawingRef.current.startPoint = point;
    }
  };

  const continueDrawing = (e: React.MouseEvent) => {
    if (!drawingRef.current.drawing && !isRotating && !isResizing && !isMoving) return;
    
    const point = getPointFromEvent(e);
    
    // Handle rotation
    if (isRotating && rotatingBox && rotationStart) {
      const currentAngle = Math.atan2(point.y - rotationStart.centerY, point.x - rotationStart.centerX);
      const angleDifference = currentAngle - rotationStart.startAngle;
      const newRotation = rotationStart.initialRotation + (angleDifference * 180 / Math.PI);
      
      setBoxes(prev => prev.map(box => 
        box.id === rotatingBox 
          ? { ...box, rotation: newRotation }
          : box
      ));
      return;
    }
    
    if ((drawingTool === 'brush' || drawingTool === 'eraser') && currentStroke) {
      setCurrentStroke({
        ...currentStroke,
        points: [...currentStroke.points, point]
      });
    } else if (drawingTool === 'box' && currentBox && drawingRef.current.startPoint) {
      const startPoint = drawingRef.current.startPoint;
      const width = point.x - startPoint.x;
      const height = point.y - startPoint.y;
      
      // Normalize coordinates to handle drawing in all directions
      const normalizedBox = {
        x: Math.min(startPoint.x, point.x),
        y: Math.min(startPoint.y, point.y),
        width: Math.abs(width),
        height: Math.abs(height)
      };
      
      setCurrentBox({
        ...currentBox,
        x: normalizedBox.x,
        y: normalizedBox.y,
        width: normalizedBox.width,
        height: normalizedBox.height
      });
    } else if (drawingTool === 'line' && currentLine) {
      setCurrentLine({
        ...currentLine,
        end: point
      });
    }
  };

  const endDrawing = (e: React.MouseEvent) => {
    // Handle rotation end
    if (isRotating) {
      setIsRotating(false);
      setRotatingBox(null);
      setRotationStart(null);
      return;
    }
    
    // Handle resize end
    if (isResizing) {
      setIsResizing(false);
      setResizingBox(null);
      setResizeHandle(null);
      setResizeStart(null);
      return;
    }
    
    // Handle move end
    if (isMoving) {
      setIsMoving(false);
      setMovingBox(null);
      setMoveStart(null);
      return;
    }
    
    if (!drawingRef.current.drawing) return;
    
    const point = getPointFromEvent(e);
    
    if (drawingTool === 'box' && currentBox) {
      // Finalize the box and add it to the boxes array
      const finalBox = {
        ...currentBox,
        selected: true // Select the newly created box for rotation adjustment
      };
      
      setBoxes(prev => [...prev, finalBox]);
      setSelectedBox(finalBox.id);
      setCurrentBox(null);
    } else if (currentStroke) {
      // Add brush/eraser stroke to current layer
      setEditLayers(prev => prev.map(layer => 
        layer.id === 'layer-1' 
          ? { ...layer, strokes: [...layer.strokes, currentStroke] }
          : layer
      ));
    } else if (drawingTool === 'line' && currentLine) {
      // Create a line stroke from the current line
      const lineStroke: Stroke = {
        id: `line-${Date.now()}`,
        tool: 'line',
        points: [currentLine.start, currentLine.end],
        color: lineColor,
        width: lineWidth
      };
      
      setEditLayers(prev => prev.map(layer => 
        layer.id === 'layer-1' 
          ? { ...layer, strokes: [...layer.strokes, lineStroke] }
          : layer
      ));
      setCurrentLine(null);
    }
    
    setCurrentStroke(null);
    setIsDrawing(false);
    drawingRef.current.drawing = false;
    drawingRef.current.startPoint = null;
  };

  // Box rotation functionality
  const rotateSelectedBox = (degrees: number) => {
    if (!selectedBox) return;
    
    setBoxes(prev => prev.map(box => 
      box.id === selectedBox 
        ? { ...box, rotation: box.rotation + degrees }
        : box
    ));
  };

  // Fill tool functionality
  const fillBox = (boxId: string) => {
    setBoxes(prev => prev.map(box => 
      box.id === boxId 
        ? { ...box, fillColor: fillColor }
        : box
    ));
  };

  const clearDrawing = () => {
    setEditLayers(prev => prev.map(layer => ({ ...layer, strokes: [] })));
  };

  const undoLastStroke = () => {
    setEditLayers(prev => prev.map(layer => 
      layer.id === 'layer-1' 
        ? { ...layer, strokes: layer.strokes.slice(0, -1) }
        : layer
    ));
  };

  // Render drawing layers as SVG overlay
  const renderDrawingLayers = () => {
    const pointsToPath = (points: Point[]) => {
      if (!points || points.length === 0) return "";
      const [first, ...rest] = points;
      return `M ${first.x} ${first.y}` + rest.map((p) => ` L ${p.x} ${p.y}`).join("");
    };

    return (
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 10 }}
      >
        {/* Render existing strokes */}
        {editLayers.map(layer => 
          layer.visible && layer.strokes.map(stroke => {
            if (stroke.tool === 'box' && stroke.rect) {
              return (
                <rect
                  key={stroke.id}
                  x={stroke.rect.x}
                  y={stroke.rect.y}
                  width={stroke.rect.width}
                  height={stroke.rect.height}
                  fill={stroke.tool === 'eraser' ? 'rgba(255,255,255,0.8)' : stroke.color}
                  stroke={stroke.color}
                  strokeWidth={stroke.width}
                  opacity={stroke.tool === 'eraser' ? 0.8 : 0.7}
                />
              );
            } else if (stroke.tool === 'line' && stroke.points.length >= 2) {
              return (
                <line
                  key={stroke.id}
                  x1={stroke.points[0].x}
                  y1={stroke.points[0].y}
                  x2={stroke.points[1].x}
                  y2={stroke.points[1].y}
                  stroke={stroke.color}
                  strokeWidth={stroke.width}
                  strokeLinecap="round"
                  style={{ pointerEvents: 'none' }}
                />
              );
            } else {
              return (
                <path
                  key={stroke.id}
                  d={pointsToPath(stroke.points)}
                  fill="none"
                  stroke={stroke.color}
                  strokeWidth={stroke.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={stroke.tool === 'eraser' ? 0.8 : 1}
                  style={{ pointerEvents: 'none' }}
                />
              );
            }
          })
        )}
        
        {/* Render boxes */}
        {boxes.map(box => (
          <g key={box.id} transform={`rotate(${box.rotation} ${box.x + box.width/2} ${box.y + box.height/2})`}>
            <rect
              x={box.x}
              y={box.y}
              width={Math.abs(box.width)}
              height={Math.abs(box.height)}
              fill={box.fillColor === 'transparent' ? 'none' : box.fillColor}
              stroke={box.strokeColor}
              strokeWidth={box.strokeWidth}
              opacity={0.9}
              className="cursor-move"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                
                if (showFillPopup) {
                  // Apply fill and close popup
                  fillBox(box.id);
                  setShowFillPopup(false);
                  return;
                }
                
                // Select the box first
                setSelectedBox(box.id);
                setBoxes(prev => prev.map(b => ({
                  ...b, 
                  selected: b.id === box.id
                })));
                
                // Prepare for potential move (will be activated on first mouse move)
                const svg = e.currentTarget.ownerSVGElement;
                if (!svg) return;
                const rect = svg.getBoundingClientRect();
                setMoveStart({
                  startX: e.clientX - rect.left,
                  startY: e.clientY - rect.top,
                  originalBox: { ...box }
                });
              }}
              onMouseMove={(e) => {
                if (moveStart && !isMoving) {
                  // Start moving on first mouse move
                  setIsMoving(true);
                  setMovingBox(box.id);
                }
              }}
            />
            {/* Selection handles - resize functionality */}
            {box.selected && (
              <>
                {/* Top-left resize handle */}
                <circle 
                  cx={box.x} 
                  cy={box.y} 
                  r="2" 
                  fill="blue"
                  className="cursor-nw-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsResizing(true);
                    setResizingBox(box.id);
                    setResizeHandle('tl');
                    const svg = e.currentTarget.ownerSVGElement;
                    if (!svg) return;
                    const rect = svg.getBoundingClientRect();
                    setResizeStart({
                      startX: e.clientX - rect.left,
                      startY: e.clientY - rect.top,
                      originalBox: { ...box }
                    });
                  }}
                />
                {/* Top-right resize handle */}
                <circle 
                  cx={box.x + box.width} 
                  cy={box.y} 
                  r="2" 
                  fill="blue"
                  className="cursor-ne-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsResizing(true);
                    setResizingBox(box.id);
                    setResizeHandle('tr');
                    const svg = e.currentTarget.ownerSVGElement;
                    if (!svg) return;
                    const rect = svg.getBoundingClientRect();
                    setResizeStart({
                      startX: e.clientX - rect.left,
                      startY: e.clientY - rect.top,
                      originalBox: { ...box }
                    });
                  }}
                />
                {/* Bottom-left resize handle */}
                <circle 
                  cx={box.x} 
                  cy={box.y + box.height} 
                  r="2" 
                  fill="blue"
                  className="cursor-sw-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsResizing(true);
                    setResizingBox(box.id);
                    setResizeHandle('bl');
                    const svg = e.currentTarget.ownerSVGElement;
                    if (!svg) return;
                    const rect = svg.getBoundingClientRect();
                    setResizeStart({
                      startX: e.clientX - rect.left,
                      startY: e.clientY - rect.top,
                      originalBox: { ...box }
                    });
                  }}
                />
                {/* Bottom-right resize handle */}
                <circle 
                  cx={box.x + box.width} 
                  cy={box.y + box.height} 
                  r="2" 
                  fill="blue"
                  className="cursor-se-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsResizing(true);
                    setResizingBox(box.id);
                    setResizeHandle('br');
                    const svg = e.currentTarget.ownerSVGElement;
                    if (!svg) return;
                    const rect = svg.getBoundingClientRect();
                    setResizeStart({
                      startX: e.clientX - rect.left,
                      startY: e.clientY - rect.top,
                      originalBox: { ...box }
                    });
                  }}
                />
                {/* Rotation handle with drag handler */}
                <circle 
                  cx={box.x + box.width/2} 
                  cy={box.y - 20} 
                  r="3" 
                  fill="green"
                  className="cursor-pointer hover:cursor-grab"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsRotating(true);
                    setRotatingBox(box.id);
                    
                    // Get SVG coordinates from the event
                    const svg = e.currentTarget.ownerSVGElement;
                    if (!svg) return;
                    
                    const rect = svg.getBoundingClientRect();
                    const point = {
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top
                    };
                    
                    const centerX = box.x + box.width / 2;
                    const centerY = box.y + box.height / 2;
                    const startAngle = Math.atan2(point.y - centerY, point.x - centerX);
                    setRotationStart({ centerX, centerY, startAngle, initialRotation: box.rotation });
                  }}
                />
                <line x1={box.x + box.width/2} y1={box.y} x2={box.x + box.width/2} y2={box.y - 20} stroke="green" strokeWidth="1" />
              </>
            )}
          </g>
        ))}
        
        {/* Render current box being drawn (live preview) */}
        {currentBox && (
          <rect
            x={currentBox.x}
            y={currentBox.y}
            width={Math.abs(currentBox.width)}
            height={Math.abs(currentBox.height)}
            fill={currentBox.fillColor === 'transparent' ? 'none' : currentBox.fillColor}
            stroke={currentBox.strokeColor}
            strokeWidth={currentBox.strokeWidth}
            opacity={0.8}
            strokeDasharray="5,5"
            style={{ pointerEvents: 'none' }}
          />
        )}
        
        {/* Render current stroke being drawn */}
        {currentStroke && (
          <path
            d={pointsToPath(currentStroke.points)}
            fill="none"
            stroke={currentStroke.color}
            strokeWidth={currentStroke.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.7}
            style={{ pointerEvents: 'none' }}
          />
        )}
        
        {/* Render current line being drawn */}
        {currentLine && (
          <line
            x1={currentLine.start.x}
            y1={currentLine.start.y}
            x2={currentLine.end.x}
            y2={currentLine.end.y}
            stroke={lineColor}
            strokeWidth={lineWidth}
            strokeLinecap="round"
            opacity={0.7}
            style={{ pointerEvents: 'none' }}
            strokeDasharray="5,5"
          />
        )}
      </svg>
    );
  };

  // Helper function to calculate dynamic font size based on text length
  const getDynamicFontSize = (textLength: number, isCircleLayout: boolean = false) => {
    const baseSize = isCircleLayout ? 1.5 : 2.25; // rem units
    if (textLength <= 8) return `${baseSize}rem`;
    if (textLength <= 12) return `${baseSize * 0.85}rem`;
    if (textLength <= 16) return `${baseSize * 0.7}rem`;
    if (textLength <= 20) return `${baseSize * 0.6}rem`;
    return `${baseSize * 0.5}rem`;
  };

  // Helper function to render logo content based on layout type
  const renderLogoContent = (textColor: string, backgroundColor: string, font: any, logoConfig: LogoConfig) => {
    const isCircleLayout = logoConfig.layout?.id === 'circle-enclosed';
    const dynamicFontSize = getDynamicFontSize(logoConfig.text.length, isCircleLayout);
    
    console.log('renderLogoContent called with fontWeight:', logoConfig.fontWeight);
    
    if (isCircleLayout && logoConfig.enclosingShape) {
      // For circle layouts: show enclosing shape as background with content inside
      return (
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Enclosing shape as background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <logoConfig.enclosingShape.component 
              size={120} 
              color={textColor}
              className="w-full h-full" 
              style={{ fill: textColor }}
            />
          </div>
          {/* Content in center */}
          <div className="relative z-10 flex flex-col items-center">
            {logoConfig.icon && (
              <logoConfig.icon.component size={32} color={iconColor} className="mb-2" />
            )}
            <div className="flex flex-col items-center text-center max-w-full px-4">
              <span 
                className="logo-text-preview"
                style={{ 
                  fontSize: dynamicFontSize,
                  fontFamily: font.cssName,
                  fontWeight: logoConfig.fontWeight || 400,
                  color: textColor,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  display: 'block'
                }}
                title={`FontWeight: ${logoConfig.fontWeight || 400}`}
              >
                {logoConfig.text || 'Your Logo'}
              </span>
              {logoConfig.slogan && (
                <span className="text-sm font-normal opacity-80 mt-1 max-w-full truncate" style={{ 
                  fontWeight: 300,
                  color: textColor
                }}>
                  {logoConfig.slogan}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      // Standard layout: check arrangement type
      const isHorizontalLayout = logoConfig.layout?.arrangement === 'icon-left' || logoConfig.layout?.arrangement === 'text-left';
      
      if (isHorizontalLayout) {
        // Horizontal layout: different arrangements
        const isTextFirst = logoConfig.layout?.arrangement === 'text-left';
        
        return (
          <div className="flex items-center justify-center gap-4">
            {/* Text first (text-left) or Icon first (icon-left) */}
            {isTextFirst ? (
              <>
                <div className="flex flex-col items-center text-center justify-center">
                  <span className="logo-text-preview whitespace-nowrap overflow-hidden text-ellipsis" style={{ 
                    fontSize: dynamicFontSize,
                    fontFamily: font.cssName,
                    fontWeight: logoConfig.fontWeight || 400,
                    color: textColor
                  }}>
                    {logoConfig.text || 'Your Logo'}
                  </span>
                  {logoConfig.slogan && (
                    <span className="text-base font-normal opacity-80 mt-1 truncate" style={{ 
                      fontWeight: 300,
                      color: textColor
                    }}>
                      {logoConfig.slogan}
                    </span>
                  )}
                </div>
                {logoConfig.icon && (
                  <logoConfig.icon.component size={48} color={iconColor} className="flex-shrink-0" />
                )}
              </>
            ) : (
              <>
                {logoConfig.icon && (
                  <logoConfig.icon.component size={48} color={iconColor} className="flex-shrink-0" />
                )}
                <div className="flex flex-col items-center text-center justify-center">
                  <span className="logo-text-preview whitespace-nowrap overflow-hidden text-ellipsis" style={{ 
                    fontSize: dynamicFontSize,
                    fontFamily: font.cssName,
                    fontWeight: logoConfig.fontWeight || 400,
                    color: textColor
                  }}>
                    {logoConfig.text || 'Your Logo'}
                  </span>
                  {logoConfig.slogan && (
                    <span className="text-base font-normal opacity-80 mt-1 truncate" style={{ 
                      fontWeight: 300,
                      color: textColor
                    }}>
                      {logoConfig.slogan}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        );
      } else {
        // Vertical layout: icon top, text below
        return (
          <div className="flex flex-col items-center">
            {logoConfig.icon && (
              <logoConfig.icon.component size={48} color={iconColor} className="mb-2" />
            )}
            <div className="flex flex-col items-center text-center w-full max-w-full px-4">
              <span className="logo-text-preview whitespace-nowrap overflow-hidden text-ellipsis max-w-full" style={{ 
                fontSize: dynamicFontSize,
                fontFamily: font.cssName,
                fontWeight: logoConfig.fontWeight || 400,
                color: textColor
              }}>
                {logoConfig.text || 'Your Logo'}
              </span>
              {logoConfig.slogan && (
                <span className="text-base font-normal opacity-80 mt-1 max-w-full truncate" style={{ 
                  fontWeight: 300,
                  color: textColor
                }}>
                  {logoConfig.slogan}
                </span>
              )}
            </div>
          </div>
        );
      }
    }
  };

  const handleEdit = () => {
    setShowFullscreenEditor(true);
  };

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleSaveOption = (option: string) => {
    console.log('Selected save option:', option, 'for logo:', config);
    setShowSaveModal(false);
    
    if (option === 'svg') {
      // TODO: Implement SVG download
      const svgString = generateSVG(config);
      downloadFile(svgString, `${localConfig.text || 'logo'}.svg`, 'image/svg+xml');
    } else if (option === 'png') {
      // TODO: Implement PNG download
      console.log('Downloading PNG...');
    } else if (option === 'profile') {
      // TODO: Implement save to profile
      console.log('Saving to profile...');
    }
  };

  const generateSVG = (config: LogoConfig) => {
    // Simple SVG generation - in real app, this would be more sophisticated
    return `<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
      <text x="150" y="50" text-anchor="middle" fill="${localConfig.palette?.colors[1] || '#000'}" font-size="24" font-weight="bold">
        ${localConfig.text || 'Your Logo'}
      </text>
      ${localConfig.slogan ? `<text x="150" y="75" text-anchor="middle" fill="${localConfig.palette?.colors[1] || '#000'}" font-size="12">${localConfig.slogan}</text>` : ''}
    </svg>`;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  const handlePurchaseOption = (option: string) => {
    // TODO: Implement actual purchase flow
    console.log('Selected purchase option:', option, 'for logo:', config);
    setShowPurchaseModal(false);
    // In real implementation, this would redirect to payment processor
  };

  const toggleCardFlip = (cardId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  return (
    <>
      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
      {/* Menu Panel - slides up from bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/20 rounded-b-lg p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-10 shadow-xl">
        <div className="flex gap-1 justify-center">
          <button
            onClick={handleEdit}
            className="flex items-center justify-center gap-1 px-1.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors flex-1 max-w-[60px]"
          >
            <Edit size={12} /> Edit
          </button>
          <button
            onClick={() => {
              console.log('🔥 Pro Button clicked! Setting showAdvancedEditor to true...');
              setShowAdvancedEditor(true);
            }}
            className="flex items-center justify-center gap-1 px-1.5 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded text-xs font-medium transition-colors flex-1 max-w-[60px]"
          >
            <Layers size={12} /> Pro
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-1 px-1.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors flex-1 max-w-[60px]"
          >
            <Save size={12} /> Save
          </button>
          <button
            onClick={handlePurchase}
            className="flex items-center justify-center gap-1 px-1.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors flex-1 max-w-[60px]"
          >
            <ShoppingCart size={12} /> Buy
          </button>
        </div>
      </div>

      {/* Fullscreen Editor Modal */}
      {showFullscreenEditor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex">
            {/* Logo Preview Side with Drawing Canvas */}
            <div className="flex-1 p-8 flex items-center justify-center border-r border-white/20">
              <div className="relative bg-white rounded-lg p-12 max-w-md w-full aspect-square flex items-center justify-center" key={`${localConfig.fontWeight}-${localConfig.text}-${localConfig.font?.name}-${localConfig.palette?.id}`}>
                
                {/* Original Logo Content */}
                {(() => {
                  console.log('Preview render with localConfig.fontWeight:', localConfig.fontWeight);
                  return renderLogoContent(
                    localConfig.palette?.colors[1] || '#000000',
                    localConfig.palette?.colors[0] || '#FFFFFF',
                    localConfig.font || fontCategories[0].fonts[0], // Use selected font or default
                    localConfig
                  );
                })()}
                
                {/* Drawing Canvas Overlay */}
                <div 
                  ref={canvasRef}
                  className={`absolute inset-0 rounded-lg ${(drawingTool === 'brush' || drawingTool === 'eraser') ? 'cursor-none' : drawingTool === 'fill' ? 'cursor-crosshair' : 'cursor-crosshair'}`}
                  onMouseDown={startDrawing}
                  onMouseMove={continueDrawing}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                  style={{ 
                    cursor: (drawingTool === 'brush' || drawingTool === 'eraser')
                      ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${Math.round((brushSize + 2) * zoomLevel)}' height='${Math.round((brushSize + 2) * zoomLevel)}' viewBox='0 0 ${brushSize + 2} ${brushSize + 2}'><circle cx='${(brushSize + 2) / 2}' cy='${(brushSize + 2) / 2}' r='${brushSize / 2}' fill='none' stroke='black' stroke-width='1'/></svg>") ${Math.round(((brushSize + 2) / 2) * zoomLevel)} ${Math.round(((brushSize + 2) / 2) * zoomLevel)}, crosshair`
                      : drawingTool === 'box' ? 'copy' : drawingTool === 'line' ? 'crosshair' : 'default',
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center'
                  }}
                >
                  {renderDrawingLayers()}
                </div>
                
                {/* Tool indicator */}
                <div className="absolute top-2 right-2 bg-gray-800/80 text-white px-2 py-1 rounded text-xs">
                  {drawingTool === 'brush' ? `🖌️ Brush ${brushSize}px` :
                   drawingTool === 'eraser' ? `🧽 Eraser ${brushSize}px` :
                   drawingTool === 'box' ? `⬜ Box ${boxWidth}×${boxHeight}px` :
                   drawingTool === 'line' ? `📏 Line ${lineWidth}px` :
                   '✏️ Drawing'}
                </div>
              </div>
            </div>

            {/* Editor Controls Side */}
            <div className="w-80 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-lg">Edit Logo</h3>
                <button
                  onClick={() => setShowFullscreenEditor(false)}
                  className="text-white/60 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Drawing Tools Section */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Drawing Tools</h4>
                  
                  {/* Tool Selection */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() => setDrawingTool('brush')}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                        drawingTool === 'brush' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <Brush size={16} />
                      Brush
                    </button>
                    <button
                      onClick={() => setDrawingTool('eraser')}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                        drawingTool === 'eraser' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <Eraser size={16} />
                      Eraser
                    </button>
                    <button
                      onClick={() => setDrawingTool('box')}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                        drawingTool === 'box' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <Square size={16} />
                      Box
                    </button>
                    <button
                      onClick={() => setDrawingTool('line')}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                        drawingTool === 'line' ? 'bg-orange-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      📏 Line
                    </button>
                    <button
                      onClick={() => setShowFillPopup(true)}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors bg-yellow-600 text-white hover:bg-yellow-700"
                    >
                      🎨 Fill
                    </button>
                  </div>

                  {/* Tool Settings */}
                  <div className="space-y-3">
                    {/* Brush and Eraser Color Settings */}
                    {(drawingTool === 'brush' || drawingTool === 'eraser') && (
                      <div>
                        <label className="block text-white/80 text-sm mb-1">
                          {drawingTool === 'brush' ? 'Brush Color' : 'Eraser Color'}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={brushColor}
                            onChange={(e) => setBrushColor(e.target.value)}
                            className="w-10 h-8 rounded border border-white/20 cursor-pointer"
                          />
                          <span className="text-white/60 text-sm">{brushColor}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Box Color Settings */}
                    {drawingTool === 'box' && (
                      <>
                        <div>
                          <label className="block text-white/80 text-sm mb-1">Box Stroke Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={boxStrokeColor}
                              onChange={(e) => setBoxStrokeColor(e.target.value)}
                              className="w-10 h-8 rounded border border-white/20 cursor-pointer"
                            />
                            <span className="text-white/60 text-sm">{boxStrokeColor}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-1">Box Fill Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={boxFillColor}
                              onChange={(e) => setBoxFillColor(e.target.value)}
                              className="w-10 h-8 rounded border border-white/20 cursor-pointer"
                            />
                            <span className="text-white/60 text-sm">{boxFillColor}</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Line Tool Color and Width Settings */}
                    {drawingTool === 'line' && (
                      <>
                        <div>
                          <label className="block text-white/80 text-sm mb-1">Line Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={lineColor}
                              onChange={(e) => setLineColor(e.target.value)}
                              className="w-10 h-8 rounded border border-white/20 cursor-pointer"
                            />
                            <span className="text-white/60 text-sm">{lineColor}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-1">Line Width: {lineWidth}px</label>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(parseInt(e.target.value))}
                            className="w-full slider"
                          />
                        </div>
                      </>
                    )}
                    
                    {/* Zoom Controls */}
                    <div className="border-t border-white/20 pt-3">
                      <label className="block text-white/80 text-sm mb-1">Zoom: {Math.round(zoomLevel * 100)}%</label>
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => setZoomLevel(Math.max(0.25, zoomLevel - 0.25))}
                          className="px-3 py-1 bg-white/10 text-white/80 rounded text-xs hover:bg-white/20 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min="0.25"
                          max="3"
                          step="0.25"
                          value={zoomLevel}
                          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                          className="flex-1 slider"
                        />
                        <button
                          onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                          className="px-3 py-1 bg-white/10 text-white/80 rounded text-xs hover:bg-white/20 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => setZoomLevel(1)}
                        className="w-full px-3 py-1 bg-white/10 text-white/80 rounded text-xs hover:bg-white/20 transition-colors"
                      >
                        Reset Zoom
                      </button>
                    </div>
                    
                    {/* Box Controls */}
                    {selectedBox && (
                      <div className="border-t border-white/20 pt-3">
                        <label className="block text-white/80 text-sm mb-3">Box Controls</label>
                        
                        <div className="space-y-2">
                          <label className="block text-white/60 text-xs mb-1">Rotate Selected Box</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => rotateSelectedBox(-15)}
                              className="px-3 py-1 bg-white/10 text-white/80 rounded text-xs hover:bg-white/20 transition-colors"
                            >
                              ↺ -15°
                            </button>
                            <button
                              onClick={() => rotateSelectedBox(15)}
                              className="px-3 py-1 bg-white/10 text-white/80 rounded text-xs hover:bg-white/20 transition-colors"
                            >
                              ↻ +15°
                            </button>
                            <button
                              onClick={() => setSelectedBox(null)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                            >
                              Deselect
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Brush/Eraser Size: {brushSize}px</label>
                      <input
                        type="range"
                        min="2"
                        max="50"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-full slider"
                      />
                    </div>

                    {drawingTool === 'box' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-white/80 text-sm mb-1">Box Width</label>
                          <input
                            type="number"
                            min="10"
                            max="200"
                            value={boxWidth}
                            onChange={(e) => setBoxWidth(parseInt(e.target.value) || 50)}
                            className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm mb-1">Box Height</label>
                          <input
                            type="number"
                            min="10"
                            max="200"
                            value={boxHeight}
                            onChange={(e) => setBoxHeight(parseInt(e.target.value) || 50)}
                            className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Drawing Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={undoLastStroke}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors flex-1"
                      >
                        <RotateCcw size={14} />
                        Undo
                      </button>
                      <button
                        onClick={clearDrawing}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors flex-1"
                      >
                        <X size={14} />
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Text Section */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Text</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={localConfig.text}
                        onChange={(e) => updateLocalConfig({ text: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                        placeholder="Enter brand name"
                      />
                      <div className="mt-2">
                        <label className="block text-white/60 text-xs mb-1">Brand Name Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={brandNameColor}
                            onChange={(e) => {
                              setBrandNameColor(e.target.value);
                              updateLocalConfig({ brandNameColor: e.target.value });
                            }}
                            className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                          />
                          <span className="text-white/50 text-xs">{brandNameColor}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Slogan</label>
                      <input
                        type="text"
                        value={localConfig.slogan}
                        onChange={(e) => updateLocalConfig({ slogan: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                        placeholder="Enter slogan"
                      />
                      <div className="mt-2">
                        <label className="block text-white/60 text-xs mb-1">Slogan Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={sloganColor}
                            onChange={(e) => {
                              setSloganColor(e.target.value);
                              updateLocalConfig({ sloganColor: e.target.value });
                            }}
                            className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                          />
                          <span className="text-white/50 text-xs">{sloganColor}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Font Weight</label>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          {[300, 400, 500, 600, 700, 800].map(weight => (
                            <button
                              key={weight}
                              onClick={() => {
                                console.log('Setting fontWeight to:', weight);
                                updateLocalConfig({ fontWeight: weight });
                              }}
                              className={`px-3 py-2 rounded border text-xs transition-colors ${
                                (localConfig.fontWeight || 400) === weight 
                                  ? 'border-blue-500 bg-blue-500/20 text-white' 
                                  : 'border-white/20 hover:border-white/40 text-white/80'
                              }`}
                            >
                              {weight === 300 ? 'Light' : 
                               weight === 400 ? 'Regular' :
                               weight === 500 ? 'Medium' :
                               weight === 600 ? 'SemiBold' :
                               weight === 700 ? 'Bold' : 'ExtraBold'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Icon Section */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Icon</h4>
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    <button
                      onClick={() => updateLocalConfig({ icon: null })}
                      className={`p-2 rounded border transition-colors ${
                        !localConfig.icon ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <span className="text-white/60 text-xs">None</span>
                    </button>
                    {availableIcons.slice(0, 17).map(icon => (
                      <button
                        key={icon.id}
                        onClick={() => updateLocalConfig({ icon })}
                        className={`p-2 rounded border transition-colors ${
                          localConfig.icon?.id === icon.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <icon.component size={20} color="white" className="mx-auto" />
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Icon Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={iconColor}
                        onChange={(e) => {
                          setIconColor(e.target.value);
                          updateLocalConfig({ iconColor: e.target.value });
                        }}
                        className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                      />
                      <span className="text-white/50 text-xs">{iconColor}</span>
                    </div>
                  </div>
                </div>

                {/* Colors Section */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Colors</h4>
                  
                  {/* Color Palettes */}
                  <div className="mb-4">
                    <h5 className="text-white/80 text-sm mb-2">Predefined Palettes</h5>
                    <div className="grid grid-cols-3 gap-2">
                      {availablePalettes.slice(0, 12).map(palette => (
                        <button
                          key={palette.id}
                          onClick={() => updateLocalConfig({ palette })}
                          className={`p-2 rounded border transition-colors ${
                            localConfig.palette?.id === palette.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          <div className="flex gap-1 h-4 mb-1">
                            {palette.colors.map((color, i) => (
                              <div key={i} className="flex-1 rounded-sm" style={{ backgroundColor: color }}></div>
                            ))}
                          </div>
                          <span className="text-white/80 text-xs truncate block">{palette.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-8 pt-6 border-t border-white/20">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handlePurchase}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-2 sm:p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/20">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Choose Your Package</h2>
                  <p className="text-white/70 mt-1">Get your logo in the format you need</p>
                </div>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="text-white/60 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Flip Cards */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                
                {/* Basic Package - Flip Card */}
                <div 
                  className="relative w-full h-96 cursor-pointer group overflow-hidden"
                  onClick={() => toggleCardFlip('basic')}
                >
                  <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                    flippedCards['basic'] ? 'rotate-y-180' : ''
                  }`}>
                    
                    {/* Front Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden border-2 border-white/20 rounded-lg p-4 sm:p-6 hover:border-blue-400 transition-colors bg-white/5 flex flex-col">
                      <div className="text-center flex-grow">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Download className="text-blue-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
                        <div className="text-3xl font-bold text-white mb-1">$29</div>
                        <p className="text-white/70 text-sm mb-6">Perfect for getting started</p>
                        
                        <ul className="text-left space-y-3 mb-6">
                          <li className="flex items-center text-sm text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={16} />
                            High-resolution PNG (3000x3000px)
                          </li>
                          <li className="flex items-center text-sm text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={16} />
                            Transparent background version
                          </li>
                          <li className="flex items-center text-sm text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={16} />
                            RGB color format
                          </li>
                          <li className="flex items-center text-sm text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={16} />
                            Personal use license
                          </li>
                        </ul>
                      </div>
                      
                      <div className="mt-auto pt-4 text-center">
                        <p className="text-xs text-white/50 mb-2">Click to see more details</p>
                      </div>
                    </div>
                    
                    {/* Back Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 border-2 border-blue-400 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/30 flex flex-col">
                      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Star className="text-white" size={24} />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">Why Choose Basic?</h3>
                          
                          <div className="space-y-4">
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <Users className="text-blue-400 mr-2" size={16} />
                                <h4 className="font-semibold text-white text-sm">Perfect For</h4>
                              </div>
                              <p className="text-xs text-white/80">Startups, personal projects, small businesses just getting started</p>
                            </div>
                            
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <TrendingUp className="text-blue-400 mr-2" size={16} />
                                <h4 className="font-semibold text-white text-sm">Key Benefit</h4>
                              </div>
                              <p className="text-xs text-white/80">High-quality logo files ready for digital use at an affordable price</p>
                            </div>
                            
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <Globe className="text-blue-400 mr-2" size={16} />
                                <h4 className="font-semibold text-white text-sm">Use Cases</h4>
                              </div>
                              <p className="text-xs text-white/80">Websites, social media, digital marketing, email signatures</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sticky bottom-0 bg-gradient-to-t from-blue-600/30 to-transparent p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchaseOption('basic');
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                        >
                          Get Basic Package
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Package - Flip Card - Most Popular */}
                <div 
                  className="relative w-full h-96 cursor-pointer group overflow-hidden"
                  onClick={() => toggleCardFlip('professional')}
                >
                  <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                    flippedCards['professional'] ? 'rotate-y-180' : ''
                  }`}>
                    
                    {/* Front Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden border-2 border-blue-500 rounded-lg p-4 sm:p-6 relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex flex-col">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium">Most Popular</span>
                      </div>
                      <div className="text-center flex-grow">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Zap className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
                        <div className="text-3xl font-bold text-white mb-1">$59</div>
                        <p className="text-white/70 text-sm mb-6">Everything you need for business</p>
                        
                        <ul className="text-left space-y-2 mb-6 text-sm">
                          <li className="flex items-center text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                            Everything in Basic
                          </li>
                          <li className="flex items-center text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                            Vector SVG file (infinitely scalable)
                          </li>
                          <li className="flex items-center text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                            CMYK version for printing
                          </li>
                          <li className="flex items-center text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                            Commercial use license
                          </li>
                        </ul>
                      </div>
                      
                      <div className="mt-auto pt-4 text-center">
                        <p className="text-xs text-white/50 mb-2">Click to see more details</p>
                      </div>
                    </div>
                    
                    {/* Back Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 border-2 border-purple-500 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-600/30 flex flex-col">
                      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Award className="text-white" size={24} />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">Professional Excellence</h3>
                          
                          <div className="space-y-3">
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <Briefcase className="text-purple-400 mr-2" size={16} />
                                <h4 className="font-semibold text-white text-sm">Perfect For</h4>
                              </div>
                              <p className="text-xs text-white/80">Growing businesses, agencies, professional services, e-commerce</p>
                            </div>
                            
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <Star className="text-purple-400 mr-2" size={16} />
                                <h4 className="font-semibold text-white text-sm">Key Benefit</h4>
                              </div>
                              <p className="text-xs text-white/80">Complete logo package with vector files for unlimited scaling and professional printing</p>
                            </div>
                            
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <Globe className="text-purple-400 mr-2" size={16} />
                                <h4 className="font-semibold text-white text-sm">Bonus</h4>
                              </div>
                              <p className="text-xs text-white/80">Social media kit included - optimized sizes for all platforms</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sticky bottom-0 bg-gradient-to-t from-purple-600/30 to-transparent p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchaseOption('professional');
                          }}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                        >
                          Get Professional Package
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Package - Flip Card */}
                <div 
                  className="relative w-full h-96 cursor-pointer group overflow-hidden"
                  onClick={() => toggleCardFlip('premium')}
                >
                  <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                    flippedCards['premium'] ? 'rotate-y-180' : ''
                  }`}>
                    
                    {/* Front Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden border-2 border-white/20 rounded-lg p-4 sm:p-6 hover:border-purple-400 transition-colors bg-white/5 flex flex-col">
                      <div className="text-center flex-grow">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Crown className="text-purple-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
                        <div className="text-3xl font-bold text-white mb-1">$99</div>
                        <p className="text-white/70 text-sm mb-6">Complete branding solution</p>
                        
                        <ul className="text-left space-y-2 mb-6 text-sm">
                          <li className="flex items-center text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                            Everything in Professional
                          </li>
                          <li className="flex items-center text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                            Adobe Illustrator AI file
                          </li>
                          <li className="flex items-center text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                            Brand guidelines PDF
                          </li>
                          <li className="flex items-center text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                            Business card templates
                          </li>
                          <li className="flex items-center text-white/80">
                            <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                            Extended commercial license
                          </li>
                        </ul>
                      </div>
                      
                      <div className="mt-auto pt-4 text-center">
                        <p className="text-xs text-white/50 mb-2">Click to see more details</p>
                      </div>
                    </div>
                    
                    {/* Back Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 border-2 border-purple-400 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-800/30 flex flex-col">
                      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Crown className="text-white" size={24} />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">Premium Excellence</h3>
                          
                          <div className="space-y-3">
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <Crown className="text-purple-400 mr-2" size={16} />
                                <h4 className="font-semibold text-white text-sm">Perfect For</h4>
                              </div>
                              <p className="text-xs text-white/80">Established businesses, corporations, luxury brands, complete rebrand</p>
                            </div>
                            
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <Award className="text-purple-400 mr-2" size={16} />
                                <h4 className="font-semibold text-white text-sm">Key Benefit</h4>
                              </div>
                              <p className="text-xs text-white/80">Complete brand identity system with professional guidelines and templates</p>
                            </div>
                            
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <Briefcase className="text-purple-400 mr-2" size={16} />
                                <h4 className="font-semibold text-white text-sm">Exclusive</h4>
                              </div>
                              <p className="text-xs text-white/80">Business card designs, letterhead templates, and comprehensive brand guide</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sticky bottom-0 bg-gradient-to-t from-purple-800/30 to-transparent p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchaseOption('premium');
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                        >
                          Get Premium Package
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm text-white/70">
                  <div className="flex items-center">
                    <Check className="text-green-400 mr-2" size={16} />
                    Instant download
                  </div>
                  <div className="flex items-center">
                    <Check className="text-green-400 mr-2" size={16} />
                    Money-back guarantee
                  </div>
                  <div className="flex items-center">
                    <Check className="text-green-400 mr-2" size={16} />
                    Secure payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-2 sm:p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Save Your Logo</h2>
                  <p className="text-white/70 mt-1">Choose how you want to save your logo</p>
                </div>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-white/60 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Save Options */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Save to Profile */}
                <div className="border-2 border-white/20 rounded-lg p-4 hover:border-blue-400 transition-colors bg-white/5 flex flex-col h-full">
                  <div className="text-center flex-grow">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <User className="text-blue-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Save to Profile</h3>
                    <p className="text-white/70 text-sm mb-4">Save to your account for easy access later</p>
                    
                    <ul className="text-left space-y-2 mb-4">
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Access from any device
                      </li>
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Edit anytime
                      </li>
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Share with team
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => handleSaveOption('profile')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                    >
                      Save to Profile
                    </button>
                  </div>
                </div>

                {/* Download SVG */}
                <div className="border-2 border-white/20 rounded-lg p-4 hover:border-purple-400 transition-colors bg-white/5 flex flex-col h-full">
                  <div className="text-center flex-grow">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Download className="text-purple-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Download SVG</h3>
                    <p className="text-white/70 text-sm mb-4">Vector format, perfect for scaling</p>
                    
                    <ul className="text-left space-y-2 mb-4">
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Infinitely scalable
                      </li>
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Small file size
                      </li>
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Web optimized
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => handleSaveOption('svg')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                    >
                      Download SVG
                    </button>
                  </div>
                </div>

                {/* Download PNG */}
                <div className="border-2 border-white/20 rounded-lg p-4 hover:border-green-400 transition-colors bg-white/5 flex flex-col h-full">
                  <div className="text-center flex-grow">
                    <div className="w-16 h-16 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileImage className="text-green-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Download PNG</h3>
                    <p className="text-white/70 text-sm mb-4">High-resolution raster format</p>
                    
                    <ul className="text-left space-y-2 mb-4">
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        3000x3000px resolution
                      </li>
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Transparent background
                      </li>
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Print ready
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => handleSaveOption('png')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                    >
                      Download PNG
                    </button>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex justify-center items-center text-sm text-white/70">
                  <div className="flex items-center">
                    <Check className="text-green-400 mr-2" size={16} />
                    Free downloads • No watermark • Commercial use allowed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fill Color Popup */}
      {showFillPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl border border-white/20 p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold text-lg">Fill Color</h3>
              <button
                onClick={() => setShowFillPopup(false)}
                className="text-white/60 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Select Fill Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="w-16 h-16 rounded-lg border-2 border-white/20 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-white/60 text-sm block">{fillColor.toUpperCase()}</span>
                    <p className="text-white/50 text-xs mt-1">Click on a box to fill it with this color</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowFillPopup(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Keep popup open, user will click on boxes to fill them
                    // Popup will close automatically when a box is clicked
                  }}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  Ready to Fill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Fabric.js Editor */}
      {showAdvancedEditor && (
        <>
          {console.log('🚀 Rendering AdvancedFabricLogoEditor with config:', localConfig)}
          <AdvancedFabricLogoEditor
            config={localConfig}
            onConfigUpdate={updateLocalConfig}
            onClose={() => setShowAdvancedEditor(false)}
          />
        </>
      )}
    </>
  );
};

export default LogoEditor;