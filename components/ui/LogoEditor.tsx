import { useState, useEffect, useRef, useMemo } from 'react';
import { LogoConfig, IconData, PaletteData } from '@/lib/types';
import { Edit, Save, ShoppingCart, Download, Check, X, Crown, Zap, User, FileImage, Star, Award, Globe, Briefcase, TrendingUp, Users, Brush, Square, Eraser, RotateCcw, Pipette, Move, Maximize, Expand, Layers, Eye, EyeOff, Plus, ArrowUp, ArrowDown, Trash2, Palette, Type } from 'lucide-react';
import { fontCategories } from '@/lib/data';
import { usePipetteTool } from './PipetteTool';
import { DrawingToolsPanel, ToolSettingsPanel, TextSettingsPanel, IconPalettePanel, ZoomViewControls, BackgroundSettingsPanel, ExportPanel, PurchaseModal, SaveModal } from './logo-editor';
import { LayerManager } from './LayerManager';

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
  tool: 'brush' | 'eraser' | 'box' | 'box-fill' | 'box-border' | 'line' | 'eyedropper' | 'text' | 'icon';
  points: Point[];
  color: string;
  width: number;
  opacity: number; // 0-1 scale for SVG opacity
  lineCap?: 'round' | 'square'; // For line tool
  rect?: { x: number; y: number; width: number; height: number };
  rotation?: number; // Preserve rotation for placed boxes
  // Box-specific properties for separate fill and stroke
  strokeColor?: string;
  strokeOpacity?: number;
  // Element-specific properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  iconComponent?: any;
  iconSize?: number;
}

interface BoxShape {
  id: string;
  type: 'box';
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeOpacity?: number; // 0-1 scale for stroke opacity
  rotation: number;
  selected: boolean;
  opacity: number; // 0-1 scale for box opacity
  permanent: boolean; // If true, box cannot be modified
}

interface EditLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'background' | 'original' | 'logo' | 'custom' | 'elements';
  strokes: Stroke[];
  backgroundColor?: string; // For background layer
  elements?: (TextElement | IconElement | BoxShape)[]; // For elements layer
  order: number; // Layer order (higher number = top layer)
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
  const [isTrueFullscreen, setIsTrueFullscreen] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});
  const [localConfig, setLocalConfig] = useState<LogoConfig>(config);
  
  // Drawing tool states
  const [drawingTool, setDrawingTool] = useState<'brush' | 'eraser' | 'box' | 'line' | 'eyedropper' | 'move' | 'place'>('brush');
  const [selectedElement, setSelectedElement] = useState<'icon' | 'brand' | 'slogan'>('icon');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(10); // 1-10 scale, 10 = 100% opacity
  const [brushLineCap, setBrushLineCap] = useState<'round' | 'square'>('round'); // Line cap for brush
  const [eraserOpacity, setEraserOpacity] = useState(10); // 1-10 scale, 10 = 100% opacity
  const [eraserMode, setEraserMode] = useState<'brush' | 'line'>('brush'); // Eraser mode: brush or line
  const [boxOpacity, setBoxOpacity] = useState(5); // 1-10 scale, 5 = 50% opacity (was 10)
  const [boxStrokeOpacity, setBoxStrokeOpacity] = useState(10); // 1-10 scale for stroke opacity
  const [boxStrokeWidth, setBoxStrokeWidth] = useState(2); // 1-20 scale for stroke width
  const [boxStrokeColor, setBoxStrokeColor] = useState('#ffffff');
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
  const [selectedElementToPlace, setSelectedElementToPlace] = useState<'brand' | 'slogan' | 'icon' | 'box' | null>(null);
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
  const [newLayerName, setNewLayerName] = useState('');
  const [showLayerInput, setShowLayerInput] = useState(false);
  
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
    { id: 'layer-0', name: 'Original Background', visible: true, type: 'original', strokes: [], backgroundColor: 'transparent', order: 0 },
    { id: 'layer-1', name: 'Background Layer', visible: true, type: 'background', strokes: [], backgroundColor: 'transparent', order: 1 },
    { id: 'layer-2', name: 'Logo Layer', visible: true, type: 'logo', strokes: [], elements: [], order: 2 }
  ]);
  const [activeLayer, setActiveLayer] = useState<string>('layer-2');

  // PipetteTool integration
  const handleColorSampled = (color: string | null) => {
    setSampledColor(color);
    if (color) {
      setBrushColor(color);
    }
  };

  const { sampleColor: pipetteSampleColor } = usePipetteTool({
    logoElements,
    editLayers,
    boxes,
    onColorSampled: handleColorSampled
  });

  // Canvas refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const initializedRef = useRef<boolean>(false);
  const variationInitializedRef = useRef<string | null>(null);
  const drawingRef = useRef({ drawing: false, startPoint: null as Point | null });
  
  // Sync local config with props (but preserve user-selected font, fontWeight, and colors)
  useEffect(() => {
    setLocalConfig(prev => ({
      ...config,
      font: prev?.font || config.font, // Preserve selected font
      fontWeight: prev?.fontWeight || config.fontWeight // Preserve selected font weight
    }));

    // Initialize colors from variation when a new variation is loaded
    if (variation && variationInitializedRef.current !== variation.id) {
      console.log('🎨 Initializing colors from variation:', variation.id, {
        brandName: variation.brandNameColor,
        icon: variation.iconColor,
        slogan: variation.sloganColor,
        background: variation.backgroundColor
      });
      setIconColor(variation.iconColor);
      setBrandNameColor(variation.brandNameColor);
      setSloganColor(variation.sloganColor);
      variationInitializedRef.current = variation.id;
    } else if (!variation && variationInitializedRef.current !== null) {
      // Fallback to palette colors when no variation
      if (config.palette?.colors) {
        setIconColor(config.palette.colors[1] || config.palette.colors[0] || '#000000');
        setBrandNameColor(config.palette.colors[0] || '#000000');
        setSloganColor(config.palette.colors[1] || config.palette.colors[0] || '#000000');
      }
      variationInitializedRef.current = null;
    }
  }, [config, variation]);

  // Initialize background layers with variation background color
  useEffect(() => {
    if (variation && variation.backgroundColor) {
      console.log('🖼️ Initializing background color from variation:', variation.id, variation.backgroundColor);
      setEditLayers(prevLayers =>
        prevLayers.map(layer => {
          if (layer.type === 'original') {
            return { ...layer, backgroundColor: variation.backgroundColor };
          }
          if (layer.type === 'background') {
            return { ...layer, backgroundColor: variation.backgroundColor };
          }
          return layer;
        })
      );
    }
  }, [variation]);

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

  // Initialize logo elements based on current config and layout arrangement
  useEffect(() => {
    // SVG verwendet viewBox und prozentuale/relative Koordinaten
    // Für ein quadratisches Canvas (aspect-square) verwenden wir einheitliche Koordinaten
    const canvasSize = 400; // SVG viewBox Größe
    const canvasWidth = canvasSize;
    const canvasHeight = canvasSize;

    const newElements: {
      brand?: TextElement;
      slogan?: TextElement;
      icon?: IconElement;
    } = {};

    // Get layout arrangement from config
    const layoutArrangement = localConfig.layout?.arrangement || 'icon-top';
    console.log('🎯 Initializing logo elements with layout:', layoutArrangement);

    // Calculate positions based on layout arrangement
    let brandX = canvasWidth / 2;
    let brandY = canvasHeight / 2;
    let sloganX = canvasWidth / 2;
    let sloganY = canvasHeight / 2 + 30;
    let iconX = canvasWidth / 2;
    let iconY = canvasHeight / 2 - 50;

    // Im Editor immer mittig zentrieren, unabhängig vom ursprünglichen Layout
    // Kompakte, zentrierte Anordnung für bessere Bearbeitung
    iconX = canvasWidth / 2;
    iconY = canvasHeight / 2 - 40;  // Icon oben
    brandX = canvasWidth / 2;
    brandY = canvasHeight / 2;      // Brand in der Mitte
    sloganX = canvasWidth / 2;
    sloganY = canvasHeight / 2 + 25; // Slogan unten

    console.log('🎯 Logo elements positioned centrally:', {
      icon: { x: iconX, y: iconY },
      brand: { x: brandX, y: brandY },
      slogan: { x: sloganX, y: sloganY }
    });

    // Initialize brand name element
    if (localConfig.text) {
      newElements.brand = {
        id: 'brand-text',
        type: 'brand',
        text: localConfig.text,
        x: brandX,
        y: brandY,
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
        x: sloganX,
        y: sloganY,
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
        x: iconX,
        y: iconY,
        size: 48,
        color: iconColor,
        selected: false,
        permanent: false,
        rotation: 0,
        opacity: 1.0,
      };
    }

    setLogoElements(newElements);
  }, [localConfig.text, localConfig.slogan, localConfig.icon, localConfig.layout?.arrangement, localConfig.font?.cssName, currentFontWeight, brandNameColor, sloganColor, iconColor]);

  // Global mouse events for rotation, resize, and move
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;

      // Use the helper function for consistent coordinate calculation
      const point = screenToSVGPoint(e.clientX, e.clientY);

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
        let deltaX = point.x - resizeStart.startX;
        let deltaY = point.y - resizeStart.startY;

        // Shift key constraint: only horizontal or vertical movement
        if (e.shiftKey) {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            deltaY = 0; // Horizontal movement only
          } else {
            deltaX = 0; // Vertical movement only
          }
        }
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

  // Helper function to convert screen coordinates to SVG coordinates with zoom correction
  const screenToSVGPoint = (clientX: number, clientY: number): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    // Get SVG bounding rectangle (this will be larger when zoomed due to CSS transform)
    const rect = svg.getBoundingClientRect();

    // Calculate mouse position relative to SVG element
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // The key insight from asd.md: when zoomed, we need to adjust coordinates
    // Our CSS transform scales the container by 2x, so the SVG is visually 2x larger
    // but the viewBox remains 400x400, so we need to account for this scaling

    const scaleX = 400 / rect.width;   // Scale factor from DOM to SVG coordinates
    const scaleY = 400 / rect.height;

    // Convert DOM coordinates to SVG viewBox coordinates
    x = x * scaleX;
    y = y * scaleY;

    return { x, y };
  };

  // Drawing functions - Fixed coordinate calculation
  const getPointFromEvent = (e: React.MouseEvent): Point => {
    return screenToSVGPoint(e.clientX, e.clientY);
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

  

  const startDrawing = (e: React.MouseEvent) => {
    const point = getPointFromEvent(e);

    if (drawingTool === 'eyedropper') {
      // Use PipetteTool to sample color
      pipetteSampleColor(point, e);
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

        setSelectedElement(clickedElement as 'brand' | 'slogan' | 'icon');
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

    if (drawingTool === 'place') {
      // Place selected element at clicked position
      if (selectedElementToPlace) {
        switch (selectedElementToPlace) {
          case 'brand':
            if (logoElements.brand) {
              setLogoElements(prev => ({
                ...prev,
                brand: { ...prev.brand!, x: point.x, y: point.y }
              }));
            }
            break;
          case 'slogan':
            if (logoElements.slogan) {
              setLogoElements(prev => ({
                ...prev,
                slogan: { ...prev.slogan!, x: point.x, y: point.y }
              }));
            }
            break;
          case 'icon':
            if (logoElements.icon) {
              setLogoElements(prev => ({
                ...prev,
                icon: { ...prev.icon!, x: point.x, y: point.y }
              }));
            }
            break;
          case 'box':
            if (selectedBox) {
              setBoxes(prev => prev.map(box =>
                box.id === selectedBox
                  ? { ...box, x: point.x - box.width/2, y: point.y - box.height/2 }
                  : box
              ));
              console.log(`📍 Placed box ${selectedBox} at position:`, point);
            }
            break;
        }
        // Reset after placing
        setSelectedElementToPlace(null);
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
        type: 'box',
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        strokeColor: boxStrokeColor,
        fillColor: boxFillColor, // Use the selected fill color directly
        strokeWidth: boxStrokeWidth,
        strokeOpacity: boxStrokeOpacity / 10, // Convert 1-10 scale to 0-1 scale
        rotation: 0,
        selected: false,
        opacity: boxOpacity / 10, // Convert 1-10 scale to 0-1 scale (background opacity)
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
        layer.id === activeLayer
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
        layer.id === activeLayer
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
    // Reset all layers to their initial state
    setEditLayers([
      { id: 'layer-0', name: 'Original Background', visible: true, type: 'original', strokes: [], backgroundColor: 'transparent', order: 0 },
      { id: 'layer-1', name: 'Background Layer', visible: true, type: 'background', strokes: [], backgroundColor: 'transparent', order: 1 },
      { id: 'layer-2', name: 'Logo Layer', visible: true, type: 'logo', strokes: [], elements: [], order: 2 }
    ]);

    // Reset all drawing states
    setBoxes([]);
    setSelectedBox(null);
    setCurrentStroke(null);
    setCurrentLine(null);
    setCurrentBox(null);
    setIsDrawing(false);

    // Reset logo elements to their initial positions/properties
    setLogoElements(prev => {
      const resetElements = { ...prev };
      if (resetElements.brand) {
        resetElements.brand = {
          ...resetElements.brand,
          x: 200,
          y: 190,
          rotation: 0,
          opacity: 1,
          permanent: false
        };
      }
      if (resetElements.slogan) {
        resetElements.slogan = {
          ...resetElements.slogan,
          x: 200,
          y: 215,
          rotation: 0,
          opacity: 1,
          permanent: false
        };
      }
      if (resetElements.icon) {
        resetElements.icon = {
          ...resetElements.icon,
          x: 200,
          y: 160,
          rotation: 0,
          opacity: 1,
          permanent: false
        };
      }
      return resetElements;
    });

    console.log('🧹 All layers and elements cleared and reset to initial state');
  };

  const undoLastStroke = () => {
    setEditLayers(prev => prev.map(layer =>
      layer.id === activeLayer
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
        viewBox="0 0 400 400"
        style={{ zIndex: 10 }}
      >
        {/* Render background layers first - but exclude gradients as they're handled by HTML div */}
        {editLayers
          .filter(layer =>
            layer.visible &&
            (layer.type === 'background' || layer.type === 'original') &&
            layer.backgroundColor &&
            layer.backgroundColor !== 'transparent' &&
            !layer.backgroundColor.includes('linear-gradient')
          )
          .sort((a, b) => a.order - b.order) // Sort by order, lowest first (bottom layer first)
          .map(layer => (
            <rect
              key={`bg-${layer.id}`}
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill={layer.backgroundColor}
            />
          ))}

        {/* Render existing strokes */}
        {editLayers
          .sort((a, b) => a.order - b.order) // Sort by order, lowest first
          .map(layer =>
          layer.visible && layer.strokes.map(stroke => {
            if ((stroke.tool === 'box' || stroke.tool === 'box-fill' || stroke.tool === 'box-border') && stroke.rect) {
              const centerX = stroke.rect.x + stroke.rect.width / 2;
              const centerY = stroke.rect.y + stroke.rect.height / 2;
              const rotation = stroke.rotation || 0;

              if (stroke.tool === 'box-fill') {
                // Fill only - no border
                return (
                  <rect
                    key={stroke.id}
                    x={stroke.rect.x}
                    y={stroke.rect.y}
                    width={stroke.rect.width}
                    height={stroke.rect.height}
                    fill={stroke.color}
                    stroke="none"
                    opacity={stroke.opacity}
                    transform={`rotate(${rotation} ${centerX} ${centerY})`}
                  />
                );
              } else if (stroke.tool === 'box-border') {
                // Border only - no fill
                return (
                  <rect
                    key={stroke.id}
                    x={stroke.rect.x}
                    y={stroke.rect.y}
                    width={stroke.rect.width}
                    height={stroke.rect.height}
                    fill="none"
                    stroke={stroke.color}
                    strokeWidth={stroke.width}
                    opacity={stroke.opacity}
                    transform={`rotate(${rotation} ${centerX} ${centerY})`}
                  />
                );
              } else {
                // Original box behavior - check if it has separate stroke properties
                const hasStrokeProps = stroke.strokeColor && stroke.strokeOpacity !== undefined;

                return (
                  <rect
                    key={stroke.id}
                    x={stroke.rect.x}
                    y={stroke.rect.y}
                    width={stroke.rect.width}
                    height={stroke.rect.height}
                    fill={stroke.color}
                    fillOpacity={stroke.opacity}
                    stroke={hasStrokeProps ? stroke.strokeColor : stroke.color}
                    strokeWidth={stroke.width}
                    strokeOpacity={hasStrokeProps ? stroke.strokeOpacity : stroke.opacity}
                    transform={`rotate(${rotation} ${centerX} ${centerY})`}
                  />
                );
              }
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
            } else if (stroke.tool === 'text' && stroke.points.length >= 1) {
              return (
                <text
                  key={stroke.id}
                  x={stroke.points[0].x}
                  y={stroke.points[0].y}
                  textAnchor={stroke.textAlign === 'left' ? 'start' : stroke.textAlign === 'right' ? 'end' : 'middle'}
                  dominantBaseline="middle"
                  fontSize={stroke.fontSize || 16}
                  fontFamily={stroke.fontFamily || 'Inter, sans-serif'}
                  fontWeight={stroke.fontWeight || 400}
                  fill={stroke.color}
                  transform={`rotate(${stroke.rotation || 0} ${stroke.points[0].x} ${stroke.points[0].y})`}
                  opacity={stroke.opacity}
                  style={{ pointerEvents: 'all', userSelect: 'none' }}
                >
                  {stroke.text || ''}
                </text>
              );
            } else if (stroke.tool === 'icon' && stroke.points.length >= 1 && stroke.iconComponent) {
              return (
                <g
                  key={stroke.id}
                  transform={`translate(${stroke.points[0].x - (stroke.iconSize || 24)/2}, ${stroke.points[0].y - (stroke.iconSize || 24)/2}) rotate(${stroke.rotation || 0} ${(stroke.iconSize || 24)/2} ${(stroke.iconSize || 24)/2})`}
                  opacity={stroke.opacity}
                  style={{ pointerEvents: 'all' }}
                >
                  <foreignObject
                    width={stroke.iconSize || 24}
                    height={stroke.iconSize || 24}
                    style={{ overflow: 'visible' }}
                  >
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <stroke.iconComponent
                        size={stroke.iconSize || 24}
                        color={stroke.color}
                      />
                    </div>
                  </foreignObject>
                </g>
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

        {/* Render elements from layers */}
        {editLayers
          .filter(layer => layer.visible && layer.type === 'elements' && layer.elements)
          .sort((a, b) => a.order - b.order)
          .map(layer =>
            layer.elements!.map(element => {
              if (element.type === 'brand' || element.type === 'slogan') {
                const textElement = element as TextElement;
                return (
                  <text
                    key={textElement.id}
                    x={textElement.x}
                    y={textElement.y}
                    textAnchor={textElement.textAlign === 'left' ? 'start' : textElement.textAlign === 'right' ? 'end' : 'middle'}
                    dominantBaseline="middle"
                    fontSize={textElement.fontSize}
                    fontFamily={textElement.fontFamily}
                    fontWeight={textElement.fontWeight}
                    fill={textElement.color}
                    transform={`rotate(${textElement.rotation} ${textElement.x} ${textElement.y})`}
                    opacity={textElement.opacity}
                    style={{ pointerEvents: 'all', userSelect: 'none' }}
                  >
                    {textElement.text}
                  </text>
                );
              } else if (element.type === 'icon') {
                const iconElement = element as IconElement;
                return (
                  <g
                    key={iconElement.id}
                    transform={`translate(${iconElement.x - iconElement.size/2}, ${iconElement.y - iconElement.size/2}) rotate(${iconElement.rotation} ${iconElement.size/2} ${iconElement.size/2})`}
                    opacity={iconElement.opacity}
                    style={{ pointerEvents: 'all' }}
                  >
                    <foreignObject
                      width={iconElement.size}
                      height={iconElement.size}
                      style={{ overflow: 'visible' }}
                    >
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <iconElement.icon
                          size={iconElement.size}
                          color={iconElement.color}
                        />
                      </div>
                    </foreignObject>
                  </g>
                );
              }
              return null;
            })
          )
        }

        {/* Render boxes */}
        {boxes.map(box => (
          <g key={box.id} transform={`rotate(${box.rotation} ${box.x + box.width/2} ${box.y + box.height/2})`}>
            <rect
              x={box.x}
              y={box.y}
              width={Math.abs(box.width)}
              height={Math.abs(box.height)}
              fill={box.fillColor === 'transparent' ? 'none' : box.fillColor}
              fillOpacity={box.opacity}
              stroke={box.strokeColor}
              strokeWidth={box.strokeWidth || 1}
              strokeOpacity={box.strokeOpacity || 1}
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
                const startPoint = screenToSVGPoint(e.clientX, e.clientY);
                setMoveStart({
                  startX: startPoint.x,
                  startY: startPoint.y,
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
                    const startPoint = screenToSVGPoint(e.clientX, e.clientY);
                    setResizeStart({
                      startX: startPoint.x,
                      startY: startPoint.y,
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
                    const startPoint = screenToSVGPoint(e.clientX, e.clientY);
                    setResizeStart({
                      startX: startPoint.x,
                      startY: startPoint.y,
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
                    const startPoint = screenToSVGPoint(e.clientX, e.clientY);
                    setResizeStart({
                      startX: startPoint.x,
                      startY: startPoint.y,
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
                    const startPoint = screenToSVGPoint(e.clientX, e.clientY);
                    setResizeStart({
                      startX: startPoint.x,
                      startY: startPoint.y,
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
                    
                    const point = screenToSVGPoint(e.clientX, e.clientY);
                    
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
            fillOpacity={currentBox.opacity}
            stroke={currentBox.strokeColor}
            strokeWidth={currentBox.strokeWidth || 1}
            strokeOpacity={currentBox.strokeOpacity || 1}
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

        {/* Render logo elements - controlled by Logo Layer visibility */}
        {logoElements.brand && editLayers.find(l => l.type === 'logo')?.visible && (
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

        {logoElements.slogan && editLayers.find(l => l.type === 'logo')?.visible && (
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

        {logoElements.icon && editLayers.find(l => l.type === 'logo')?.visible && (
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
            <div className="flex flex-col items-center text-center max-w-full px-2">
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
          <div className="flex items-center justify-center gap-2">
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
            <div className="flex flex-col items-center text-center w-full px-2">
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
    // Automatically switch to fullscreen mode
    setTimeout(() => {
      handleTrueFullscreen();
    }, 100);
  };

  const handleSave = () => {
    setShowSaveModal(true);
  };

  // Layer management functions
  const addCustomLayer = (name: string = 'New Layer') => {
    const newId = `layer-${Date.now()}`;
    const maxOrder = Math.max(...editLayers.map(l => l.order));
    const newLayer: EditLayer = {
      id: newId,
      name: name,
      visible: true,
      type: 'custom',
      strokes: [],
      elements: [],
      order: maxOrder + 1
    };

    setEditLayers(prev => [...prev, newLayer]);
    setActiveLayer(newId);
  };

  const deleteLayer = (layerId: string) => {
    if (editLayers.length <= 1) return; // Don't delete if it's the only layer

    setEditLayers(prev => prev.filter(layer => layer.id !== layerId));

    // If we're deleting the active layer, switch to another layer
    if (activeLayer === layerId) {
      const remainingLayers = editLayers.filter(layer => layer.id !== layerId);
      setActiveLayer(remainingLayers[0]?.id || '');
    }
  };

  const moveLayerUp = (layerId: string) => {
    setEditLayers(prev => {
      const layer = prev.find(l => l.id === layerId);
      if (!layer) return prev;

      const layersAbove = prev.filter(l => l.order > layer.order);
      if (layersAbove.length === 0) return prev; // Already at top

      const nextLayer = layersAbove.reduce((min, l) => l.order < min.order ? l : min);

      return prev.map(l => {
        if (l.id === layerId) return { ...l, order: nextLayer.order };
        if (l.id === nextLayer.id) return { ...l, order: layer.order };
        return l;
      });
    });
  };

  const moveLayerDown = (layerId: string) => {
    setEditLayers(prev => {
      const layer = prev.find(l => l.id === layerId);
      if (!layer) return prev;

      const layersBelow = prev.filter(l => l.order < layer.order);
      if (layersBelow.length === 0) return prev; // Already at bottom

      const nextLayer = layersBelow.reduce((max, l) => l.order > max.order ? l : max);

      return prev.map(l => {
        if (l.id === layerId) return { ...l, order: nextLayer.order };
        if (l.id === nextLayer.id) return { ...l, order: layer.order };
        return l;
      });
    });
  };

  const updateLayerBackgroundColor = (layerId: string, color: string) => {
    setEditLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, backgroundColor: color } : layer
    ));
  };


  // Initialize elements when the fullscreen editor is opened or variation changes
  useEffect(() => {
    if (showFullscreenEditor) {
      // Use current editLayers state directly
      const elementsLayer = editLayers.find(l => l.type === 'elements');
      const backgroundLayer = editLayers.find(l => l.type === 'background');

      if (!elementsLayer) {
        return;
      }

      const elements: (TextElement | IconElement)[] = [];

      // Get colors from variation or fallback to palette/defaults
      const brandNameColor = variation?.brandNameColor || localConfig.palette?.colors[1] || '#000000';
      const sloganColor = variation?.sloganColor || localConfig.palette?.colors[1] || '#000000';
      const iconColor = variation?.iconColor || localConfig.palette?.colors[1] || '#000000';

      // Add brand text element - center it properly in the canvas (384px is typical max-w-2xl width)
      if (localConfig.text) {
        const brandElement: TextElement = {
          id: 'brand-text',
          type: 'brand',
          text: localConfig.text,
          x: 192, // Center of typical 384px canvas
          y: 160, // Center Y position
          fontSize: 28,
          fontFamily: localConfig.font?.name || 'Inter, sans-serif',
          fontWeight: localConfig.fontWeight || 700,
          color: brandNameColor,
          selected: false,
          permanent: false,
          rotation: 0,
          textAlign: 'center',
          opacity: 1.0
        };
        elements.push(brandElement);
      }

      // Add slogan text element
      if (localConfig.slogan) {
        const sloganElement: TextElement = {
          id: 'slogan-text',
          type: 'slogan',
          text: localConfig.slogan,
          x: 192, // Center in canvas
          y: 200, // Below brand text
          fontSize: 14,
          fontFamily: localConfig.font?.name || 'Inter, sans-serif',
          fontWeight: 400,
          color: sloganColor,
          selected: false,
          permanent: false,
          rotation: 0,
          textAlign: 'center',
          opacity: 0.8
        };
        elements.push(sloganElement);
      }

      // Add icon element
      if (localConfig.icon) {
        const iconElement: IconElement = {
          id: 'logo-icon',
          type: 'icon',
          icon: localConfig.icon.component,
          x: 120, // Left of center
          y: 170, // Center Y
          size: 40,
          color: iconColor,
          selected: false,
          permanent: false,
          rotation: 0,
          opacity: 1.0
        };
        elements.push(iconElement);
      }

      // Update the layers
      setEditLayers(prev => prev.map(layer => {
        if (layer.id === elementsLayer.id) {
          return { ...layer, elements };
        }
        // Also update background layer with variation background color
        if (layer.id === backgroundLayer?.id && variation?.backgroundColor) {
          return { ...layer, backgroundColor: variation.backgroundColor };
        }
        return layer;
      }));
    }
  }, [showFullscreenEditor, variation, localConfig]);

  const handleTrueFullscreen = () => {
    setIsTrueFullscreen(true);
    // Use HTML5 Fullscreen API
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  };

  const handleExitFullscreen = () => {
    setIsTrueFullscreen(false);
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).msFullscreenElement);
      setIsTrueFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

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
      {/* Permanent Fullscreen Button - Top Left */}
      <div className="absolute top-2 left-2 z-20">
        <button
          onClick={() => setShowFullscreenEditor(true)}
          className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-200 hover:scale-105"
          title="Open Fullscreen Editor"
        >
          <Maximize size={16} />
        </button>
      </div>

      {/* Menu Panel - slides up from bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/20 rounded-b-lg p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl">
        <div className="flex gap-1 justify-center">
          <button
            onClick={handleEdit}
            className="flex items-center justify-center gap-1 px-1.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors flex-1"
          >
            <Edit size={12} /> Edit
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-1 px-1.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors flex-1"
          >
            <Save size={12} /> Save
          </button>
          <button
            onClick={handlePurchase}
            className="flex items-center justify-center gap-1 px-1.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors flex-1"
          >
            <ShoppingCart size={12} /> Buy
          </button>
        </div>
      </div>

      {/* Fullscreen Editor Modal */}
      {showFullscreenEditor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2">
          <div className={`bg-gray-900 w-full h-full flex ${
            isTrueFullscreen ? 'rounded-none max-w-none max-h-none' : 'rounded-lg max-w-6xl max-h-[90vh]'
          }`}>
            {/* Logo Preview Side with Drawing Canvas */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center border-r border-white/20">
              {/* Zoom and View Controls */}
              <ZoomViewControls
                isZoomed={isZoomed}
                setIsZoomed={setIsZoomed}
                isTrueFullscreen={isTrueFullscreen}
                handleTrueFullscreen={handleTrueFullscreen}
                handleExitFullscreen={handleExitFullscreen}
                onCloseEditor={() => setShowFullscreenEditor(false)}
                showCloseButton={!isTrueFullscreen}
              />

              <div
                className={`relative rounded-lg max-w-2xl w-full aspect-square transition-transform duration-300 ${
                  isZoomed ? 'transform scale-[2] origin-center' : ''
                }`}
                style={{
                  transformOrigin: 'center center'
                }}
              >
                {/* Original Background Layer (deepest layer) */}
                {editLayers.find(l => l.type === 'original')?.backgroundColor?.includes('linear-gradient') && (
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      backgroundImage: editLayers.find(l => l.type === 'original')?.backgroundColor || '',
                      zIndex: 0
                    }}
                  />
                )}

                {/* Gradient Background Layer (deeper layer, unaffected by eraser) */}
                {((variation?.backgroundColor?.includes('linear-gradient')) ||
                  (editLayers.find(l => l.type === 'background')?.backgroundColor?.includes('linear-gradient'))) && (
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      backgroundImage: variation?.backgroundColor?.includes('linear-gradient')
                        ? variation.backgroundColor
                        : editLayers.find(l => l.type === 'background')?.backgroundColor || '',
                      zIndex: 1
                    }}
                  />
                )}
                
                <div
                  className="relative rounded-lg p-12 w-full aspect-square flex items-center justify-center"
                  key={`logo-preview-${currentFontWeight}-${fontWeightUpdateKey}-${forceRender}-${localConfig.text}-${localConfig.font?.name}`}
                  style={{
                    zIndex: 2,
                    // Für Gradienten: Transparent bleiben, damit der Gradient darunter sichtbar ist
                    // Für normale Farben: Hintergrundfarbe setzen
                    backgroundColor: (variation?.backgroundColor?.includes('linear-gradient') ||
                                     editLayers.find(l => l.type === 'background')?.backgroundColor?.includes('linear-gradient') ||
                                     editLayers.find(l => l.type === 'original')?.backgroundColor?.includes('linear-gradient'))
                      ? 'transparent'
                      : (variation?.backgroundColor || editLayers.find(l => l.type === 'background')?.backgroundColor || editLayers.find(l => l.type === 'original')?.backgroundColor || 'transparent')
                  }}
                >
                
                {/* Drawing Canvas Overlay */}
                <div
                  ref={canvasRef}
                  className={`absolute inset-0 rounded-lg ${(drawingTool === 'brush' || drawingTool === 'eraser' || drawingTool === 'line') ? 'cursor-none' : drawingTool === 'eyedropper' ? 'cursor-crosshair' : drawingTool === 'move' ? 'cursor-move' : drawingTool === 'place' ? 'cursor-pointer' : 'cursor-crosshair'}`}
                  style={{
                    cursor: (drawingTool === 'brush' || drawingTool === 'eraser' || drawingTool === 'line') && !isZoomed ? 'none' :
                            isZoomed && drawingTool === 'brush' ?
                            `url("data:image/svg+xml,%3Csvg width='${Math.max((brushSize * 2 + 4) * 1.75 * 2 * 0.92, 64)}' height='${Math.max((brushSize * 2 + 4) * 1.75 * 2 * 0.92, 64)}' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)}' cy='${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)}' r='${Math.max((brushSize/2 + 1) * 1.75 * 2 * 0.92, 16)}' fill='rgba(255,255,255,0.3)' stroke='%23ff6b6b' stroke-width='2.5'/%3E%3Ccircle cx='${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)}' cy='${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)}' r='2' fill='white'/%3E%3C/svg%3E") ${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)} ${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)}, crosshair` :
                            isZoomed && drawingTool === 'eraser' ?
                            `url("data:image/svg+xml,%3Csvg width='${Math.max((brushSize * 2 + 4) * 1.75 * 2 * 0.92, 64)}' height='${Math.max((brushSize * 2 + 4) * 1.75 * 2 * 0.92, 64)}' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)}' cy='${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)}' r='${Math.max((brushSize/2 + 1) * 1.75 * 2 * 0.92, 16)}' fill='rgba(255,255,255,0.3)' stroke='%23ff6b6b' stroke-width='2.5'/%3E%3Ccircle cx='${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)}' cy='${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)}' r='2' fill='white'/%3E%3C/svg%3E") ${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)} ${Math.max((brushSize + 2) * 1.75 * 2 * 0.92, 32)}, crosshair` :
                            isZoomed && drawingTool === 'line' ?
                            `url("data:image/svg+xml,%3Csvg width='${Math.max((lineWidth * 2 + 4) * 1.75 * 2 * 0.92, 64)}' height='${Math.max((lineWidth * 2 + 4) * 1.75 * 2 * 0.92, 64)}' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='${Math.max((lineWidth + 2) * 1.75 * 2 * 0.92, 32)}' cy='${Math.max((lineWidth + 2) * 1.75 * 2 * 0.92, 32)}' r='${Math.max((lineWidth/2 + 1) * 1.75 * 2 * 0.92, 16)}' fill='rgba(255,165,0,0.2)' stroke='orange' stroke-width='3'/%3E%3Ccircle cx='${Math.max((lineWidth + 2) * 1.75 * 2 * 0.92, 32)}' cy='${Math.max((lineWidth + 2) * 1.75 * 2 * 0.92, 32)}' r='2' fill='white'/%3E%3C/svg%3E") ${Math.max((lineWidth + 2) * 1.75 * 2 * 0.92, 32)} ${Math.max((lineWidth + 2) * 1.75 * 2 * 0.92, 32)}, crosshair` :
                            isZoomed && drawingTool === 'eyedropper' ? `url("data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='2' fill='white' stroke='black' stroke-width='1'/%3E%3C/svg%3E") 16 16, crosshair` :
                            isZoomed && drawingTool === 'move' ? 'move' :
                            drawingTool === 'eyedropper' ? 'crosshair' :
                            drawingTool === 'move' ? 'move' :
                            drawingTool === 'place' ? 'pointer' : 'crosshair'
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={(e) => {
                    // Update cursor position for custom cursor display
                    // Nur bei nicht-gezoomten Brush/Eraser Tools
                    if (!isZoomed && (drawingTool === 'brush' || drawingTool === 'eraser' || drawingTool === 'line')) {
                      const rect = canvasRef.current?.getBoundingClientRect();
                      if (rect) {
                        setCursorPosition({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top
                        });
                      }
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
                   drawingTool === 'place' ? `📍 Place Here` :
                   '✏️ Drawing'}
                  {isZoomed && <span className="ml-2 text-blue-400">2x</span>}
                </div>

                {/* Custom Cursor Overlay - nur zeigen wenn NICHT gezoomt */}
                {cursorPosition && (drawingTool === 'brush' || drawingTool === 'eraser' || drawingTool === 'line') && !isZoomed && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: cursorPosition.x,
                      top: cursorPosition.y,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1000
                    }}
                  >
                    <div
                      className={`border-2 border-white shadow-lg ${
                        (drawingTool === 'brush' && brushLineCap === 'square') ||
                        (drawingTool === 'eraser' && brushLineCap === 'square') ||
                        (drawingTool === 'line' && lineCap === 'square')
                          ? 'rounded-none' : 'rounded-full'
                      } ${
                        drawingTool === 'brush' ? 'bg-white/30' :
                        drawingTool === 'eraser' ? 'bg-white/30' :
                        drawingTool === 'line' ? 'bg-orange-500/20' : 'bg-blue-500/30'
                      }`}
                      style={{
                        width: `${(drawingTool === 'line' ? lineWidth : brushSize) * 1.75}px`,
                        height: `${(drawingTool === 'line' ? lineWidth : brushSize) * 1.75}px`,
                        borderColor: drawingTool === 'eraser' ? '#ff6b6b' :
                                   drawingTool === 'brush' ? '#ff6b6b' :
                                   drawingTool === 'line' ? 'orange' : '#000'
                      }}
                    />
                    {/* Center dot */}
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
                      style={{
                        width: `2px`,
                        height: `2px`,
                        boxShadow: '0 0 2px black'
                      }}
                    />
                  </div>
                )}

                </div>
              </div>
            </div>

            {/* Editor Controls Side */}
            <div className="w-[30vw] p-6 overflow-y-auto bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-white font-bold text-2xl mb-1">Edit Logo</h3>
                  <p className="text-white/60 text-sm">Professional editing tools</p>
                </div>
                <button
                  onClick={() => setShowFullscreenEditor(false)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  title="Close Editor"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-4 h-full">
                {/* LEFT PANEL (70%) */}
                <div className="flex-1 space-y-6 overflow-y-auto">
                {/* Drawing Tools Section */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                  <h4 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
                    <Brush size={16} className="text-blue-400" />
                    Drawing Tools
                  </h4>

                  {/* Tool Selection Grid Layout */}
                  <div className="grid grid-cols-4 gap-3">
                    {/* Tool Icons - Left Column (1/4 width) */}
                    <div className="col-span-1 grid grid-cols-1 gap-1">
                      <button
                        onClick={() => setDrawingTool('brush')}
                        className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
                          drawingTool === 'brush' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        <Brush size={14} />
                      </button>
                      <button
                        onClick={() => setDrawingTool('eraser')}
                        className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
                          drawingTool === 'eraser' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        <Eraser size={14} />
                      </button>
                      <button
                        onClick={() => setDrawingTool('box')}
                        className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
                          drawingTool === 'box' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        <Square size={14} />
                      </button>
                      <button
                        onClick={() => setDrawingTool('line')}
                        className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
                          drawingTool === 'line' ? 'bg-orange-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        📏
                      </button>
                      <button
                        onClick={() => setDrawingTool('eyedropper')}
                        className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
                          drawingTool === 'eyedropper' ? 'bg-teal-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        <Pipette size={14} />
                      </button>
                      <button
                        onClick={() => setDrawingTool('move')}
                        className={`flex items-center justify-center p-2 rounded text-xs transition-colors mb-4 ${
                          drawingTool === 'move' ? 'bg-green-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        <Move size={14} />
                      </button>
                    </div>

                    {/* Tool Settings - Right Column (2/4 width) */}
                    <div className="col-span-2 space-y-3">
                      {/* Brush/Eraser Settings */}
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
                                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                              />
                              <span className="text-white/50 text-xs">{brushColor}</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">
                              Size: {brushSize}px
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="50"
                              value={brushSize}
                              onChange={(e) => setBrushSize(parseInt(e.target.value))}
                              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">
                              Opacity: {drawingTool === 'brush' ? brushOpacity : eraserOpacity}/10
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
                              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </>
                      )}

                      {/* Line Settings */}
                      {drawingTool === 'line' && (
                        <>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Line Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={lineColor}
                                onChange={(e) => setLineColor(e.target.value)}
                                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                              />
                              <span className="text-white/50 text-xs">{lineColor}</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Width: {lineWidth}px</label>
                            <input
                              type="range"
                              min="1"
                              max="20"
                              value={lineWidth}
                              onChange={(e) => setLineWidth(parseInt(e.target.value))}
                              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </>
                      )}

                      {/* Box Settings */}
                      {drawingTool === 'box' && (
                        <>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Fill Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={boxFillColor}
                                onChange={(e) => setBoxFillColor(e.target.value)}
                                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                              />
                              <span className="text-white/50 text-xs">{boxFillColor}</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Stroke Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={boxStrokeColor}
                                onChange={(e) => setBoxStrokeColor(e.target.value)}
                                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                              />
                              <span className="text-white/50 text-xs">{boxStrokeColor}</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Stroke Width: {boxStrokeWidth}px</label>
                            <input
                              type="range"
                              min="1"
                              max="20"
                              value={boxStrokeWidth}
                              onChange={(e) => setBoxStrokeWidth(parseInt(e.target.value))}
                              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Stroke Opacity: {boxStrokeOpacity}/10</label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={boxStrokeOpacity}
                              onChange={(e) => setBoxStrokeOpacity(parseInt(e.target.value))}
                              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Fill Opacity: {boxOpacity}/10</label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={boxOpacity}
                              onChange={(e) => setBoxOpacity(parseInt(e.target.value))}
                              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </>
                      )}

                      {/* Eyedropper Settings */}
                      {drawingTool === 'eyedropper' && sampledColor && (
                        <>
                          <div>
                            <label className="block text-white/80 text-sm mb-2">Sampled Color</label>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded border border-white/20"
                                style={{ backgroundColor: sampledColor }}
                              />
                              <div className="flex-1">
                                <code className="text-white text-sm">{sampledColor}</code>
                                <div className="flex gap-1 mt-1">
                                  <button
                                    onClick={() => navigator.clipboard.writeText(sampledColor)}
                                    className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs"
                                  >
                                    Copy
                                  </button>
                                  <button
                                    onClick={() => setBrushColor(sampledColor)}
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                                  >
                                    Use
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>


                  {/* Background Color Selector - Show when background or original layer is selected */}
                  {(editLayers.find(l => l.id === activeLayer)?.type === 'background' || editLayers.find(l => l.id === activeLayer)?.type === 'original') && (
                    <div className="bg-white/5 rounded-xl mb-6 overflow-hidden border border-white/10 w-full">
                      <div className="flex items-center gap-2 px-2 py-3 border-b border-white/10">
                        <Palette className="w-4 h-4 text-white" />
                        <span className="font-semibold text-white">Background Color</span>
                      </div>
                      <div className="p-2">
                        {(() => {
                          const currentBg = editLayers.find(l => l.id === activeLayer)?.backgroundColor || '#ffffff';
                          const isGradient = currentBg.includes('linear-gradient');

                          // Extract colors and direction from gradient if present
                          let gradientColor1 = '#ff6b6b';
                          let gradientColor2 = '#4ecdc4';
                          let gradientColor3 = '#a855f7';
                          let gradientDirection = 135;
                          let use3Colors = false;
                          let solidColor = '#ffffff';

                          if (isGradient) {
                            // Extract direction
                            const directionMatch = currentBg.match(/linear-gradient\((\d+)deg/);
                            if (directionMatch) {
                              gradientDirection = parseInt(directionMatch[1]);
                            }

                            // Extract colors
                            const matches = currentBg.match(/#[0-9a-f]{6}/gi);
                            if (matches) {
                              if (matches.length >= 2) {
                                gradientColor1 = matches[0];
                                gradientColor2 = matches[1];
                              }
                              if (matches.length >= 3) {
                                gradientColor3 = matches[2];
                                use3Colors = true;
                              }
                            }
                          } else {
                            solidColor = currentBg;
                          }

                          return (
                            <div>
                              {/* Background Type Selector */}
                              <div className="flex gap-2 mb-4">
                                <button
                                  onClick={() => updateLayerBackgroundColor(activeLayer, solidColor)}
                                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                                    !isGradient
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                                  }`}
                                >
                                  Solid Color
                                </button>
                                <button
                                  onClick={() => updateLayerBackgroundColor(activeLayer, `linear-gradient(${gradientDirection}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`)}
                                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                                    isGradient
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                                  }`}
                                >
                                  Gradient
                                </button>
                              </div>

                              {/* Gradient Controls */}
                              {isGradient ? (
                                <div className="space-y-4">
                                  {/* Gradient Direction */}
                                  <div className="flex items-center gap-1">
                                    <span className="text-white/70 text-sm w-20">Direction:</span>
                                    <input
                                      type="range"
                                      min="0"
                                      max="360"
                                      value={gradientDirection}
                                      onChange={(e) => {
                                        const newDirection = parseInt(e.target.value);
                                        const gradientStr = use3Colors
                                          ? `linear-gradient(${newDirection}deg, ${gradientColor1} 0%, ${gradientColor2} 50%, ${gradientColor3} 100%)`
                                          : `linear-gradient(${newDirection}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`;
                                        updateLayerBackgroundColor(activeLayer, gradientStr);
                                      }}
                                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-white/70 text-sm w-12">{gradientDirection}°</span>
                                  </div>

                                  {/* 3-Color Toggle */}
                                  <div className="flex items-center gap-1">
                                    <span className="text-white/70 text-sm w-20">Colors:</span>
                                    <button
                                      onClick={() => {
                                        const gradientStr = use3Colors
                                          ? `linear-gradient(${gradientDirection}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`
                                          : `linear-gradient(${gradientDirection}deg, ${gradientColor1} 0%, ${gradientColor2} 50%, ${gradientColor3} 100%)`;
                                        updateLayerBackgroundColor(activeLayer, gradientStr);
                                      }}
                                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                        use3Colors
                                          ? 'bg-purple-600 text-white'
                                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                                      }`}
                                    >
                                      {use3Colors ? '3 Colors' : '2 Colors'}
                                    </button>
                                  </div>

                                  {/* Color Controls */}
                                  <div className="flex items-center gap-1">
                                    <span className="text-white/70 text-sm w-20">Color 1:</span>
                                    <input
                                      type="color"
                                      value={gradientColor1}
                                      onChange={(e) => {
                                        const gradientStr = use3Colors
                                          ? `linear-gradient(${gradientDirection}deg, ${e.target.value} 0%, ${gradientColor2} 50%, ${gradientColor3} 100%)`
                                          : `linear-gradient(${gradientDirection}deg, ${e.target.value} 0%, ${gradientColor2} 100%)`;
                                        updateLayerBackgroundColor(activeLayer, gradientStr);
                                      }}
                                      className="flex-1 h-10 rounded border border-white/20 bg-transparent"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-white/70 text-sm w-20">Color 2:</span>
                                    <input
                                      type="color"
                                      value={gradientColor2}
                                      onChange={(e) => {
                                        const gradientStr = use3Colors
                                          ? `linear-gradient(${gradientDirection}deg, ${gradientColor1} 0%, ${e.target.value} 50%, ${gradientColor3} 100%)`
                                          : `linear-gradient(${gradientDirection}deg, ${gradientColor1} 0%, ${e.target.value} 100%)`;
                                        updateLayerBackgroundColor(activeLayer, gradientStr);
                                      }}
                                      className="flex-1 h-10 rounded border border-white/20 bg-transparent"
                                    />
                                  </div>
                                  {use3Colors && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-white/70 text-sm w-20">Color 3:</span>
                                      <input
                                        type="color"
                                        value={gradientColor3}
                                        onChange={(e) => {
                                          const gradientStr = `linear-gradient(${gradientDirection}deg, ${gradientColor1} 0%, ${gradientColor2} 50%, ${e.target.value} 100%)`;
                                          updateLayerBackgroundColor(activeLayer, gradientStr);
                                        }}
                                        className="flex-1 h-10 rounded border border-white/20 bg-transparent"
                                      />
                                    </div>
                                  )}

                                  {/* Gradient Presets */}
                                  <div>
                                    <span className="text-white/70 text-sm block mb-2">Gradient Presets:</span>
                                    <div className="grid grid-cols-2 gap-2 w-full">
                                      {[
                                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                                      ].map((gradient, i) => (
                                        <button
                                          key={i}
                                          onClick={() => updateLayerBackgroundColor(activeLayer, gradient)}
                                          className="w-full h-8 rounded border border-white/20 hover:border-white/40 transition-colors"
                                          style={{ backgroundImage: gradient }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  {/* Solid Color Picker */}
                                  <input
                                    type="color"
                                    value={solidColor}
                                    onChange={(e) => updateLayerBackgroundColor(activeLayer, e.target.value)}
                                    className="w-full h-12 rounded-lg border border-white/20 bg-transparent"
                                  />
                                  <div className="mt-3 grid grid-cols-3 gap-2">
                                    {['#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#111827', '#000000'].map(color => (
                                      <button
                                        key={color}
                                        onClick={() => updateLayerBackgroundColor(activeLayer, color)}
                                        className="w-8 h-8 rounded border-2 border-white/20 hover:border-white/40 transition-colors"
                                        style={{ backgroundColor: color }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Transparent Option */}
                              <button
                                onClick={() => updateLayerBackgroundColor(activeLayer, 'transparent')}
                                className="w-full mt-3 px-3 py-2 bg-white/10 hover:bg-white/20 text-white/70 rounded text-sm transition-colors border border-white/20"
                              >
                                Transparent Background
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}


                  {/* Place Tool Settings */}
                  {drawingTool === 'place' && (
                    <div className="bg-white/10 rounded p-1 mb-4">
                      <label className="block text-white/80 text-sm mb-2">Select Element to Place</label>
                      <p className="text-white/60 text-xs mb-3">Wähle ein Element aus und klicke dann im Logo, um es zu positionieren</p>

                      <div className="grid grid-cols-1 gap-2 w-full">
                        {logoElements.brand && (
                          <button
                            onClick={() => setSelectedElementToPlace('brand')}
                            className={`px-3 py-2 rounded text-sm transition-colors ${
                              selectedElementToPlace === 'brand'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            📝 Brand Name
                          </button>
                        )}
                        {logoElements.slogan && (
                          <button
                            onClick={() => setSelectedElementToPlace('slogan')}
                            className={`px-3 py-2 rounded text-sm transition-colors ${
                              selectedElementToPlace === 'slogan'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            💬 Slogan
                          </button>
                        )}
                        {logoElements.icon && (
                          <button
                            onClick={() => setSelectedElementToPlace('icon')}
                            className={`px-3 py-2 rounded text-sm transition-colors ${
                              selectedElementToPlace === 'icon'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            🎯 Icon
                          </button>
                        )}
                        {/* Show all boxes */}
                        {boxes.length > 0 && (
                          <div className="col-span-2">
                            <label className="block text-white/80 text-xs mb-2">Available Boxes</label>
                            <div className="grid grid-cols-1 gap-1 w-full">
                              {boxes.map((box) => (
                                <button
                                  key={box.id}
                                  onClick={() => {
                                    setSelectedElementToPlace('box');
                                    setSelectedBox(box.id);
                                  }}
                                  className={`px-2 py-1 rounded text-xs transition-colors ${
                                    selectedElementToPlace === 'box' && selectedBox === box.id
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                                  }`}
                                >
                                  ⬜ Box {boxes.indexOf(box) + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {selectedElementToPlace && (
                        <div className="mt-3 p-2 bg-indigo-600/20 rounded border border-indigo-400/30">
                          <p className="text-indigo-300 text-xs">
                            📍 {selectedElementToPlace === 'brand' ? 'Brand Name' :
                                 selectedElementToPlace === 'slogan' ? 'Slogan' :
                                 selectedElementToPlace === 'icon' ? 'Icon' :
                                 selectedElementToPlace === 'box' ? `Box ${selectedBox ? boxes.findIndex(b => b.id === selectedBox) + 1 : ''}` : 'Element'} ausgewählt - Klicke im Logo um zu platzieren
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Move Tool Settings */}
                  {drawingTool === 'move' && (
                    <div className="bg-white/10 rounded p-1 mb-4">
                      <label className="block text-white/80 text-sm mb-2">Element Controls</label>

                      {/* Element Control Sliders - Just like Brush Tool */}
                      <div className="space-y-3 mb-4">
                        {/* Rotation Slider */}
                        <div>
                          <label className="block text-white/80 text-sm mb-1">
                            Rotation: {Math.round((logoElements[selectedElement as keyof typeof logoElements] as any)?.rotation || 0)}°
                          </label>
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
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Opacity Slider */}
                        <div>
                          <label className="block text-white/80 text-sm mb-1">
                            Opacity: {Math.round(((logoElements[selectedElement as keyof typeof logoElements] as any)?.opacity || 1) * 100)}%
                          </label>
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
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Size Slider - Icon only */}
                        {selectedElement === 'icon' && logoElements.icon && (
                          <div>
                            <label className="block text-white/80 text-sm mb-1">
                              Size: {logoElements.icon.size}px
                            </label>
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
                              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        )}

                        {/* Font Size Slider - Text elements only */}
                        {(selectedElement === 'brand' || selectedElement === 'slogan') && logoElements[selectedElement] && (
                          <div>
                            <label className="block text-white/80 text-sm mb-1">
                              Font Size: {(logoElements[selectedElement as keyof typeof logoElements] as TextElement)?.fontSize}px
                            </label>
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
                              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        )}

                        {/* Icon Color - Icon only */}
                        {selectedElement === 'icon' && logoElements.icon && (
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
                                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                              />
                              <span className="text-white/50 text-xs">{logoElements.icon.color}</span>
                            </div>
                          </div>
                        )}

                        {/* Text Color - Text elements only */}
                        {(selectedElement === 'brand' || selectedElement === 'slogan') && logoElements[selectedElement] && (
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
                                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                              />
                              <span className="text-white/50 text-xs">{(logoElements[selectedElement as keyof typeof logoElements] as TextElement)?.color}</span>
                            </div>
                          </div>
                        )}

                        {/* Text Alignment - Text elements only */}
                        {(selectedElement === 'brand' || selectedElement === 'slogan') && logoElements[selectedElement] && (
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
                                className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${
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
                                className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${
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
                                className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${
                                  (logoElements[selectedElement as keyof typeof logoElements] as TextElement)?.textAlign === 'right'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                Rechts
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

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

                      {/* Layout Positioning Buttons */}
                      <div className="mt-4 p-1 bg-black/20 rounded-lg">
                        <label className="block text-white/80 text-sm mb-3">Standard Layouts</label>

                        {/* Smart Element Selection */}
                        <div className="mb-3">
                          <span className="text-white/60 text-xs mb-2 block">Select Element:</span>
                          <button
                            onClick={() => {
                              // Smart selection: cycle through available elements
                              const availableElements = [];
                              if (logoElements.icon) availableElements.push('icon');
                              if (logoElements.brand) availableElements.push('brand');
                              if (logoElements.slogan) availableElements.push('slogan');

                              if (availableElements.length > 0) {
                                const currentIndex = availableElements.indexOf(selectedElement);
                                const nextIndex = (currentIndex + 1) % availableElements.length;
                                setSelectedElement(availableElements[nextIndex] as 'icon' | 'brand' | 'slogan');
                              }
                            }}
                            className={`w-full px-3 py-2 rounded text-xs transition-colors ${
                              selectedElement === 'icon' ? 'bg-blue-600 text-white' :
                              selectedElement === 'brand' ? 'bg-green-600 text-white' :
                              selectedElement === 'slogan' ? 'bg-purple-600 text-white' :
                              'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                          >
                            {selectedElement === 'icon' ? '🎯 Icon Selected' :
                             selectedElement === 'brand' ? '📝 Brand Selected' :
                             selectedElement === 'slogan' ? '💬 Slogan Selected' :
                             '👆 Select Element'}
                          </button>
                        </div>

                        {/* Universal Layout Buttons for Selected Element */}
                        <div className="mb-3">
                          <span className="text-white/60 text-xs mb-2 block">
                            Position {selectedElement === 'icon' ? 'Icon' : selectedElement === 'brand' ? 'Brand' : 'Slogan'}:
                          </span>
                          <div className="grid grid-cols-2 gap-2 w-full">
                            <button
                              onClick={() => {
                                if (!logoElements[selectedElement]) return;
                                setLogoElements(prev => ({
                                  ...prev,
                                  [selectedElement]: { ...prev[selectedElement], x: 120, y: 200 }
                                }));
                              }}
                              className={`px-3 py-2 rounded text-xs transition-colors ${
                                selectedElement === 'icon' ? 'bg-blue-600/80 hover:bg-blue-600' :
                                selectedElement === 'brand' ? 'bg-green-600/80 hover:bg-green-600' :
                                'bg-purple-600/80 hover:bg-purple-600'
                              } text-white`}
                            >
                              ← Links
                            </button>
                            <button
                              onClick={() => {
                                if (!logoElements[selectedElement]) return;
                                setLogoElements(prev => ({
                                  ...prev,
                                  [selectedElement]: { ...prev[selectedElement], x: 280, y: 200 }
                                }));
                              }}
                              className={`px-3 py-2 rounded text-xs transition-colors ${
                                selectedElement === 'icon' ? 'bg-blue-600/80 hover:bg-blue-600' :
                                selectedElement === 'brand' ? 'bg-green-600/80 hover:bg-green-600' :
                                'bg-purple-600/80 hover:bg-purple-600'
                              } text-white`}
                            >
                              Rechts →
                            </button>
                            <button
                              onClick={() => {
                                if (!logoElements[selectedElement]) return;
                                setLogoElements(prev => ({
                                  ...prev,
                                  [selectedElement]: { ...prev[selectedElement], x: 200, y: 120 }
                                }));
                              }}
                              className={`px-3 py-2 rounded text-xs transition-colors ${
                                selectedElement === 'icon' ? 'bg-blue-600/80 hover:bg-blue-600' :
                                selectedElement === 'brand' ? 'bg-green-600/80 hover:bg-green-600' :
                                'bg-purple-600/80 hover:bg-purple-600'
                              } text-white`}
                            >
                              ↑ Oben
                            </button>
                            <button
                              onClick={() => {
                                if (!logoElements[selectedElement]) return;
                                setLogoElements(prev => ({
                                  ...prev,
                                  [selectedElement]: { ...prev[selectedElement], x: 200, y: 280 }
                                }));
                              }}
                              className={`px-3 py-2 rounded text-xs transition-colors ${
                                selectedElement === 'icon' ? 'bg-blue-600/80 hover:bg-blue-600' :
                                selectedElement === 'brand' ? 'bg-green-600/80 hover:bg-green-600' :
                                'bg-purple-600/80 hover:bg-purple-600'
                              } text-white`}
                            >
                              ↓ Unten
                            </button>
                          </div>
                        </div>

                        {/* Layout Buttons */}
                        <div className="mt-3">
                          <span className="text-white/60 text-xs mb-2 block">Quick Layout:</span>
                          <div className="grid grid-cols-2 gap-2 w-full">
                            <button
                              onClick={() => {
                                // Text + Icon (horizontal) - brand centered, icon right
                                if (logoElements.brand && logoElements.icon) {
                                  setLogoElements(prev => {
                                    const newState = {
                                      ...prev,
                                      brand: prev.brand ? { ...prev.brand, x: 200, y: 200 } : undefined,
                                      icon: prev.icon ? { ...prev.icon, x: 280, y: 200 } : undefined
                                    };
                                    if (prev.slogan) {
                                      newState.slogan = { ...prev.slogan, x: 200, y: 225 };
                                    }
                                    return newState;
                                  });
                                }
                              }}
                              className="px-3 py-2 rounded text-xs transition-colors bg-gray-600/80 hover:bg-gray-600 text-white"
                            >
                              📝⭐ Text+Icon
                            </button>
                            <button
                              onClick={() => {
                                // Icon + Text (horizontal) - brand centered, icon left
                                if (logoElements.brand && logoElements.icon) {
                                  setLogoElements(prev => {
                                    const newState = {
                                      ...prev,
                                      icon: prev.icon ? { ...prev.icon, x: 120, y: 200 } : undefined,
                                      brand: prev.brand ? { ...prev.brand, x: 200, y: 200 } : undefined
                                    };
                                    if (prev.slogan) {
                                      newState.slogan = { ...prev.slogan, x: 200, y: 225 };
                                    }
                                    return newState;
                                  });
                                }
                              }}
                              className="px-3 py-2 rounded text-xs transition-colors bg-gray-600/80 hover:bg-gray-600 text-white"
                            >
                              ⭐📝 Icon+Text
                            </button>
                            <button
                              onClick={() => {
                                // Icon + Text (vertical) - brand centered, icon top
                                if (logoElements.brand && logoElements.icon) {
                                  setLogoElements(prev => {
                                    const newState = {
                                      ...prev,
                                      icon: prev.icon ? { ...prev.icon, x: 200, y: 120 } : undefined,
                                      brand: prev.brand ? { ...prev.brand, x: 200, y: 200 } : undefined
                                    };
                                    if (prev.slogan) {
                                      newState.slogan = { ...prev.slogan, x: 200, y: 280 };
                                    }
                                    return newState;
                                  });
                                }
                              }}
                              className="px-3 py-2 rounded text-xs transition-colors bg-gray-600/80 hover:bg-gray-600 text-white"
                            >
                              ⭐
                              📝 Vertical 1
                            </button>
                            <button
                              onClick={() => {
                                // Text + Icon (vertical) - brand centered, icon bottom
                                if (logoElements.brand && logoElements.icon) {
                                  setLogoElements(prev => {
                                    const newState = {
                                      ...prev,
                                      brand: prev.brand ? { ...prev.brand, x: 200, y: 200 } : undefined,
                                      icon: prev.icon ? { ...prev.icon, x: 200, y: 280 } : undefined
                                    };
                                    if (prev.slogan) {
                                      newState.slogan = { ...prev.slogan, x: 200, y: 120 };
                                    }
                                    return newState;
                                  });
                                }
                              }}
                              className="px-3 py-2 rounded text-xs transition-colors bg-gray-600/80 hover:bg-gray-600 text-white"
                            >
                              📝
                              ⭐ Vertical 2
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Place Here button */}
                      <div className="mt-3">
                        {((selectedElement === 'icon' && logoElements.icon && !logoElements.icon.permanent) ||
                          (selectedElement === 'brand' && logoElements.brand && !logoElements.brand.permanent) ||
                          (selectedElement === 'slogan' && logoElements.slogan && !logoElements.slogan.permanent)) && (
                          <button
                            onClick={() => {
                              const currentElement = logoElements[selectedElement];
                              if (currentElement) {
                                let elementStroke: Stroke;

                                // Create different stroke types based on element type
                                if (selectedElement === 'icon') {
                                  const iconElement = currentElement as any;
                                  elementStroke = {
                                    id: `icon-stroke-${Date.now()}`,
                                    tool: 'icon',
                                    points: [
                                      { x: iconElement.x, y: iconElement.y }
                                    ],
                                    color: iconElement.color,
                                    width: 1,
                                    opacity: iconElement.opacity,
                                    rotation: iconElement.rotation,
                                    iconComponent: iconElement.icon,
                                    iconSize: iconElement.size
                                  };
                                } else {
                                  const textElement = currentElement as any;
                                  elementStroke = {
                                    id: `${selectedElement}-stroke-${Date.now()}`,
                                    tool: 'text',
                                    points: [
                                      { x: textElement.x, y: textElement.y }
                                    ],
                                    color: textElement.color,
                                    width: 1,
                                    opacity: textElement.opacity,
                                    rotation: textElement.rotation,
                                    text: textElement.text,
                                    fontSize: textElement.fontSize,
                                    fontFamily: textElement.fontFamily,
                                    fontWeight: textElement.fontWeight,
                                    textAlign: textElement.textAlign
                                  };
                                }

                                // Add stroke to background layer (layer-1)
                                setEditLayers(prev => prev.map(layer =>
                                  layer.id === 'layer-1'
                                    ? { ...layer, strokes: [...layer.strokes, elementStroke] }
                                    : layer
                                ));

                                // Remove from logoElements
                                setLogoElements(prev => ({
                                  ...prev,
                                  [selectedElement]: undefined
                                }));

                                console.log(`🎯 ${selectedElement} placed as canvas stroke for tool interaction`);
                              }
                            }}
                            className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                          >
                            Place {selectedElement === 'icon' ? 'Icon' : selectedElement === 'brand' ? 'Brand' : 'Slogan'} Here!
                          </button>
                        )}
                      </div>


                      <button
                        onClick={() => {
                          const canvasSize = 400; // Square canvas for proper centering
                          const canvasWidth = canvasSize;
                          const canvasHeight = canvasSize;

                          setLogoElements(prev => ({
                            ...prev,
                            icon: prev.icon ? { ...prev.icon, x: canvasWidth / 2, y: canvasHeight / 2 - 40, permanent: false, rotation: 0, opacity: 1.0 } : prev.icon,
                            brand: prev.brand ? { ...prev.brand, x: canvasWidth / 2, y: canvasHeight / 2, permanent: false, rotation: 0, textAlign: 'center', opacity: 1.0 } : prev.brand,
                            slogan: prev.slogan ? { ...prev.slogan, x: canvasWidth / 2, y: canvasHeight / 2 + 25, permanent: false, rotation: 0, textAlign: 'center', opacity: 1.0 } : prev.slogan
                          }));
                          setSelectedElement('icon');
                        }}
                        className="w-full mt-3 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                      >
                        Reset All Properties
                      </button>
                    </div>
                  )}

                  {/* Eraser Mode and End Settings - Side by Side */}
                  {drawingTool === 'eraser' && (
                    <div className="flex gap-2 mb-4">
                      {/* Eraser Mode Settings */}
                      <div className="bg-white/10 rounded p-2 flex-1 border border-white/20">
                        <label className="block text-white/80 text-sm mb-2">Eraser-Modus</label>
                        <div className="grid grid-cols-1 gap-2">
                          <button
                            onClick={() => setEraserMode('brush')}
                            className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
                              eraserMode === 'brush' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                          >
                            <Brush size={14} />
                            Brush
                          </button>
                          <button
                            onClick={() => setEraserMode('line')}
                            className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
                              eraserMode === 'line' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                          >
                            📏 Line
                          </button>
                        </div>
                      </div>

                      {/* Eraser End Settings */}
                      <div className="bg-white/10 rounded p-2 flex-1 border border-white/20">
                        <label className="block text-white/80 text-sm mb-2">Radiererenden</label>
                        <div className="space-y-2">
                          <button
                            onClick={() => setBrushLineCap('round')}
                            className={`w-full flex items-center justify-center p-2 rounded text-xs transition-colors ${
                              brushLineCap === 'round'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                          >
                            ● Rund
                          </button>
                          <button
                            onClick={() => setBrushLineCap('square')}
                            className={`w-full flex items-center justify-center p-2 rounded text-xs transition-colors ${
                              brushLineCap === 'square'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                          >
                            ■ Quadratisch
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tool Settings */}
                  <div className="space-y-3">
                    {/* Brush Tool End Settings (only for brush, not eraser) */}
                    {drawingTool === 'brush' && (
                      <>
                        <div>
                          <label className="block text-white/80 text-sm mb-1">Pinselende</label>
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
                    

                    {/* Line Tool End Settings */}
                    {drawingTool === 'line' && (
                      <>
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
                                    rotation: boxToConvert.rotation,
                                    rect: {
                                      x: boxToConvert.x,
                                      y: boxToConvert.y,
                                      width: boxToConvert.width,
                                      height: boxToConvert.height
                                    },
                                    // Add special properties for box rendering
                                    strokeColor: boxToConvert.strokeColor,
                                    strokeOpacity: boxToConvert.strokeOpacity || 1
                                  };

                                  // Add box stroke to background layer (layer-1)
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
                        Reset All
                      </button>
                    </div>

                  </div>

                </div>

                {/* RIGHT PANEL - SIMPLE */}
                <div className="w-full space-y-3 overflow-y-auto">
                  {/* Layer Manager */}
                  <LayerManager
                    editLayers={editLayers}
                    activeLayer={activeLayer}
                    onActiveLayerChange={setActiveLayer}
                    onLayersChange={setEditLayers}
                    onMoveLayerUp={moveLayerUp}
                    onMoveLayerDown={moveLayerDown}
                    onDeleteLayer={deleteLayer}
                    onAddCustomLayer={addCustomLayer}
                  />
                {/* Text Section */}
                <div className="bg-white/5 rounded-lg p-2 border border-white/10 backdrop-blur-sm overflow-hidden">
                  <h4 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
                    <User size={16} className="text-purple-400" />
                    Text
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={localConfig.text}
                        onChange={(e) => updateLocalConfig({ text: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-sm box-border"
                        placeholder="Enter brand name"
                      />
                      <div className="mt-1.5">
                        <label className="block text-white/60 text-xs mb-1">Brand Name Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={brandNameColor}
                            onChange={(e) => {
                              setBrandNameColor(e.target.value);
                              // Note: brandNameColor is managed separately from LogoConfig
                            }}
                            className="w-6 h-5 rounded border border-white/20 cursor-pointer"
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
                        className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-sm box-border"
                        placeholder="Enter slogan"
                      />
                      <div className="mt-1.5">
                        <label className="block text-white/60 text-xs mb-1">Slogan Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={sloganColor}
                            onChange={(e) => {
                              setSloganColor(e.target.value);
                              // Note: sloganColor is managed separately from LogoConfig
                            }}
                            className="w-6 h-5 rounded border border-white/20 cursor-pointer"
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
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm mb-3 box-border"
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
                            <div className="bg-white/5 rounded-lg p-1 w-full">
                              <div className="flex items-center gap-1 mb-2">
                                <span className="text-xs text-white/60 ">Weight:</span>
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
                                <span className="text-sm text-white  text-right">
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
                <div className="bg-white/5 rounded-lg p-2 border border-white/10 backdrop-blur-sm overflow-hidden">
                  <h4 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
                    <Star size={16} className="text-yellow-400" />
                    Icon
                  </h4>
                  <div className="grid grid-cols-6 gap-1 mb-2">
                    <button
                      onClick={() => updateLocalConfig({ icon: null })}
                      className={`p-1.5 rounded border transition-colors ${
                        !localConfig.icon ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <span className="text-white/60 text-[10px]">None</span>
                    </button>
                    {availableIcons.slice(0, 17).map(icon => (
                      <button
                        key={icon.id}
                        onClick={() => updateLocalConfig({ icon })}
                        className={`p-1.5 rounded border transition-colors ${
                          localConfig.icon?.id === icon.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <icon.component size={16} color="white" className="mx-auto" />
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
                    <div className="grid grid-cols-3 gap-2 w-full">
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
                          className={`p-1.5 rounded border transition-colors ${
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



                {/* Export Panel */}
                <ExportPanel
                  onSave={handleSave}
                  onPurchase={handlePurchase}
                  showPurchaseButton={true}
                  showDownloadOptions={false}
                />
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        flippedCards={flippedCards}
        toggleCardFlip={toggleCardFlip}
        handlePurchaseOption={handlePurchaseOption}
      />


      {/* Save Modal */}
      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        handleSaveOption={handleSaveOption}
      />


    </>
  );
};

export default LogoEditor;