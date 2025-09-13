import { useState, useEffect, useRef, useMemo } from 'react';
import { LogoConfig, IconData, PaletteData } from '@/lib/types';
import { Edit, Save, ShoppingCart, Download, Check, X, Crown, Zap, User, FileImage, Star, Award, Globe, Briefcase, TrendingUp, Users, Brush, Square, Eraser, RotateCcw, Pipette, Move } from 'lucide-react';
import { fontCategories } from '@/lib/data';

interface LogoEditorProps {
  config: LogoConfig;
  onConfigUpdate: (newConfig: Partial<LogoConfig>) => void;
  availableIcons: IconData[];
  availablePalettes: PaletteData[];
  variation?: {
    id: string;
    name: string;
    brandNameColor: string;
    iconColor: string;
    backgroundColor: string;
    sloganColor: string;
    hasGradient: boolean;
  };
}

// Types for drawing tools
interface Point {
  x: number;
  y: number;
}

interface Stroke {
  id: string;
  tool: 'brush' | 'eraser' | 'box' | 'line' | 'eyedropper';
  points: Point[];
  color: string;
  width: number;
  opacity: number; // 0-1 scale for SVG opacity
  lineCap?: 'round' | 'square'; // For line tool
  rect?: { x: number; y: number; width: number; height: number };
  rotation?: number; // Preserve rotation for placed boxes
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
  opacity: number; // 0-1 scale for box opacity
  permanent: boolean; // If true, box cannot be modified
}

interface EditLayer {
  id: string;
  name: string;
  visible: boolean;
  strokes: Stroke[];
}

// New interfaces for moveable logo elements
interface TextElement {
  id: string;
  type: 'brand' | 'slogan';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  selected: boolean;
  permanent: boolean; // If true, element cannot be moved
  rotation: number; // Rotation in degrees
  textAlign: 'left' | 'center' | 'right';
  opacity: number; // 0-1 opacity value
}

interface IconElement {
  id: string;
  type: 'icon';
  icon: any; // Lucide icon component
  x: number;
  y: number;
  size: number;
  color: string;
  selected: boolean;
  permanent: boolean; // If true, element cannot be moved
  rotation: number; // Rotation in degrees
  opacity: number; // 0-1 opacity value
}

const LogoEditor = ({ config, onConfigUpdate, availableIcons, availablePalettes, variation }: LogoEditorProps) => {
  const [showFullscreenEditor, setShowFullscreenEditor] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});
  const [localConfig, setLocalConfig] = useState<LogoConfig>(config);
  
  // Drawing tool states
  const [drawingTool, setDrawingTool] = useState<'brush' | 'eraser' | 'box' | 'line' | 'eyedropper' | 'move'>('brush');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(10); // 1-10 scale, 10 = 100% opacity
  const [brushLineCap, setBrushLineCap] = useState<'round' | 'square'>('round'); // Line cap for brush
  const [eraserOpacity, setEraserOpacity] = useState(10); // 1-10 scale, 10 = 100% opacity
  const [eraserMode, setEraserMode] = useState<'brush' | 'line'>('brush'); // Eraser mode: brush or line
  const [boxOpacity, setBoxOpacity] = useState(5); // 1-10 scale, 5 = 50% opacity (was 10)
  const [boxStrokeColor, setBoxStrokeColor] = useState('#000000');
  const [boxFillColor, setBoxFillColor] = useState('#000000'); // Changed from red to black
  const [iconColor, setIconColor] = useState(config.palette?.colors[1] || '#000000');
  const [brandNameColor, setBrandNameColor] = useState(config.palette?.colors[1] || '#000000');
  const [sloganColor, setSloganColor] = useState(config.palette?.colors[1] || '#000000');
  const [sampledColor, setSampledColor] = useState<string | null>(null);

  // Logo elements that can be moved like boxes
  const [logoElements, setLogoElements] = useState<{
    brand?: TextElement;
    slogan?: TextElement;
    icon?: IconElement;
  }>({});
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isMovingElement, setIsMovingElement] = useState(false);
  const [movingElement, setMovingElement] = useState<string | null>(null);
  const [elementMoveStart, setElementMoveStart] = useState<{
    startX: number;
    startY: number;
    originalElement: TextElement | IconElement;
  } | null>(null);
  const [currentFontWeight, setCurrentFontWeight] = useState(config.fontWeight || 400);
  const [fontWeightUpdateKey, setFontWeightUpdateKey] = useState(0);
  const [forceRender, setForceRender] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  
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


  
  // Line tool state
  const [lineColor, setLineColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [lineCap, setLineCap] = useState<'round' | 'square'>('round');
  const [currentLine, setCurrentLine] = useState<{ start: Point; end: Point } | null>(null);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [editLayers, setEditLayers] = useState<EditLayer[]>([
    { id: 'layer-1', name: 'Drawing Layer', visible: true, strokes: [] }
  ]);
  
  // Canvas refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drawingRef = useRef({ drawing: false, startPoint: null as Point | null });
  
  // Sync local config with props (but preserve user-selected font, fontWeight, and colors)
  useEffect(() => {
    setLocalConfig(prev => ({
      ...config,
      font: prev?.font || config.font, // Preserve selected font
      fontWeight: prev?.fontWeight || config.fontWeight // Preserve selected font weight
    }));

    // Only update colors if they haven't been set by user yet (initial load)
    // This prevents color picker reset on every config change
    if (iconColor === '#000000' && brandNameColor === '#000000' && sloganColor === '#000000') {
      if (variation) {
        setIconColor(variation.iconColor);
        setBrandNameColor(variation.brandNameColor);
        setSloganColor(variation.sloganColor);
      } else if (config.palette?.colors) {
        setIconColor(config.palette.colors[1] || config.palette.colors[0] || '#000000');
        setBrandNameColor(config.palette.colors[0] || '#000000');
        setSloganColor(config.palette.colors[1] || config.palette.colors[0] || '#000000');
      }
    }
  }, [config, variation]);

  // Sync current font weight with localConfig
  useEffect(() => {
    if (localConfig.fontWeight !== currentFontWeight) {
      console.log('FontWeight sync: localConfig.fontWeight=', localConfig.fontWeight, 'currentFontWeight=', currentFontWeight);
      setCurrentFontWeight(localConfig.fontWeight || 400);
    }
  }, [localConfig.fontWeight]);

  // Reset font weight when font changes to ensure valid weight
  useEffect(() => {
    if (localConfig.font?.editorWeights && localConfig.font.editorWeights.length > 0) {
      // If current weight is not available in new font, use first available weight
      if (!localConfig.font.editorWeights.includes(currentFontWeight)) {
        const newWeight = localConfig.font.editorWeights[0];
        setCurrentFontWeight(newWeight);
        setLocalConfig(prev => ({ ...prev, fontWeight: newWeight }));
        onConfigUpdate({ fontWeight: newWeight });
      }
    }
  }, [localConfig.font?.name]);

  // Initialize logo elements based on current config
  useEffect(() => {
    const canvasWidth = 400;
    const canvasHeight = 300;

    const newElements: {
      brand?: TextElement;
      slogan?: TextElement;
      icon?: IconElement;
    } = {};

    // Initialize brand name element
    if (localConfig.text) {
      newElements.brand = {
        id: 'brand-text',
        type: 'brand',
        text: localConfig.text,
        x: canvasWidth / 2,
        y: canvasHeight / 2 - 20,
        fontSize: 24,
        fontFamily: localConfig.font?.cssName || 'Inter, sans-serif',
        fontWeight: currentFontWeight,
        color: brandNameColor,
        selected: false,
        permanent: false,
        rotation: 0,
        textAlign: 'center',
        opacity: 1.0,
      };
    }

    // Initialize slogan element
    if (localConfig.slogan) {
      newElements.slogan = {
        id: 'slogan-text',
        type: 'slogan',
        text: localConfig.slogan,
        x: canvasWidth / 2,
        y: canvasHeight / 2 + 20,
        fontSize: 14,
        fontFamily: localConfig.font?.cssName || 'Inter, sans-serif',
        fontWeight: 300,
        color: sloganColor,
        selected: false,
        permanent: false,
        rotation: 0,
        textAlign: 'center',
        opacity: 1.0,
      };
    }

    // Initialize icon element
    if (localConfig.icon) {
      newElements.icon = {
        id: 'icon-element',
        type: 'icon',
        icon: localConfig.icon.component,
        x: canvasWidth / 2,
        y: canvasHeight / 2 - 60,
        size: 48,
        color: iconColor,
        selected: false,
        permanent: false,
        rotation: 0,
        opacity: 1.0,
      };
    }

    setLogoElements(newElements);
  }, [localConfig.text, localConfig.slogan, localConfig.icon, localConfig.font?.cssName, currentFontWeight, brandNameColor, sloganColor, iconColor]);

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

      // Handle moving logo elements
      if (isMovingElement && movingElement && elementMoveStart) {
        const deltaX = point.x - elementMoveStart.startX;
        const deltaY = point.y - elementMoveStart.startY;
        const originalElement = elementMoveStart.originalElement;

        const newElement = {
          ...originalElement,
          x: originalElement.x + deltaX,
          y: originalElement.y + deltaY
        };

        setLogoElements(prev => ({
          ...prev,
          [movingElement]: newElement
        }));
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
      if (isMovingElement) {
        setIsMovingElement(false);
        setMovingElement(null);
        setElementMoveStart(null);
      }
    };

    if (isRotating || isResizing || isMoving || isMovingElement) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isRotating, rotatingBox, rotationStart, isResizing, resizingBox, resizeHandle, resizeStart, isMoving, movingBox, moveStart, isMovingElement, movingElement, elementMoveStart]);
  
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

  // Convert logo element to canvas strokes - improved version
  const convertElementToStrokes = (element: TextElement | IconElement): Stroke[] => {
    const strokes: Stroke[] = [];

    if (element.type === 'brand' || element.type === 'slogan') {
      const textElement = element as TextElement;
      // Create a more detailed text representation using multiple techniques
      const textWidth = textElement.text.length * (textElement.fontSize * 0.6);
      const textHeight = textElement.fontSize;

      // Create text outline instead of filled text to avoid background coloring
      const strokeWidth = Math.max(2, textElement.fontSize / 8);

      // Create text outline by drawing the border
      const outlinePoints = [
        // Top line
        { x: textElement.x - textWidth/2, y: textElement.y - textHeight/2 },
        { x: textElement.x + textWidth/2, y: textElement.y - textHeight/2 },
        // Right line
        { x: textElement.x + textWidth/2, y: textElement.y - textHeight/2 },
        { x: textElement.x + textWidth/2, y: textElement.y + textHeight/2 },
        // Bottom line
        { x: textElement.x + textWidth/2, y: textElement.y + textHeight/2 },
        { x: textElement.x - textWidth/2, y: textElement.y + textHeight/2 },
        // Left line
        { x: textElement.x - textWidth/2, y: textElement.y + textHeight/2 },
        { x: textElement.x - textWidth/2, y: textElement.y - textHeight/2 }
      ];

      // Create outline strokes
      for (let i = 0; i < outlinePoints.length; i += 2) {
        if (i + 1 < outlinePoints.length) {
          strokes.push({
            id: `text-outline-${textElement.id}-${i/2}`,
            tool: 'brush',
            points: [outlinePoints[i], outlinePoints[i + 1]],
            color: textElement.color,
            width: strokeWidth,
            opacity: 1,
            lineCap: 'round'
          });
        }
      }

      // Add a few internal strokes to suggest text, but not fill completely
      const internalStrokes = 3;
      for (let i = 0; i < internalStrokes; i++) {
        const y = textElement.y - textHeight/4 + (i * textHeight/6);
        strokes.push({
          id: `text-internal-${textElement.id}-${i}`,
          tool: 'brush',
          points: [
            { x: textElement.x - textWidth/3, y },
            { x: textElement.x + textWidth/3, y }
          ],
          color: textElement.color,
          width: strokeWidth * 0.7,
          opacity: 0.8,
          lineCap: 'round'
        });
      }
    } else if (element.type === 'icon') {
      const iconElement = element as IconElement;
      // Create icon outline instead of filled to avoid background coloring
      const radius = iconElement.size / 2;
      const strokeWidth = Math.max(2, radius / 8);

      // Create circle outline only
      const circlePoints: Point[] = [];
      const pointCount = Math.max(16, Math.ceil(radius * 0.5));

      for (let i = 0; i < pointCount; i++) {
        const angle = (2 * Math.PI * i) / pointCount;
        const x = iconElement.x + radius * Math.cos(angle);
        const y = iconElement.y + radius * Math.sin(angle);
        circlePoints.push({ x, y });
      }
      circlePoints.push(circlePoints[0]); // Close the circle

      strokes.push({
        id: `icon-outline-${iconElement.id}`,
        tool: 'brush',
        points: circlePoints,
        color: iconElement.color,
        width: strokeWidth,
        opacity: 1,
        lineCap: 'round'
      });

      // Add some internal detail lines to suggest an icon without filling
      const detailLines = 4;
      for (let i = 0; i < detailLines; i++) {
        const angle = (Math.PI * 2 * i) / detailLines;
        const innerRadius = radius * 0.2;
        const outerRadius = radius * 0.8;

        strokes.push({
          id: `icon-detail-${iconElement.id}-${i}`,
          tool: 'brush',
          points: [
            {
              x: iconElement.x + innerRadius * Math.cos(angle),
              y: iconElement.y + innerRadius * Math.sin(angle)
            },
            {
              x: iconElement.x + outerRadius * Math.cos(angle),
              y: iconElement.y + outerRadius * Math.sin(angle)
            }
          ],
          color: iconElement.color,
          width: strokeWidth * 0.8,
          opacity: 0.9,
          lineCap: 'round'
        });
      }

      // Add center dot
      strokes.push({
        id: `icon-center-${iconElement.id}`,
        tool: 'brush',
        points: [
          { x: iconElement.x, y: iconElement.y },
          { x: iconElement.x + 0.1, y: iconElement.y }
        ],
        color: iconElement.color,
        width: strokeWidth,
        opacity: 1,
        lineCap: 'round'
      });
    }

    return strokes;
  };

  const sampleColor = async (point: Point, e: React.MouseEvent) => {
    console.log('🎨 Pipette sampling at point:', point);

    let sampledColor: string | null = null;

    // METHOD 1: Try pixel sampling from canvas if possible
    try {
      const canvasElement = canvasRef.current;
      if (canvasElement) {
        // Create a temporary canvas to capture the rendered content
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');

        if (ctx) {
          // Set canvas size to match the preview area
          tempCanvas.width = canvasElement.offsetWidth;
          tempCanvas.height = canvasElement.offsetHeight;

          // Try to draw the current view to canvas (this might not work due to CORS)
          try {
            // Alternative approach: use html2canvas-like functionality
            const rect = canvasElement.getBoundingClientRect();

            // For now, let's use a different approach - check elements at the coordinates
            const elementsAtPoint = document.elementsFromPoint(
              rect.left + point.x,
              rect.top + point.y
            );

            console.log('📍 Elements at click point:', elementsAtPoint);

            // Iterate through elements to find colors
            for (const element of elementsAtPoint) {
              console.log('🔍 Checking element:', element.tagName, element.className);

              // Check SVG elements first (drawn elements)
              if (element.tagName === 'rect') {
                const fill = element.getAttribute('fill');
                const stroke = element.getAttribute('stroke');
                if (fill && fill !== 'none') {
                  sampledColor = fill;
                  console.log('📦 Found rect fill:', sampledColor);
                  break;
                } else if (stroke && stroke !== 'none') {
                  sampledColor = stroke;
                  console.log('📦 Found rect stroke:', sampledColor);
                  break;
                }
              } else if (element.tagName === 'path') {
                const fill = element.getAttribute('fill');
                const stroke = element.getAttribute('stroke');
                if (fill && fill !== 'none' && fill !== 'currentColor') {
                  sampledColor = fill;
                  console.log('🖌️ Found path fill:', sampledColor);
                  break;
                } else if (stroke && stroke !== 'none') {
                  sampledColor = stroke;
                  console.log('🖌️ Found path stroke:', sampledColor);
                  break;
                }
              } else if (element.tagName === 'line') {
                const stroke = element.getAttribute('stroke');
                if (stroke && stroke !== 'none') {
                  sampledColor = stroke;
                  console.log('📏 Found line stroke:', sampledColor);
                  break;
                }
              }

              // Check for text elements
              const computedStyle = window.getComputedStyle(element);
              if (element.textContent && element.textContent.trim()) {
                if (computedStyle.color && computedStyle.color !== 'rgba(0, 0, 0, 0)') {
                  sampledColor = computedStyle.color;
                  console.log('📝 Found text color:', sampledColor, 'from element:', element.textContent.substring(0, 20));
                  break;
                }
              }

              // Check for background colors
              if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && computedStyle.backgroundColor !== 'transparent') {
                sampledColor = computedStyle.backgroundColor;
                console.log('🎨 Found background color:', sampledColor);
                break;
              }
            }
          } catch (canvasError) {
            console.log('⚠️ Canvas sampling failed:', canvasError);
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Pixel sampling failed:', error);
    }

    // METHOD 2: Fallback to state-based detection
    if (!sampledColor) {
      console.log('🔄 Using state-based fallback detection');

      // Check drawn boxes from state
      const clickedBox = boxes.find(box =>
        point.x >= box.x &&
        point.x <= box.x + box.width &&
        point.y >= box.y &&
        point.y <= box.y + box.height
      );
      if (clickedBox) {
        sampledColor = clickedBox.fillColor || clickedBox.strokeColor;
        console.log('📦 Found state box color:', sampledColor);
      }

      // Check drawn strokes from state
      if (!sampledColor) {
        for (const layer of editLayers) {
          if (!layer.visible) continue;
          for (const stroke of layer.strokes) {
            if (stroke.tool === 'box' && stroke.rect) {
              if (point.x >= stroke.rect.x && point.x <= stroke.rect.x + stroke.rect.width &&
                  point.y >= stroke.rect.y && point.y <= stroke.rect.y + stroke.rect.height) {
                sampledColor = stroke.color;
                console.log('🎨 Found stroke box color:', sampledColor);
                break;
              }
            } else if (stroke.tool === 'brush' || stroke.tool === 'line') {
              // Simple proximity check for strokes
              for (const strokePoint of stroke.points) {
                const distance = Math.sqrt(Math.pow(point.x - strokePoint.x, 2) + Math.pow(point.y - strokePoint.y, 2));
                if (distance <= (stroke.width / 2 + 5)) { // Add some tolerance
                  sampledColor = stroke.color;
                  console.log('🖌️ Found stroke color:', sampledColor);
                  break;
                }
              }
              if (sampledColor) break;
            }
          }
          if (sampledColor) break;
        }
      }

      // Use current logo colors as fallback
      if (!sampledColor) {
        sampledColor = brandNameColor; // Default fallback
        console.log('🏷️ Using brand name color as final fallback:', sampledColor);
      }
    }

    // Convert rgb/rgba to hex if needed
    if (sampledColor?.startsWith('rgb')) {
      const rgbMatch = sampledColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        sampledColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        console.log('🔄 Converted to hex:', sampledColor);
      }
    }

    console.log('✅ Final sampled color:', sampledColor);

    // Set the sampled color and update brush color
    setSampledColor(sampledColor);
    setBrushColor(sampledColor || '#000000');
  };

  const startDrawing = (e: React.MouseEvent) => {
    const point = getPointFromEvent(e);

    if (drawingTool === 'eyedropper') {
      // Sample color at clicked position
      sampleColor(point, e);
      return;
    }

    if (drawingTool === 'move') {
      // Check if we're clicking on any logo elements
      let clickedElement: string | null = null;
      let clickedElementObj: TextElement | IconElement | null = null;

      // Check icon
      if (logoElements.icon) {
        const icon = logoElements.icon;
        const distance = Math.sqrt(
          Math.pow(point.x - icon.x, 2) + Math.pow(point.y - icon.y, 2)
        );
        if (distance <= icon.size) {
          clickedElement = 'icon';
          clickedElementObj = icon;
        }
      }

      // Check brand text
      if (!clickedElement && logoElements.brand) {
        const brand = logoElements.brand;
        // Approximate text bounds (this is a simple hit detection)
        const textWidth = brand.text.length * (brand.fontSize * 0.6);
        const textHeight = brand.fontSize;

        if (
          point.x >= brand.x - textWidth / 2 &&
          point.x <= brand.x + textWidth / 2 &&
          point.y >= brand.y - textHeight / 2 &&
          point.y <= brand.y + textHeight / 2
        ) {
          clickedElement = 'brand';
          clickedElementObj = brand;
        }
      }

      // Check slogan text
      if (!clickedElement && logoElements.slogan) {
        const slogan = logoElements.slogan;
        const textWidth = slogan.text.length * (slogan.fontSize * 0.6);
        const textHeight = slogan.fontSize;

        if (
          point.x >= slogan.x - textWidth / 2 &&
          point.x <= slogan.x + textWidth / 2 &&
          point.y >= slogan.y - textHeight / 2 &&
          point.y <= slogan.y + textHeight / 2
        ) {
          clickedElement = 'slogan';
          clickedElementObj = slogan;
        }
      }

      if (clickedElement && clickedElementObj) {
        // Don't allow moving permanent elements
        if (clickedElementObj.permanent) {
          console.log('🔒 Cannot move permanent element:', clickedElement);
          return;
        }

        setSelectedElement(clickedElement);
        setIsMovingElement(true);
        setMovingElement(clickedElement);
        setElementMoveStart({
          startX: point.x,
          startY: point.y,
          originalElement: clickedElementObj
        });
        console.log('🖱️ Started dragging logo element:', clickedElement, 'at', point);
      }
      return;
    }
    
    if (drawingTool === 'brush' || (drawingTool === 'eraser' && eraserMode === 'brush')) {
      const newStroke: Stroke = {
        id: `stroke-${Date.now()}`,
        tool: drawingTool,
        points: [point],
        color: drawingTool === 'eraser' ? 
          (variation?.backgroundColor?.includes('linear-gradient') 
            ? '#FFFFFF' 
            : (variation?.backgroundColor || localConfig.palette?.colors[0] || '#FFFFFF')) 
          : brushColor,
        width: brushSize,
        opacity: drawingTool === 'eraser' ? (eraserOpacity / 10) : (brushOpacity / 10),
        lineCap: brushLineCap // Use brushLineCap for both brush and eraser
      };
      setCurrentStroke(newStroke);
      setIsDrawing(true);
      drawingRef.current.drawing = true;
    } else if (drawingTool === 'eraser' && eraserMode === 'line') {
      // Line erasing mode
      setCurrentLine({
        start: point,
        end: point
      });
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
        fillColor: boxFillColor, // Use the selected fill color directly
        strokeWidth: 0.5,
        rotation: 0,
        selected: false,
        opacity: boxOpacity / 10, // Convert 1-10 scale to 0-1 scale
        permanent: false
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
    if (!drawingRef.current.drawing && !isRotating && !isResizing && !isMoving && !isMovingElement) return;

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
    
    // Handle move
    if (isMoving && movingBox && moveStart) {
      const deltaX = point.x - moveStart.startX;
      const deltaY = point.y - moveStart.startY;
      
      setBoxes(prev => prev.map(box => 
        box.id === movingBox 
          ? { 
              ...box, 
              x: moveStart.originalBox.x + deltaX,
              y: moveStart.originalBox.y + deltaY
            }
          : box
      ));
      return;
    }
    
    if ((drawingTool === 'brush' || (drawingTool === 'eraser' && eraserMode === 'brush')) && currentStroke) {
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
    } else if ((drawingTool === 'line' || (drawingTool === 'eraser' && eraserMode === 'line')) && currentLine) {
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
        selected: true // Select the newly created box for drag and drop
      };
      
      setBoxes(prev => [...prev, finalBox]);
      setSelectedBox(finalBox.id);
      setCurrentBox(null);
      
      // Enable drag and drop immediately after creation
      setIsMoving(true);
      setMovingBox(finalBox.id);
      setMoveStart({
        startX: point.x,
        startY: point.y,
        originalBox: finalBox
      });
    } else if (currentStroke) {
      // Add brush/eraser stroke to current layer
      setEditLayers(prev => prev.map(layer => 
        layer.id === 'layer-1' 
          ? { ...layer, strokes: [...layer.strokes, currentStroke] }
          : layer
      ));
    } else if ((drawingTool === 'line' || (drawingTool === 'eraser' && eraserMode === 'line')) && currentLine) {
      // Create a line stroke from the current line
      const lineStroke: Stroke = {
        id: `line-${Date.now()}`,
        tool: drawingTool === 'eraser' ? 'eraser' : 'line',
        points: [currentLine.start, currentLine.end],
        color: drawingTool === 'eraser' ? 
          (variation?.backgroundColor?.includes('linear-gradient') 
            ? '#FFFFFF' 
            : (variation?.backgroundColor || localConfig.palette?.colors[0] || '#FFFFFF')) 
          : lineColor,
        width: drawingTool === 'eraser' ? brushSize : lineWidth,
        opacity: drawingTool === 'eraser' ? (eraserOpacity / 10) : (brushOpacity / 10),
        lineCap: drawingTool === 'eraser' ? brushLineCap : lineCap
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
              const centerX = stroke.rect.x + stroke.rect.width / 2;
              const centerY = stroke.rect.y + stroke.rect.height / 2;
              const rotation = stroke.rotation || 0;

              return (
                <rect
                  key={stroke.id}
                  x={stroke.rect.x}
                  y={stroke.rect.y}
                  width={stroke.rect.width}
                  height={stroke.rect.height}
                  fill={stroke.color}
                  stroke={stroke.color}
                  strokeWidth={stroke.width}
                  opacity={stroke.opacity}
                  transform={`rotate(${rotation} ${centerX} ${centerY})`}
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
                  strokeLinecap={stroke.lineCap || "round"}
                  opacity={stroke.opacity}
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
                  strokeLinecap={stroke.lineCap || "round"}
                  strokeLinejoin="round"
                  opacity={stroke.opacity}
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
              opacity={box.opacity}
              className={drawingTool === 'eraser' ? "cursor-crosshair" : "cursor-move"}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                
                // Don't interact with permanent boxes
                if (box.permanent) {
                  return;
                }
                
                // If eraser tool is active, delete the box
                if (drawingTool === 'eraser') {
                  setBoxes(prev => prev.filter(b => b.id !== box.id));
                  setSelectedBox(null);
                  return;
                }
                
                // Select the box first
                setSelectedBox(box.id);
                setBoxes(prev => prev.map(b => ({
                  ...b, 
                  selected: b.id === box.id
                })));
                
                // Start moving immediately
                const svg = e.currentTarget.ownerSVGElement;
                if (!svg) return;
                const rect = svg.getBoundingClientRect();
                setMoveStart({
                  startX: e.clientX - rect.left,
                  startY: e.clientY - rect.top,
                  originalBox: { ...box }
                });
                setIsMoving(true);
                setMovingBox(box.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                
                // Drop the box by ending the move state
                setIsMoving(false);
                setMovingBox(null);
                setMoveStart(null);
              }}
            />
            {/* Selection handles - resize functionality */}
            {box.selected && !box.permanent && (
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
            opacity={currentBox.opacity}
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
            strokeLinecap={currentStroke.lineCap || "round"}
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
            strokeLinecap={lineCap}
            opacity={0.7}
            style={{ pointerEvents: 'none' }}
            strokeDasharray="5,5"
          />
        )}

        {/* Render logo elements */}
        {logoElements.brand && (
          <text
            x={logoElements.brand.x}
            y={logoElements.brand.y}
            textAnchor={logoElements.brand.textAlign === 'left' ? 'start' : logoElements.brand.textAlign === 'right' ? 'end' : 'middle'}
            dominantBaseline="middle"
            fontSize={logoElements.brand.fontSize}
            fontFamily={logoElements.brand.fontFamily}
            fontWeight={logoElements.brand.fontWeight}
            fill={logoElements.brand.color}
            transform={`rotate(${logoElements.brand.rotation} ${logoElements.brand.x} ${logoElements.brand.y})`}
            className={drawingTool === 'move' && !logoElements.brand.permanent ? 'cursor-move' : 'cursor-default'}
            style={{
              userSelect: 'none',
              pointerEvents: (drawingTool === 'move' && !logoElements.brand.permanent) ? 'all' : 'none',
              opacity: logoElements.brand.permanent ? logoElements.brand.opacity : logoElements.brand.opacity * 0.9
            }}
          >
            {logoElements.brand.text}
          </text>
        )}

        {logoElements.slogan && (
          <text
            x={logoElements.slogan.x}
            y={logoElements.slogan.y}
            textAnchor={logoElements.slogan.textAlign === 'left' ? 'start' : logoElements.slogan.textAlign === 'right' ? 'end' : 'middle'}
            dominantBaseline="middle"
            fontSize={logoElements.slogan.fontSize}
            fontFamily={logoElements.slogan.fontFamily}
            fontWeight={logoElements.slogan.fontWeight}
            fill={logoElements.slogan.color}
            transform={`rotate(${logoElements.slogan.rotation} ${logoElements.slogan.x} ${logoElements.slogan.y})`}
            className={drawingTool === 'move' && !logoElements.slogan.permanent ? 'cursor-move' : 'cursor-default'}
            style={{
              userSelect: 'none',
              pointerEvents: (drawingTool === 'move' && !logoElements.slogan.permanent) ? 'all' : 'none',
              opacity: logoElements.slogan.permanent ? logoElements.slogan.opacity : logoElements.slogan.opacity * 0.9
            }}
          >
            {logoElements.slogan.text}
          </text>
        )}

        {logoElements.icon && (
          <g
            transform={`translate(${logoElements.icon.x - logoElements.icon.size/2}, ${logoElements.icon.y - logoElements.icon.size/2}) rotate(${logoElements.icon.rotation} ${logoElements.icon.size/2} ${logoElements.icon.size/2})`}
            className={drawingTool === 'move' && !logoElements.icon.permanent ? 'cursor-move' : 'cursor-default'}
            style={{
              pointerEvents: (drawingTool === 'move' && !logoElements.icon.permanent) ? 'all' : 'none',
              opacity: logoElements.icon.permanent ? logoElements.icon.opacity : logoElements.icon.opacity * 0.9
            }}
          >
            <foreignObject
              width={logoElements.icon.size}
              height={logoElements.icon.size}
              style={{ overflow: 'visible' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <logoElements.icon.icon
                  size={logoElements.icon.size}
                  color={logoElements.icon.color}
                  style={{ pointerEvents: 'none' }}
                />
              </div>
            </foreignObject>
          </g>
        )}

        {/* Selection indicators for logo elements */}
        {selectedElement && logoElements[selectedElement as keyof typeof logoElements] && (
          <circle
            cx={logoElements[selectedElement as keyof typeof logoElements]!.x}
            cy={logoElements[selectedElement as keyof typeof logoElements]!.y}
            r="25"
            fill="none"
            stroke="blue"
            strokeWidth="2"
            strokeDasharray="5,5"
            style={{ pointerEvents: 'none' }}
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
  const renderLogoContent = (textColor: string, backgroundColor: string, font: any, logoConfig: LogoConfig, sloganColorParam?: string) => {
    const isCircleLayout = logoConfig.layout?.id === 'circle-enclosed';
    const dynamicFontSize = getDynamicFontSize(logoConfig.text.length, isCircleLayout);
    
    
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
              <logoConfig.icon.component
                size={32}
                color={iconColor}
                className="mb-2"
                style={{
                }}
              />
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
                  display: 'block',
                }}
                title={`FontWeight: ${logoConfig.fontWeight || 400}`}
              >
                {logoConfig.text || 'Your Logo'}
              </span>
              {logoConfig.slogan && (
                <span
                  className="text-sm font-normal opacity-80 mt-1 max-w-full truncate"
                  style={{
                    fontWeight: 300,
                    color: sloganColorParam || textColor,
                  }}
                >
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
                  <span
                    className="logo-text-preview whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{
                      fontSize: dynamicFontSize,
                      fontFamily: font.cssName,
                      fontWeight: logoConfig.fontWeight || 400,
                      color: textColor,
                        }}
                  >
                    {logoConfig.text || 'Your Logo'}
                  </span>
                  {logoConfig.slogan && (
                    <span
                      className="text-base font-normal opacity-80 mt-1 truncate"
                      style={{
                        fontWeight: 300,
                        color: sloganColorParam || textColor,
                          }}
                    >
                      {logoConfig.slogan}
                    </span>
                  )}
                </div>
                {logoConfig.icon && (
                  <logoConfig.icon.component
                    size={48}
                    color={iconColor}
                    className="flex-shrink-0"
                    style={{
                        }}
                  />
                )}
              </>
            ) : (
              <>
                {logoConfig.icon && (
                  <logoConfig.icon.component
                    size={48}
                    color={iconColor}
                    className="flex-shrink-0"
                    style={{
                        }}
                  />
                )}
                <div className="flex flex-col items-center text-center justify-center">
                  <span
                    className="logo-text-preview whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{
                      fontSize: dynamicFontSize,
                      fontFamily: font.cssName,
                      fontWeight: logoConfig.fontWeight || 400,
                      color: textColor,
                        }}
                  >
                    {logoConfig.text || 'Your Logo'}
                  </span>
                  {logoConfig.slogan && (
                    <span
                      className="text-base font-normal opacity-80 mt-1 truncate"
                      style={{
                        fontWeight: 300,
                        color: sloganColorParam || textColor,
                          }}
                    >
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
              <logoConfig.icon.component
                size={48}
                color={iconColor}
                className="mb-2"
                style={{
                }}
              />
            )}
            <div className="flex flex-col items-center text-center w-full max-w-full px-4">
              <span
                className="logo-text-preview whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                style={{
                  fontSize: dynamicFontSize,
                  fontFamily: font.cssName,
                  fontWeight: logoConfig.fontWeight || 400,
                  color: textColor,
                }}
              >
                {logoConfig.text || 'Your Logo'}
              </span>
              {logoConfig.slogan && (
                <span
                  className="text-base font-normal opacity-80 mt-1 max-w-full truncate"
                  style={{
                    fontWeight: 300,
                    color: sloganColorParam || textColor,
                  }}
                >
                  {logoConfig.slogan}
                </span>
              )}
            </div>
          </div>
        );
      }
    }
  };

  // Memoized logo rendering to ensure re-render on fontWeight change
  const renderedLogo = useMemo(() => {
    console.log('Memoized logo render - fontWeight:', currentFontWeight, 'forceRender:', forceRender);
    return renderLogoContent(
      brandNameColor,
      localConfig.palette?.colors[0] || '#FFFFFF',
      localConfig.font || { cssName: 'Inter, sans-serif', name: 'Inter' },
      {
        ...localConfig,
        text: localConfig.text || 'Your Logo',
        fontWeight: currentFontWeight,
        icon: localConfig.icon,
        layout: localConfig.layout,
        enclosingShape: localConfig.enclosingShape
      },
      sloganColor
    );
  }, [currentFontWeight, forceRender, localConfig.text, localConfig.font?.name, brandNameColor, sloganColor, localConfig.icon, localConfig.layout]);

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
      {/* Menu Panel - slides up from bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/20 rounded-b-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl">
        <div className="flex gap-1 justify-center">
          <button
            onClick={handleEdit}
            className="flex items-center justify-center gap-1 px-1.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors flex-1 max-w-[60px]"
          >
            <Edit size={12} /> Edit
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
            <div className="flex-1 p-8 flex flex-col items-center justify-center border-r border-white/20">
              {/* Zoom Controls */}
              <div className="absolute top-4 left-4 z-50">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isZoomed
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                  }`}
                >
                  {isZoomed ? '1x' : '2x'} Zoom
                </button>
              </div>

              <div
                className={`relative rounded-lg max-w-2xl w-full aspect-square transition-transform duration-300 ${
                  isZoomed ? 'transform scale-[2] origin-center' : ''
                }`}
                style={{
                  transformOrigin: 'center center'
                }}
              >
                {/* Gradient Background Layer (deeper layer, unaffected by eraser) */}
                {variation?.backgroundColor?.includes('linear-gradient') && (
                  <div 
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundImage: variation.backgroundColor, zIndex: 1 }}
                  />
                )}
                
                <div 
                  className="relative rounded-lg p-12 w-full aspect-square flex items-center justify-center" 
                  key={`logo-preview-${currentFontWeight}-${fontWeightUpdateKey}-${forceRender}-${localConfig.text}-${localConfig.font?.name}`}
                  style={{
                    zIndex: 2,
                    ...(!variation?.backgroundColor?.includes('linear-gradient') 
                      ? { backgroundColor: variation?.backgroundColor || '#FFFFFF' }
                      : {})
                  }}
                >
                
                {/* Original Logo Content */}
                {renderedLogo}
                
                {/* Drawing Canvas Overlay */}
                <div
                  ref={canvasRef}
                  className={`absolute inset-0 rounded-lg ${(drawingTool === 'brush' || drawingTool === 'eraser' || drawingTool === 'line') ? 'cursor-none' : drawingTool === 'eyedropper' ? 'cursor-crosshair' : drawingTool === 'move' ? 'cursor-move' : 'cursor-crosshair'}`}
                  style={{
                    ...(isZoomed && {
                      cursor: drawingTool === 'brush' ? 'none' :
                              drawingTool === 'eraser' ? 'none' :
                              drawingTool === 'line' ? 'none' :
                              drawingTool === 'eyedropper' ? `url("data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='2' fill='white' stroke='black' stroke-width='1'/%3E%3C/svg%3E") 16 16, crosshair` :
                              drawingTool === 'move' ? 'move' : 'crosshair'
                    })
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={(e) => {
                    // Update cursor position for custom cursor display
                    const rect = canvasRef.current?.getBoundingClientRect();
                    if (rect) {
                      setCursorPosition({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                      });
                    }
                    continueDrawing(e);
                  }}
                  onMouseUp={endDrawing}
                  onMouseLeave={(e) => {
                    setCursorPosition(null);
                    endDrawing(e);
                  }}
                  onMouseEnter={() => {
                    // Initialize cursor position when entering canvas
                    if ((drawingTool === 'brush' || drawingTool === 'eraser' || drawingTool === 'line')) {
                      // Cursor will be updated on first mouse move
                    }
                  }}
                  onDoubleClick={() => {
                    // Drop any box that's currently being moved
                    if (isMoving && movingBox) {
                      setIsMoving(false);
                      setMovingBox(null);
                      setMoveStart(null);
                    }
                  }}
                >
                  {renderDrawingLayers()}
                </div>
                
                {/* Tool indicator */}
                <div className="absolute top-2 right-2 bg-gray-800/80 text-white px-2 py-1 rounded text-xs">
                  {drawingTool === 'brush' ? `🖌️ Brush ${brushSize}px` :
                   drawingTool === 'eraser' ? `🧽 Eraser ${brushSize}px` :
                   drawingTool === 'box' ? `⬜ Box` :
                   drawingTool === 'line' ? `📏 Line ${lineWidth}px` :
                   drawingTool === 'eyedropper' ? `🎨 Pipette` :
                   drawingTool === 'move' ? `↔️ Move Elements` :
                   '✏️ Drawing'}
                  {isZoomed && <span className="ml-2 text-blue-400">2x</span>}
                </div>

                {/* Custom Cursor Overlay for Brush/Eraser tools with Zoom scaling */}
                {cursorPosition && (drawingTool === 'brush' || drawingTool === 'eraser' || drawingTool === 'line') && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: cursorPosition.x,
                      top: cursorPosition.y,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 100
                    }}
                  >
                    <div
                      className={`border-2 border-white shadow-lg rounded-full ${
                        drawingTool === 'brush' ? 'bg-black/20' :
                        drawingTool === 'eraser' ? 'bg-white/30' : 'bg-blue-500/30'
                      }`}
                      style={{
                        width: `${(drawingTool === 'line' ? lineWidth : brushSize) * (isZoomed ? 2 : 1)}px`,
                        height: `${(drawingTool === 'line' ? lineWidth : brushSize) * (isZoomed ? 2 : 1)}px`,
                        borderColor: drawingTool === 'eraser' ? '#ff6b6b' : drawingTool === 'line' ? '#3b82f6' : '#000'
                      }}
                    />
                    {/* Center dot */}
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
                      style={{
                        width: `${2 * (isZoomed ? 2 : 1)}px`,
                        height: `${2 * (isZoomed ? 2 : 1)}px`,
                        boxShadow: '0 0 2px black'
                      }}
                    />
                  </div>
                )}
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
                  <div className="grid grid-cols-3 gap-2 mb-4">
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
                      onClick={() => setDrawingTool('eyedropper')}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                        drawingTool === 'eyedropper' ? 'bg-teal-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <Pipette size={16} />
                    </button>
                    <button
                      onClick={() => setDrawingTool('move')}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                        drawingTool === 'move' ? 'bg-green-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <Move size={16} />
                      Move
                    </button>
                  </div>

                  {/* Eyedropper Tool Settings */}
                  {drawingTool === 'eyedropper' && sampledColor && (
                    <div className="bg-white/10 rounded p-3 mb-4">
                      <label className="block text-white/80 text-sm mb-2">Gesampelte Farbe</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-10 h-8 rounded border border-white/20"
                          style={{ backgroundColor: sampledColor }}
                        ></div>
                        <span className="text-white/60 text-sm">{sampledColor}</span>
                        <button
                          onClick={() => {
                            setBrushColor(sampledColor);
                            setBoxFillColor(sampledColor);
                            setBoxStrokeColor(sampledColor);
                            setLineColor(sampledColor);
                          }}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          Verwenden
                        </button>
                      </div>
                      <p className="text-white/60 text-xs mt-2">Klicke auf Elemente im Logo um Farben zu sampeln</p>
                    </div>
                  )}

                  {/* Move Tool Settings */}
                  {drawingTool === 'move' && (
                    <div className="bg-white/10 rounded p-3 mb-4">
                      <label className="block text-white/80 text-sm mb-2">Element Position</label>
                      <p className="text-white/60 text-xs mb-3">Klicke und ziehe Icon, Brand Name oder Slogan um sie zu verschieben</p>

                      <div className="space-y-2">
                        {logoElements.icon && (
                          <div className="flex items-center justify-between">
                            <span className="text-white/70 text-xs">Icon Position:</span>
                            <span className="text-white/50 text-xs">x: {Math.round(logoElements.icon.x)}, y: {Math.round(logoElements.icon.y)}</span>
                          </div>
                        )}
                        {logoElements.brand && (
                          <div className="flex items-center justify-between">
                            <span className="text-white/70 text-xs">Brand Position:</span>
                            <span className="text-white/50 text-xs">x: {Math.round(logoElements.brand.x)}, y: {Math.round(logoElements.brand.y)}</span>
                          </div>
                        )}
                        {logoElements.slogan && (
                          <div className="flex items-center justify-between">
                            <span className="text-white/70 text-xs">Slogan Position:</span>
                            <span className="text-white/50 text-xs">x: {Math.round(logoElements.slogan.x)}, y: {Math.round(logoElements.slogan.y)}</span>
                          </div>
                        )}
                      </div>

                      {/* Place Here buttons */}
                      <div className="space-y-2 mt-3">
                        {logoElements.icon && !logoElements.icon.permanent && (
                          <button
                            onClick={() => {
                              setLogoElements(prev => ({
                                ...prev,
                                icon: prev.icon ? { ...prev.icon, permanent: true, selected: false } : prev.icon
                              }));
                              setSelectedElement(null);
                              console.log('🎯 Icon placed permanently as SVG element');
                            }}
                            className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                          >
                            Place Icon Here!
                          </button>
                        )}
                        {logoElements.brand && !logoElements.brand.permanent && (
                          <button
                            onClick={() => {
                              setLogoElements(prev => ({
                                ...prev,
                                brand: prev.brand ? { ...prev.brand, permanent: true, selected: false } : prev.brand
                              }));
                              setSelectedElement(null);
                              console.log('🎯 Brand placed permanently as SVG element');
                            }}
                            className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                          >
                            Place Brand Here!
                          </button>
                        )}
                        {logoElements.slogan && !logoElements.slogan.permanent && (
                          <button
                            onClick={() => {
                              setLogoElements(prev => ({
                                ...prev,
                                slogan: prev.slogan ? { ...prev.slogan, permanent: true, selected: false } : prev.slogan
                              }));
                              setSelectedElement(null);
                              console.log('🎯 Slogan placed permanently as SVG element');
                            }}
                            className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                          >
                            Place Slogan Here!
                          </button>
                        )}
                      </div>

                      {/* Element Size and Alignment Controls */}
                      {selectedElement && logoElements[selectedElement as keyof typeof logoElements] && (
                        <div className="border-t border-white/20 pt-3 mt-3">
                          <label className="block text-white/80 text-sm mb-3">Element Controls</label>

                          {/* Size Controls */}
                          {selectedElement === 'icon' && logoElements.icon && (
                            <>
                              <div>
                                <label className="block text-white/80 text-sm mb-1">Icon Size: {logoElements.icon.size}px</label>
                                <input
                                  type="range"
                                  min="16"
                                  max="120"
                                  value={logoElements.icon.size}
                                  onChange={(e) => {
                                    const newSize = parseInt(e.target.value);
                                    setLogoElements(prev => ({
                                      ...prev,
                                      icon: prev.icon ? { ...prev.icon, size: newSize } : prev.icon
                                    }));
                                  }}
                                  className="w-full slider"
                                />
                              </div>

                              <div>
                                <label className="block text-white/80 text-sm mb-1">Icon Color</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={logoElements.icon.color}
                                    onChange={(e) => {
                                      setLogoElements(prev => ({
                                        ...prev,
                                        icon: prev.icon ? { ...prev.icon, color: e.target.value } : prev.icon
                                      }));
                                    }}
                                    className="w-10 h-8 rounded border border-white/20 cursor-pointer"
                                  />
                                  <span className="text-white/60 text-sm">{logoElements.icon.color}</span>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Text Controls */}
                          {(selectedElement === 'brand' || selectedElement === 'slogan') && logoElements[selectedElement as keyof typeof logoElements] && (
                            <>
                              <div>
                                <label className="block text-white/80 text-sm mb-1">Font Size: {(logoElements[selectedElement as keyof typeof logoElements] as TextElement)?.fontSize}px</label>
                                <input
                                  type="range"
                                  min="8"
                                  max="72"
                                  value={(logoElements[selectedElement as keyof typeof logoElements] as TextElement)?.fontSize || 16}
                                  onChange={(e) => {
                                    const newSize = parseInt(e.target.value);
                                    setLogoElements(prev => ({
                                      ...prev,
                                      [selectedElement]: prev[selectedElement as keyof typeof prev] ? {
                                        ...(prev[selectedElement as keyof typeof prev] as TextElement),
                                        fontSize: newSize
                                      } : prev[selectedElement as keyof typeof prev]
                                    }));
                                  }}
                                  className="w-full slider"
                                />
                              </div>

                              <div>
                                <label className="block text-white/80 text-sm mb-1">Text Color</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={(logoElements[selectedElement as keyof typeof logoElements] as TextElement)?.color || '#000000'}
                                    onChange={(e) => {
                                      setLogoElements(prev => ({
                                        ...prev,
                                        [selectedElement]: prev[selectedElement as keyof typeof prev] ? {
                                          ...(prev[selectedElement as keyof typeof prev] as TextElement),
                                          color: e.target.value
                                        } : prev[selectedElement as keyof typeof prev]
                                      }));
                                    }}
                                    className="w-10 h-8 rounded border border-white/20 cursor-pointer"
                                  />
                                  <span className="text-white/60 text-sm">{(logoElements[selectedElement as keyof typeof logoElements] as TextElement)?.color}</span>
                                </div>
                              </div>

                              <div>
                                <label className="block text-white/80 text-sm mb-1">Text Alignment</label>
                                <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded p-2">
                                  <button
                                    onClick={() => setLogoElements(prev => ({
                                      ...prev,
                                      [selectedElement]: prev[selectedElement as keyof typeof prev] ? {
                                        ...(prev[selectedElement as keyof typeof prev] as TextElement),
                                        textAlign: 'left'
                                      } : prev[selectedElement as keyof typeof prev]
                                    }))}
                                    className={`flex-1 px-3 py-1 rounded text-xs transition-colors ${
                                      (logoElements[selectedElement as keyof typeof logoElements] as TextElement)?.textAlign === 'left'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                  >
                                    Links
                                  </button>
                                  <button
                                    onClick={() => setLogoElements(prev => ({
                                      ...prev,
                                      [selectedElement]: prev[selectedElement as keyof typeof prev] ? {
                                        ...(prev[selectedElement as keyof typeof prev] as TextElement),
                                        textAlign: 'center'
                                      } : prev[selectedElement as keyof typeof prev]
                                    }))}
                                    className={`flex-1 px-3 py-1 rounded text-xs transition-colors ${
                                      (logoElements[selectedElement as keyof typeof logoElements] as TextElement)?.textAlign === 'center'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                  >
                                    Mitte
                                  </button>
                                  <button
                                    onClick={() => setLogoElements(prev => ({
                                      ...prev,
                                      [selectedElement]: prev[selectedElement as keyof typeof prev] ? {
                                        ...(prev[selectedElement as keyof typeof prev] as TextElement),
                                        textAlign: 'right'
                                      } : prev[selectedElement as keyof typeof prev]
                                    }))}
                                    className={`flex-1 px-3 py-1 rounded text-xs transition-colors ${
                                      (logoElements[selectedElement as keyof typeof logoElements] as TextElement)?.textAlign === 'right'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                  >
                                    Rechts
                                  </button>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Rotation and Opacity Controls for all elements */}
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Rotation: {Math.round((logoElements[selectedElement as keyof typeof logoElements] as any)?.rotation || 0)}°</label>
                            <input
                              type="range"
                              min="-180"
                              max="180"
                              value={(logoElements[selectedElement as keyof typeof logoElements] as any)?.rotation || 0}
                              onChange={(e) => {
                                const newRotation = parseInt(e.target.value);
                                setLogoElements(prev => ({
                                  ...prev,
                                  [selectedElement]: prev[selectedElement as keyof typeof prev] ? {
                                    ...(prev[selectedElement as keyof typeof prev] as any),
                                    rotation: newRotation
                                  } : prev[selectedElement as keyof typeof prev]
                                }));
                              }}
                              className="w-full slider"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm mb-1">Opacity: {Math.round(((logoElements[selectedElement as keyof typeof logoElements] as any)?.opacity || 1) * 100)}%</label>
                            <input
                              type="range"
                              min="0.1"
                              max="1"
                              step="0.1"
                              value={(logoElements[selectedElement as keyof typeof logoElements] as any)?.opacity || 1}
                              onChange={(e) => {
                                const newOpacity = parseFloat(e.target.value);
                                setLogoElements(prev => ({
                                  ...prev,
                                  [selectedElement]: prev[selectedElement as keyof typeof prev] ? {
                                    ...(prev[selectedElement as keyof typeof prev] as any),
                                    opacity: newOpacity
                                  } : prev[selectedElement as keyof typeof prev]
                                }));
                              }}
                              className="w-full slider"
                            />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          const canvasWidth = 400;
                          const canvasHeight = 300;

                          setLogoElements(prev => ({
                            ...prev,
                            icon: prev.icon ? { ...prev.icon, x: canvasWidth / 2, y: canvasHeight / 2 - 60, permanent: false, rotation: 0, opacity: 1.0 } : prev.icon,
                            brand: prev.brand ? { ...prev.brand, x: canvasWidth / 2, y: canvasHeight / 2 - 20, permanent: false, rotation: 0, textAlign: 'center', opacity: 1.0 } : prev.brand,
                            slogan: prev.slogan ? { ...prev.slogan, x: canvasWidth / 2, y: canvasHeight / 2 + 20, permanent: false, rotation: 0, textAlign: 'center', opacity: 1.0 } : prev.slogan
                          }));
                          setSelectedElement(null);
                        }}
                        className="w-full mt-3 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                      >
                        Reset All Properties
                      </button>
                    </div>
                  )}

                  {/* Eraser Mode Settings */}
                  {drawingTool === 'eraser' && (
                    <div className="bg-white/10 rounded p-3 mb-4">
                      <label className="block text-white/80 text-sm mb-2">Eraser-Modus</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setEraserMode('brush')}
                          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                            eraserMode === 'brush' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          <Brush size={14} />
                          Brush
                        </button>
                        <button
                          onClick={() => setEraserMode('line')}
                          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                            eraserMode === 'line' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          📏 Line
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tool Settings */}
                  <div className="space-y-3">
                    {/* Brush and Eraser Color Settings */}
                    {(drawingTool === 'brush' || drawingTool === 'eraser') && (
                      <>
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
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-1">
                            {drawingTool === 'brush' ? 'Brush' : 'Eraser'} Opacity: {drawingTool === 'brush' ? brushOpacity : eraserOpacity}/10
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={drawingTool === 'brush' ? brushOpacity : eraserOpacity}
                            onChange={(e) => {
                              if (drawingTool === 'brush') {
                                setBrushOpacity(parseInt(e.target.value));
                              } else {
                                setEraserOpacity(parseInt(e.target.value));
                              }
                            }}
                            className="w-full slider"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-1">
                            {drawingTool === 'brush' ? 'Pinselende' : 'Radiererenden'}
                          </label>
                          <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded p-2">
                            <button
                              onClick={() => setBrushLineCap('round')}
                              className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                                brushLineCap === 'round' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'text-white/80 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              ● Rund
                            </button>
                            <button
                              onClick={() => setBrushLineCap('square')}
                              className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                                brushLineCap === 'square' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'text-white/80 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              ■ Quadratisch
                            </button>
                          </div>
                        </div>
                      </>
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
                              onChange={(e) => {
                                setBoxStrokeColor(e.target.value);
                                // Update selected box stroke color immediately
                                if (selectedBox) {
                                  setBoxes(prev => prev.map(box => 
                                    box.id === selectedBox 
                                      ? { ...box, strokeColor: e.target.value }
                                      : box
                                  ));
                                }
                              }}
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
                              onChange={(e) => {
                                setBoxFillColor(e.target.value);
                                // Update selected box fill color immediately
                                if (selectedBox) {
                                  setBoxes(prev => prev.map(box => 
                                    box.id === selectedBox 
                                      ? { ...box, fillColor: e.target.value }
                                      : box
                                  ));
                                }
                              }}
                              className="w-10 h-8 rounded border border-white/20 cursor-pointer"
                            />
                            <span className="text-white/60 text-sm">{boxFillColor}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-1">Box Opacity: {boxOpacity}/10</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={boxOpacity}
                            onChange={(e) => {
                              setBoxOpacity(parseInt(e.target.value));
                              // Update selected box opacity immediately
                              if (selectedBox) {
                                setBoxes(prev => prev.map(box => 
                                  box.id === selectedBox 
                                    ? { ...box, opacity: parseInt(e.target.value) / 10 }
                                    : box
                                ));
                              }
                            }}
                            className="w-full slider"
                          />
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
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-1">Linienende</label>
                          <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded p-2">
                            <button
                              onClick={() => setLineCap('round')}
                              className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                                lineCap === 'round' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'text-white/80 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              ● Rund
                            </button>
                            <button
                              onClick={() => setLineCap('square')}
                              className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                                lineCap === 'square' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'text-white/80 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              ■ Quadratisch
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    
                    
                    {/* Box Controls */}
                    {selectedBox && (
                      <div className="border-t border-white/20 pt-3">
                        <label className="block text-white/80 text-sm mb-3">Box Controls</label>
                        
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                // Convert selected box to stroke and add to drawing layer
                                const boxToConvert = boxes.find(box => box.id === selectedBox);
                                if (boxToConvert) {
                                  const boxStroke: Stroke = {
                                    id: `box-stroke-${Date.now()}`,
                                    tool: 'box',
                                    points: [
                                      { x: boxToConvert.x, y: boxToConvert.y },
                                      { x: boxToConvert.x + boxToConvert.width, y: boxToConvert.y + boxToConvert.height }
                                    ],
                                    color: boxToConvert.fillColor,
                                    width: boxToConvert.strokeWidth,
                                    opacity: boxToConvert.opacity,
                                    rotation: boxToConvert.rotation, // Preserve rotation state
                                    rect: {
                                      x: boxToConvert.x,
                                      y: boxToConvert.y,
                                      width: boxToConvert.width,
                                      height: boxToConvert.height
                                    }
                                  };

                                  // Add box stroke to drawing layer
                                  setEditLayers(prev => prev.map(layer =>
                                    layer.id === 'layer-1'
                                      ? { ...layer, strokes: [...layer.strokes, boxStroke] }
                                      : layer
                                  ));

                                  // Remove box from boxes array
                                  setBoxes(prev => prev.filter(box => box.id !== selectedBox));
                                  setSelectedBox(null);
                                }
                              }}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                            >
                              Place here!
                            </button>
                          </div>
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
                              // Note: brandNameColor is managed separately from LogoConfig
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
                              // Note: sloganColor is managed separately from LogoConfig
                            }}
                            className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                          />
                          <span className="text-white/50 text-xs">{sloganColor}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Font Family</label>
                      <select
                        value={localConfig.font?.name || 'Inter'}
                        onChange={(e) => {
                          // Find the font in fontCategories
                          const selectedFont = fontCategories
                            .flatMap(cat => cat.fonts)
                            .find(font => font.name === e.target.value);
                          if (selectedFont) {
                            // Create a new font object to ensure reference change
                            const newFont = { ...selectedFont };
                            // Keep current fontWeight, don't reset it
                            setLocalConfig(prev => ({
                              ...prev,
                              font: newFont
                            }));
                            onConfigUpdate({ font: newFont });
                          }
                        }}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm mb-3"
                      >
                        {fontCategories.map(category => (
                          <optgroup key={category.name} label={category.name}>
                            {category.fonts.map(font => (
                              <option key={font.name} value={font.name}>
                                {font.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      
                      <label className="block text-white/80 text-sm mb-1">Font Weight</label>
                      <div className="space-y-2">
                        {(() => {
                          // Get available weights for current font
                          let availableWeights = [400]; // default fallback

                          if (localConfig.font?.editorWeights && localConfig.font.editorWeights.length > 0) {
                            // Use font's defined editor weights
                            availableWeights = localConfig.font.editorWeights;
                          } else {
                            // Fallback: find font in fontCategories for weights
                            const fontFromCategories = fontCategories
                              .flatMap(cat => cat.fonts)
                              .find(font => font.name === localConfig.font?.name);

                            if (fontFromCategories?.editorWeights && fontFromCategories.editorWeights.length > 0) {
                              availableWeights = fontFromCategories.editorWeights;
                            } else if (localConfig.font?.isVariable) {
                              // Default variable font weights
                              availableWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
                            }
                          }

                          console.log('Font:', localConfig.font?.name, 'Available weights:', availableWeights, 'Current:', currentFontWeight);

                          const minWeight = Math.min(...availableWeights);
                          const maxWeight = Math.max(...availableWeights);

                          const getWeightName = (weight: number) => {
                            switch (weight) {
                              case 100: return 'Thin';
                              case 200: return 'ExtraLight';
                              case 300: return 'Light';
                              case 400: return 'Regular';
                              case 500: return 'Medium';
                              case 600: return 'SemiBold';
                              case 700: return 'Bold';
                              case 800: return 'ExtraBold';
                              case 900: return 'Black';
                              case 1000: return 'Ultra Black';
                              default: return weight.toString();
                            }
                          };

                          // Round current weight to nearest available weight
                          const clampedWeight = Math.max(minWeight, Math.min(maxWeight, currentFontWeight));

                          return (
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs text-white/60 min-w-[60px]">Weight:</span>
                                <input
                                  type="range"
                                  min={minWeight}
                                  max={maxWeight}
                                  step="100"
                                  value={clampedWeight}
                                  onChange={(e) => {
                                    const selectedWeight = parseInt(e.target.value);
                                    console.log('Slider changed to:', selectedWeight);
                                    setCurrentFontWeight(selectedWeight);
                                    setFontWeightUpdateKey(prev => prev + 1);
                                    setForceRender(prev => prev + 1);
                                    setLocalConfig(prev => ({
                                      ...prev,
                                      fontWeight: selectedWeight
                                    }));
                                    onConfigUpdate({ fontWeight: selectedWeight });
                                  }}
                                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                                />
                                <span className="text-sm text-white min-w-[80px] text-right">
                                  {getWeightName(clampedWeight)}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-white/40 px-1">
                                <span>{getWeightName(minWeight)}</span>
                                <span className="text-white/60">{clampedWeight}</span>
                                <span>{getWeightName(maxWeight)}</span>
                              </div>
                              <div className="text-xs text-white/40 mt-1">
                                Available: {availableWeights.join(', ')}
                              </div>
                            </div>
                          );
                        })()}
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
                          const newIconColor = e.target.value;
                          setIconColor(newIconColor);
                          // Update localConfig to trigger re-render
                          setLocalConfig(prev => ({
                            ...prev,
                            iconColor: newIconColor
                          }));
                          setForceRender(prev => prev + 1);
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
                          onClick={() => {
                            updateLocalConfig({ palette });
                            // Update color picker states with palette colors
                            if (palette.colors.length > 0) {
                              setBrandNameColor(palette.colors[0]);
                              if (palette.colors.length > 1) {
                                setIconColor(palette.colors[1]);
                                setSloganColor(palette.colors[1]);
                              }
                            }
                            setForceRender(prev => prev + 1);
                          }}
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


    </>
  );
};

export default LogoEditor;