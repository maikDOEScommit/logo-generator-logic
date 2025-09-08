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
} from "lucide-react";
import { LogoConfig } from '@/lib/types';

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

interface LogoLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'drawing' | 'logo-element';
  strokes?: Stroke[];
  logoElement?: {
    type: 'text' | 'icon';
    content: string;
    x: number;
    y: number;
    color: string;
    size: number;
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
  const [tool, setTool] = useState<'brush' | 'eraser' | 'text' | 'move'>('brush');
  const [color, setColor] = useState(config.palette?.colors[1] || '#6b7cff');
  const [brushWidth, setBrushWidth] = useState(8);

  // Layers system
  const [layers, setLayers] = useState<LogoLayer[]>(() => {
    const initialLayers: LogoLayer[] = [
      { 
        id: uid(), 
        name: 'Background', 
        visible: true, 
        type: 'drawing',
        strokes: [] 
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
          size: 48
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

  // Update color when palette changes
  useEffect(() => {
    if (config.palette?.colors[1]) {
      setColor(config.palette.colors[1]);
    }
  }, [config.palette]);

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
        ? { strokes: [] }
        : { 
            logoElement: {
              type: 'text',
              content: 'New Text',
              x: canvasWidth / 2,
              y: canvasHeight / 2,
              color: color,
              size: 24
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
    drawingRef.current.drawing = true;
    drawingRef.current.stroke = {
      id: uid(),
      tool,
      color,
      width: brushWidth,
      points: [p],
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drawingRef.current.drawing) return;
    const p = getLocalPoint(e);
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

  function onPointerUp() {
    if (!drawingRef.current.drawing) return;
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
        
        if (layer.type === 'drawing' && layer.strokes) {
          const maskId = `mask_${layer.id}`;
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
          return `<g mask="url(#${maskId})">${brushStr}\n    </g>`;
        }
        
        if (layer.type === 'logo-element' && layer.logoElement) {
          const elem = layer.logoElement;
          if (elem.type === 'text') {
            return `<text x="${elem.x}" y="${elem.y}" font-size="${elem.size}" fill="${elem.color}" text-anchor="middle" dominant-baseline="central">${elem.content}</text>`;
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
        className="touch-none select-none block"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
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
          
          if (layer.type === 'drawing' && layer.strokes) {
            return (
              <g key={layer.id} mask={`url(#mask_${layer.id})`}>
                {layer.strokes.filter((s) => s.tool === "brush").map((s) => (
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
                  fontWeight={config.fontWeight || 600}
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
              stroke="#00000055"
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
          </div>

          {/* Color picker */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
            <Palette className="w-4 h-4" />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
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

        {/* Right sidebar - Layers */}
        <div className="w-80 border-l border-gray-700 bg-gray-800 flex flex-col">
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