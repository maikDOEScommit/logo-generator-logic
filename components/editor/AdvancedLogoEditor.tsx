// components/editor/AdvancedLogoEditor.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Brush,
  Eraser,
  Eye,
  EyeOff,
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  Type,
  Move,
  Palette,
  Square,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { LogoConfig } from '@/lib/types';
import { availableIcons } from '@/lib/suggestionEngine';

// ---- Helpers ----
const uid = (() => {
  let n = 1;
  return () => `id_${n++}`;
})();

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function pointsToPath(points: Point[]): string {
  if (!points || points.length === 0) return "";
  const [first, ...rest] = points;
  return (
    `M ${first.x} ${first.y}` + rest.map((p) => ` L ${p.x} ${p.y}`).join("")
  );
}

// ---- Types ----
interface Point {
  x: number;
  y: number;
}

interface Stroke {
  id: string;
  tool: 'brush' | 'eraser';
  color: string;
  width: number;
  points: Point[];
}

interface BoxShape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fillOpacity: number;
  strokeWidth: number;
  rotation?: number;
}

interface LogoLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'drawing' | 'logo-element';
  strokes?: Stroke[];
  boxes?: BoxShape[];
  logoElement?: {
    type: 'text' | 'icon';
    content: string;
    x: number;
    y: number;
    color: string;
    size: number;
    fontWeight?: number;
  };
}

interface AdvancedLogoEditorProps {
  config: LogoConfig;
  onConfigUpdate: (newConfig: Partial<LogoConfig>) => void;
  onExport?: (svg: string, format: 'svg' | 'png' | 'jpeg' | 'webp') => void;
}

// ---- Main Component ----
export default function AdvancedLogoEditor({ 
  config, 
  onConfigUpdate,
  onExport 
}: AdvancedLogoEditorProps) {
  // Canvas settings
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);

  // Drawing tools
  const [tool, setTool] = useState<'brush' | 'eraser' | 'text' | 'move' | 'box'>('brush');
  const [brushColor, setBrushColor] = useState(config.palette?.colors[1] || '#6b7cff');
  const [boxColor, setBoxColor] = useState('#ff6b6b');
  const [brushWidth, setBrushWidth] = useState(8);
  const [boxRotation, setBoxRotation] = useState(0);
  const [showIconList, setShowIconList] = useState(false);
  
  // Text editing
  const [brandNameColor, setBrandNameColor] = useState(config.palette?.colors[1] || '#000000');
  const [sloganColor, setSloganColor] = useState(config.palette?.colors[1] || '#000000');
  const [fontWeight, setFontWeight] = useState(config.fontWeight || 600);
  
  // Box drawing state
  const [isDrawingBox, setIsDrawingBox] = useState(false);
  const [boxStart, setBoxStart] = useState<Point | null>(null);
  const [currentBox, setCurrentBox] = useState<BoxShape | null>(null);
  
  // Move tool state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [selectedElement, setSelectedElement] = useState<{type: 'box' | 'stroke', layerId: string, elementId: string} | null>(null);

  // Layers system
  const [layers, setLayers] = useState<LogoLayer[]>(() => {
    const initialLayers: LogoLayer[] = [
      { 
        id: uid(), 
        name: 'Background', 
        visible: true, 
        type: 'drawing',
        strokes: [],
        boxes: []
      }
    ];

    // Add text layer if we have text
    if (config.text) {
      initialLayers.push({
        id: uid(),
        name: 'Brand Text',
        visible: true,
        type: 'logo-element',
        logoElement: {
          type: 'text',
          content: config.text,
          x: canvasWidth / 2,
          y: config.icon ? canvasHeight / 2 + 40 : canvasHeight / 2,
          color: config.palette?.colors[1] || '#000000',
          size: 48,
          fontWeight: config.fontWeight || 600
        }
      });
    }

    // Add icon layer if we have an icon
    if (config.icon) {
      initialLayers.push({
        id: uid(),
        name: 'Brand Icon',
        visible: true,
        type: 'logo-element',
        logoElement: {
          type: 'icon',
          content: config.icon.id,
          x: canvasWidth / 2,
          y: config.text ? canvasHeight / 2 - 40 : canvasHeight / 2,
          color: config.palette?.colors[1] || '#000000',
          size: 64
        }
      });
    }

    return initialLayers;
  });
  const [activeLayerId, setActiveLayerId] = useState(layers[0].id);

  const activeLayerIndex = useMemo(
    () => layers.findIndex((l) => l.id === activeLayerId),
    [layers, activeLayerId]
  );
  const activeLayer = layers[activeLayerIndex] || null;

  // Drawing state
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drawingRef = useRef({
    drawing: false,
    stroke: null as Stroke | null,
  });

  // Responsive scaling
  const boardWrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // Update colors when palette changes
  useEffect(() => {
    if (config.palette?.colors[1]) {
      setBrushColor(config.palette.colors[1]);
      setBrandNameColor(config.palette.colors[1]);
      setSloganColor(config.palette.colors[1]);
    }
  }, [config.palette]);

  // Update font weight and colors from config
  useEffect(() => {
    if (config.fontWeight) {
      setFontWeight(config.fontWeight);
    }
  }, [config.fontWeight]);

  // Update font weight in all text layers when fontWeight changes
  useEffect(() => {
    setLayers(prevLayers =>
      prevLayers.map(layer => {
        if (layer.type === 'logo-element' && layer.logoElement?.type === 'text') {
          return {
            ...layer,
            logoElement: {
              ...layer.logoElement,
              fontWeight: fontWeight
            }
          };
        }
        return layer;
      })
    );
  }, [fontWeight]);

  // Responsive scaling
  useEffect(() => {
    const resize = () => {
      const el = boardWrapperRef.current;
      if (!el) return;
      const padding = 48;
      const maxW = el.clientWidth - padding;
      const maxH = el.clientHeight - padding;
      const sx = maxW / canvasWidth;
      const sy = maxH / canvasHeight;
      setScale(clamp(Math.min(sx, sy), 0.1, 1));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvasWidth, canvasHeight]);

  // ---- Layer operations ----
  function addLayer(type: 'drawing' | 'logo-element' = 'drawing') {
    const name = type === 'drawing' 
      ? `Drawing ${layers.filter(l => l.type === 'drawing').length + 1}`
      : `Element ${layers.filter(l => l.type === 'logo-element').length + 1}`;
    
    const newLayer: LogoLayer = {
      id: uid(),
      name,
      visible: true,
      type,
      ...(type === 'drawing' 
        ? { strokes: [], boxes: [] }
        : { 
            logoElement: {
              type: 'text',
              content: 'New Text',
              x: canvasWidth / 2,
              y: canvasHeight / 2,
              color: brushColor,
              size: 24,
              fontWeight: fontWeight
            }
          }
      )
    };
    
    setLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
  }

  function deleteLayer(id: string) {
    if (layers.length === 1) return;
    const idx = layers.findIndex((l) => l.id === id);
    if (idx === -1) return;
    const next = layers.filter((l) => l.id !== id);
    setLayers(next);
    if (activeLayerId === id) {
      const fallback = next[Math.max(0, idx - 1)]?.id || next[0].id;
      setActiveLayerId(fallback);
    }
  }

  function moveLayerUp(id: string) {
    const idx = layers.findIndex((l) => l.id === id);
    if (idx === -1 || idx === layers.length - 1) return;
    const copy = layers.slice();
    const [item] = copy.splice(idx, 1);
    copy.splice(idx + 1, 0, item);
    setLayers(copy);
  }

  function moveLayerDown(id: string) {
    const idx = layers.findIndex((l) => l.id === id);
    if (idx <= 0) return;
    const copy = layers.slice();
    const [item] = copy.splice(idx, 1);
    copy.splice(idx - 1, 0, item);
    setLayers(copy);
  }

  function toggleVisibility(id: string) {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }

  function renameLayer(id: string, name: string) {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, name } : l)));
  }

  // ---- Drawing ----
  function getLocalPoint(e: React.PointerEvent): Point {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    return { x: clamp(x, 0, canvasWidth), y: clamp(y, 0, canvasHeight) };
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!activeLayer || !activeLayer.visible || activeLayer.type !== 'drawing') return;
    if (!svgRef.current) return;
    
    if (e.target instanceof Element) {
      svgRef.current.setPointerCapture?.(e.pointerId);
    }
    
    const p = getLocalPoint(e);
    
    if (tool === 'box') {
      setIsDrawingBox(true);
      setBoxStart(p);
      setCurrentBox({
        id: uid(),
        x: p.x,
        y: p.y,
        width: 0,
        height: 0,
        color: boxColor,
        fillOpacity: 1.0,
        strokeWidth: 2,
        rotation: boxRotation
      });
    } else if (tool === 'move') {
      // Simple move tool - for now just set dragging state
      // In a full implementation, you'd detect which element was clicked
      setIsDragging(true);
      setDragStart(p);
    } else if (tool === 'brush' || tool === 'eraser') {
      drawingRef.current.drawing = true;
      drawingRef.current.stroke = {
        id: uid(),
        tool,
        color: brushColor,
        width: brushWidth,
        points: [p],
      };
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    const p = getLocalPoint(e);
    
    if (isDrawingBox && boxStart && currentBox) {
      const width = p.x - boxStart.x;
      const height = p.y - boxStart.y;
      setCurrentBox({
        ...currentBox,
        width: width,
        height: height,
        rotation: boxRotation
      });
    } else if (isDragging && tool === 'move') {
      // Move tool logic - placeholder for now
      // In a full implementation, you'd move the selected element here
      console.log('Moving element', p);
    } else if (drawingRef.current.drawing) {
      const stroke = drawingRef.current.stroke;
      if (!stroke) return;
      
      const last = stroke.points[stroke.points.length - 1];
      const dx = p.x - last.x;
      const dy = p.y - last.y;
      if (dx * dx + dy * dy > 0.5) {
        stroke.points.push(p);
        setLayers((prev) => prev.slice());
      }
    }
  }

  function onPointerUp() {
    if (isDrawingBox && currentBox) {
      // Add box to the active layer
      setLayers((prev) =>
        prev.map((l, i) =>
          i === activeLayerIndex && l.type === 'drawing'
            ? { ...l, boxes: [...(l.boxes || []), currentBox] }
            : l
        )
      );
      setIsDrawingBox(false);
      setBoxStart(null);
      setCurrentBox(null);
    } else if (isDragging && tool === 'move') {
      // End dragging
      setIsDragging(false);
      setDragStart(null);
      setSelectedElement(null);
    } else if (drawingRef.current.drawing) {
      drawingRef.current.drawing = false;
      const stroke = drawingRef.current.stroke;
      drawingRef.current.stroke = null;
      if (!stroke || stroke.points.length < 1) return;
      
      setLayers((prev) =>
        prev.map((l, i) =>
          i === activeLayerIndex && l.type === 'drawing' && l.strokes
            ? { ...l, strokes: [...l.strokes, stroke] }
            : l
        )
      );
    }
  }

  // ---- Export ----
  function buildSVGString(): string {
    const defsMasks = layers
      .filter(l => l.type === 'drawing' && l.strokes)
      .map((layer) => {
        const eraserPaths = layer.strokes!.filter((s) => s.tool === "eraser");
        const maskId = `mask_${layer.id}`;
        const eraserPathsStr = eraserPaths
          .map(
            (s) =>
              `\n      <path d="${pointsToPath(
                s.points
              )}" fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="${
                s.width
              }"/>`
          )
          .join("");
        return `<mask id="${maskId}" maskUnits="userSpaceOnUse">\n      <rect x="0" y="0" width="${canvasWidth}" height="${canvasHeight}" fill="white"/>${eraserPathsStr}\n    </mask>`;
      })
      .join("\n");

    const layersStr = layers
      .map((layer) => {
        if (!layer.visible) return "";
        
        if (layer.type === 'drawing') {
          const maskId = `mask_${layer.id}`;
          let content = '';
          
          // Add strokes
          if (layer.strokes) {
            const brushStr = layer.strokes
              .filter((s) => s.tool === "brush")
              .map(
                (s) =>
                  `\n      <path d="${pointsToPath(
                    s.points
                  )}" fill="none" stroke="${
                    s.color
                  }" stroke-linecap="round" stroke-linejoin="round" stroke-width="${
                    s.width
                  }"/>`
              )
              .join("");
            content += brushStr;
          }
          
          // Add boxes
          if (layer.boxes) {
            const boxStr = layer.boxes
              .map(
                (box) => {
                  const transform = box.rotation ? ` transform="rotate(${box.rotation} ${box.x + Math.abs(box.width)/2} ${box.y + Math.abs(box.height)/2})"` : '';
                  return `\n      <rect x="${box.x}" y="${box.y}" width="${Math.abs(box.width)}" height="${Math.abs(box.height)}" fill="${box.color}" fill-opacity="${box.fillOpacity}" stroke="${box.color}" stroke-width="${box.strokeWidth}"${transform}/>`;
                }
              )
              .join("");
            content += boxStr;
          }
          
          return `<g mask="url(#${maskId})">${content}\n    </g>`;
        }
        
        if (layer.type === 'logo-element' && layer.logoElement) {
          const elem = layer.logoElement;
          if (elem.type === 'text') {
            return `<text x="${elem.x}" y="${elem.y}" font-size="${elem.size}" fill="${elem.color}" font-weight="${elem.fontWeight || config.fontWeight || 600}" text-anchor="middle" dominant-baseline="central">${elem.content}</text>`;
          }
        }
        
        return '';
      })
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" version="1.1">\n  <defs>\n    ${defsMasks}\n  </defs>\n  <rect width="100%" height="100%" fill="${config.palette?.colors[0] || '#FFFFFF'}"/>\n  ${layersStr}\n</svg>`;
  }

  async function exportLogo(format: 'svg' | 'png' | 'jpeg' | 'webp' = 'svg') {
    const svgStr = buildSVGString();
    
    if (format === 'svg') {
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `logo_${Date.now()}.svg`);
      URL.revokeObjectURL(url);
      if (onExport) onExport(svgStr, format);
      return;
    }

    // Raster export
    const svgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
    const img = new Image();
    img.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth * 2; // 2x for high-DPI
    canvas.height = canvasHeight * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const mime = format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp";
    const url = canvas.toDataURL(mime, 0.95);
    triggerDownload(url, `logo_${Date.now()}.${format}`);
    
    if (onExport) onExport(svgStr, format);
  }

  function triggerDownload(href: string, filename: string) {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // ---- Components ----
  const LiveSVG = () => {
    return (
      <svg
        ref={svgRef}
        width={canvasWidth}
        height={canvasHeight}
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        className={`touch-none select-none block ${(tool === 'brush' || tool === 'eraser') ? 'cursor-none' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          cursor: (tool === 'brush' || tool === 'eraser')
            ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${brushWidth + 2}' height='${brushWidth + 2}' viewBox='0 0 ${brushWidth + 2} ${brushWidth + 2}'><circle cx='${(brushWidth + 2) / 2}' cy='${(brushWidth + 2) / 2}' r='${brushWidth / 2}' fill='none' stroke='black' stroke-width='1'/></svg>") ${(brushWidth + 2) / 2} ${(brushWidth + 2) / 2}, crosshair` 
            : 'default'
        }}
      >
        {/* Background */}
        <rect 
          width="100%" 
          height="100%" 
          fill={config.palette?.colors[0] || '#FFFFFF'} 
        />
        
        {/* Masks */}
        <defs>
          {layers.filter(l => l.type === 'drawing').map((layer) => (
            <mask
              id={`mask_${layer.id}`}
              key={`mask_${layer.id}`}
              maskUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill="white" />
              {layer.strokes?.filter((s) => s.tool === "eraser").map((s) => (
                <path
                  key={s.id}
                  d={pointsToPath(s.points)}
                  fill="none"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={s.width}
                />
              ))}
            </mask>
          ))}
        </defs>

        {/* Render layers */}
        {layers.map((layer) => {
          if (!layer.visible) return null;
          
          if (layer.type === 'drawing') {
            return (
              <g key={layer.id} mask={`url(#mask_${layer.id})`}>
                {/* Render strokes */}
                {layer.strokes?.filter((s) => s.tool === "brush").map((s) => (
                  <path
                    key={s.id}
                    d={pointsToPath(s.points)}
                    fill="none"
                    stroke={s.color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={s.width}
                  />
                ))}
                {/* Render boxes */}
                {layer.boxes?.map((box) => (
                  <rect
                    key={box.id}
                    x={box.x}
                    y={box.y}
                    width={Math.abs(box.width)}
                    height={Math.abs(box.height)}
                    fill={box.color}
                    fillOpacity={box.fillOpacity}
                    stroke={box.color}
                    strokeWidth={box.strokeWidth}
                    transform={box.rotation ? `rotate(${box.rotation} ${box.x + Math.abs(box.width)/2} ${box.y + Math.abs(box.height)/2})` : undefined}
                  />
                ))}
              </g>
            );
          }
          
          if (layer.type === 'logo-element' && layer.logoElement) {
            const elem = layer.logoElement;
            if (elem.type === 'text') {
              return (
                <text
                  key={layer.id}
                  x={elem.x}
                  y={elem.y}
                  fontSize={elem.size}
                  fill={elem.color}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily={config.font?.cssName || 'Arial'}
                  fontWeight={elem.fontWeight || config.fontWeight || 600}
                >
                  {elem.content}
                </text>
              );
            }
            
            if (elem.type === 'icon' && config.icon) {
              const IconComponent = config.icon.component;
              return (
                <foreignObject 
                  key={layer.id}
                  x={elem.x - elem.size/2} 
                  y={elem.y - elem.size/2} 
                  width={elem.size} 
                  height={elem.size}
                >
                  <div style={{ width: elem.size, height: elem.size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComponent size={elem.size} color={elem.color} />
                  </div>
                </foreignObject>
              );
            }
          }
          
          return null;
        })}

        {/* Live stroke preview */}
        {drawingRef.current.drawing &&
          drawingRef.current.stroke &&
          activeLayer?.visible &&
          (drawingRef.current.stroke.tool === "eraser" ? (
            <path
              d={pointsToPath(drawingRef.current.stroke.points)}
              fill="none"
              stroke="#000000AA"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={drawingRef.current.stroke.width}
            />
          ) : (
            <path
              d={pointsToPath(drawingRef.current.stroke.points)}
              fill="none"
              stroke={drawingRef.current.stroke.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={drawingRef.current.stroke.width}
            />
          ))}
        
        {/* Live box preview */}
        {currentBox && (
          <rect
            x={currentBox.x}
            y={currentBox.y}
            width={Math.abs(currentBox.width)}
            height={Math.abs(currentBox.height)}
            fill={currentBox.color}
            fillOpacity={1.0}
            stroke={currentBox.color}
            strokeWidth={2}
            transform={currentBox.rotation ? `rotate(${currentBox.rotation} ${currentBox.x + Math.abs(currentBox.width)/2} ${currentBox.y + Math.abs(currentBox.height)/2})` : undefined}
          />
        )}
      </svg>
    );
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName || ""))) return;
      
      if (e.key === "b" || e.key === "B") setTool("brush");
      if (e.key === "e" || e.key === "E") setTool("eraser");
      if (e.key === "t" || e.key === "T") setTool("text");
      if (e.key === "m" || e.key === "M") setTool("move");
      if (e.key === "r" || e.key === "R") setTool("box");
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Advanced Logo Editor</h3>
          
          {/* Tool selection */}
          <div className="flex items-center gap-2 px-2 py-1 bg-gray-700 rounded-lg">
            <button
              onClick={() => setTool("brush")}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                tool === "brush" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
              }`}
            >
              <Brush className="w-4 h-4" /> Brush
            </button>
            <button
              onClick={() => setTool("eraser")}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                tool === "eraser" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
              }`}
            >
              <Eraser className="w-4 h-4" /> Eraser
            </button>
            <button
              onClick={() => setTool("box")}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                tool === "box" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
              }`}
            >
              <Square className="w-4 h-4" /> Box
            </button>
            <button
              onClick={() => setTool("move")}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                tool === "move" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
              }`}
            >
              <Move className="w-4 h-4" /> Move
            </button>
          </div>

          {/* Brush Color picker */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
            <Brush className="w-4 h-4" />
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-8 h-6 rounded border-0 cursor-pointer"
            />
          </div>

          {/* Box Color picker */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
            <Square className="w-4 h-4" />
            <input
              type="color"
              value={boxColor}
              onChange={(e) => setBoxColor(e.target.value)}
              className="w-8 h-6 rounded border-0 cursor-pointer"
            />
          </div>

          {/* Brush size */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
            <span className="text-sm">Size:</span>
            <input
              type="range"
              min={1}
              max={32}
              value={brushWidth}
              onChange={(e) => setBrushWidth(parseInt(e.target.value))}
              className="w-20"
            />
            <span className="text-sm w-6 text-center">{brushWidth}</span>
          </div>

          {/* Box rotation */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
            <span className="text-sm">Rotation:</span>
            <input
              type="range"
              min={0}
              max={360}
              value={boxRotation}
              onChange={(e) => setBoxRotation(parseInt(e.target.value))}
              className="w-20"
            />
            <span className="text-sm w-8 text-center">{boxRotation}°</span>
          </div>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportLogo("svg")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" /> SVG
          </button>
          <button
            onClick={() => exportLogo("png")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" /> PNG
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas area */}
        <div
          ref={boardWrapperRef}
          className="flex-1 flex items-center justify-center p-4"
        >
          <div
            className="bg-white rounded-lg shadow-2xl border border-gray-600"
            style={{ transform: `scale(${scale})` }}
          >
            <LiveSVG />
          </div>
        </div>

        {/* Right sidebar - Controls & Layers */}
        <div className="w-80 border-l border-gray-700 bg-gray-800 flex flex-col">
          {/* Logo Text Controls */}
          <div className="px-4 py-3 border-b border-gray-700">
            <h4 className="font-semibold mb-3 text-white">Logo Text</h4>
            
            {/* Brand Name Input with Color Picker */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={config.text || ''}
                  onChange={(e) => onConfigUpdate({ text: e.target.value })}
                  placeholder="Brand Name"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                />
                <input
                  type="color"
                  value={brandNameColor}
                  onChange={(e) => {
                    setBrandNameColor(e.target.value);
                    onConfigUpdate({});
                  }}
                  className="w-8 h-8 rounded border-0 cursor-pointer"
                  title="Brand Name Color"
                />
              </div>
              
              {/* Slogan Input with Color Picker */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={config.slogan || ''}
                  onChange={(e) => onConfigUpdate({ slogan: e.target.value })}
                  placeholder="Slogan (optional)"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                />
                <input
                  type="color"
                  value={sloganColor}
                  onChange={(e) => {
                    setSloganColor(e.target.value);
                    onConfigUpdate({});
                  }}
                  className="w-8 h-8 rounded border-0 cursor-pointer"
                  title="Slogan Color"
                />
              </div>
              
              {/* Font Weight Slider */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Font Weight</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="100"
                    max="900"
                    step="100"
                    value={fontWeight}
                    onChange={(e) => {
                      setFontWeight(parseInt(e.target.value));
                      onConfigUpdate({ fontWeight: parseInt(e.target.value) });
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm text-white w-8 text-center">{fontWeight}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Icon Library */}
          <div className="px-4 py-3 border-b border-gray-700">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowIconList(!showIconList)}
            >
              <h4 className="font-semibold text-white">Icon Library</h4>
              {showIconList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
            
            {showIconList && (
              <div className="mt-3 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-4 gap-2">
                  {availableIcons.map(icon => (
                    <button
                      key={icon.id}
                      onClick={() => onConfigUpdate({ icon: icon })}
                      className={`p-2 rounded border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-colors ${
                        config.icon?.id === icon.id ? 'border-blue-500 bg-blue-600' : 'bg-gray-700'
                      }`}
                      title={icon.id}
                    >
                      <icon.component size={16} color="white" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="font-semibold">Layers</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addLayer('drawing')}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Drawing
              </button>
              <button
                onClick={() => addLayer('logo-element')}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm flex items-center gap-1"
              >
                <Type className="w-4 h-4" /> Text
              </button>
            </div>
          </div>
          
          <div className="p-3 flex-1 overflow-auto space-y-2">
            {[...layers]
              .map((layer, idx) => (
                <div
                  key={layer.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
                    layer.id === activeLayerId
                      ? "bg-gray-700 border-blue-500"
                      : "bg-gray-700/50 border-transparent hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveLayerId(layer.id)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(layer.id);
                    }}
                  >
                    {layer.visible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  <span className="flex-1 text-sm">{layer.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayerUp(layer.id);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayerDown(layer.id);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer.id);
                      }}
                      className="p-1 hover:bg-gray-600 rounded text-red-400"
                      disabled={layers.length === 1}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
              .reverse()}
          </div>
        </div>
      </div>
    </div>
  );
}