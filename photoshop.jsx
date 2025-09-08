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
} from "lucide-react";

// ---- Helpers ----
const uid = (() => {
  let n = 1;
  return () => `id_${n++}`;
})();

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function pointsToPath(points) {
  if (!points || points.length === 0) return "";
  const [first, ...rest] = points;
  return (
    `M ${first.x} ${first.y}` + rest.map((p) => ` L ${p.x} ${p.y}`).join("")
  );
}

// ---- Types ----
/** @typedef {{ x:number, y:number }} Point */
/** @typedef {{ id:string, tool:'brush'|'eraser', color:string, width:number, points:Point[] }} Stroke */
/** @typedef {{ id:string, name:string, visible:boolean, strokes:Stroke[] }} Layer */

// ---- Main Component ----
export default function MiniPhotoshop() {
  // Document size
  const [docWidth, setDocWidth] = useState(1000);
  const [docHeight, setDocHeight] = useState(600);

  // Tools & drawing state
  const [tool, setTool] = useState(/** @type {'brush'|'eraser'} */ ("brush"));
  const [color, setColor] = useState("#6b7cff");
  const [brushWidth, setBrushWidth] = useState(14);

  const [layers, setLayers] = useState(
    /** @type {Layer[]} */ ([
      { id: uid(), name: "Layer 1", visible: true, strokes: [] },
    ])
  );
  const [activeLayerId, setActiveLayerId] = useState(layers[0].id);

  const activeLayerIndex = useMemo(
    () => layers.findIndex((l) => l.id === activeLayerId),
    [layers, activeLayerId]
  );
  const activeLayer = layers[activeLayerIndex] || null;

  // Drawing
  const svgRef = useRef(/** @type {SVGSVGElement|null} */ (null));
  const drawingRef = useRef({
    drawing: false,
    stroke: /** @type {Stroke|null} */ (null),
  });

  // Responsive board max size
  const boardWrapperRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const [scale, setScale] = useState(1); // UI scale for fit-to-screen

  useEffect(() => {
    const resize = () => {
      const el = boardWrapperRef.current;
      if (!el) return;
      const padding = 24;
      const maxW = el.clientWidth - padding;
      const maxH = el.clientHeight - padding;
      const sx = maxW / docWidth;
      const sy = maxH / docHeight;
      setScale(clamp(Math.min(sx, sy), 0.2, 1));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [docWidth, docHeight]);

  // ---- Layer operations ----
  function addLayer() {
    const name = `Layer ${layers.length + 1}`;
    const newLayer = { id: uid(), name, visible: true, strokes: [] };
    setLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
  }

  function deleteLayer(id) {
    if (layers.length === 1) return; // keep at least one
    const idx = layers.findIndex((l) => l.id === id);
    if (idx === -1) return;
    const next = layers.filter((l) => l.id !== id);
    setLayers(next);
    if (activeLayerId === id) {
      const fallback = next[Math.max(0, idx - 1)]?.id || next[0].id;
      setActiveLayerId(fallback);
    }
  }

  function moveLayerUp(id) {
    const idx = layers.findIndex((l) => l.id === id);
    if (idx === -1 || idx === layers.length - 1) return; // already top
    const copy = layers.slice();
    const [item] = copy.splice(idx, 1);
    copy.splice(idx + 1, 0, item);
    setLayers(copy);
  }

  function moveLayerDown(id) {
    const idx = layers.findIndex((l) => l.id === id);
    if (idx <= 0) return; // already bottom
    const copy = layers.slice();
    const [item] = copy.splice(idx, 1);
    copy.splice(idx - 1, 0, item);
    setLayers(copy);
  }

  function toggleVisibility(id) {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }

  function renameLayer(id, name) {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, name } : l)));
  }

  // ---- Pointer Drawing ----
  function getLocalPoint(e) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    return { x: clamp(x, 0, docWidth), y: clamp(y, 0, docHeight) };
  }

  function onPointerDown(e) {
    if (!activeLayer || !activeLayer.visible) return;
    if (!svgRef.current) return;
    e.target instanceof Element &&
      svgRef.current.setPointerCapture?.(e.pointerId);
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

  function onPointerMove(e) {
    if (!drawingRef.current.drawing) return;
    const p = getLocalPoint(e);
    const stroke = drawingRef.current.stroke;
    if (!stroke) return;
    // Only record when movement is meaningful
    const last = stroke.points[stroke.points.length - 1];
    const dx = p.x - last.x,
      dy = p.y - last.y;
    if (dx * dx + dy * dy > 0.5) {
      stroke.points.push(p);
      // trigger lightweight re-render by copying active layer stroke preview
      setLayers((prev) => prev.slice());
    }
  }

  function onPointerUp() {
    if (!drawingRef.current.drawing) return;
    drawingRef.current.drawing = false;
    const stroke = drawingRef.current.stroke;
    drawingRef.current.stroke = null;
    if (!stroke || stroke.points.length < 1) return;
    // Commit stroke to active layer
    setLayers((prev) =>
      prev.map((l, i) =>
        i === activeLayerIndex ? { ...l, strokes: [...l.strokes, stroke] } : l
      )
    );
  }

  // ---- Export ----
  function buildSVGString() {
    // Build an SVG string from current state
    const defsMasks = layers
      .map((layer) => {
        const eraserPaths = layer.strokes.filter((s) => s.tool === "eraser");
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
        return `<mask id="${maskId}" maskUnits="userSpaceOnUse">\n      <rect x="0" y="0" width="${docWidth}" height="${docHeight}" fill="white"/>${eraserPathsStr}\n    </mask>`;
      })
      .join("\n");

    const layersStr = layers
      .map((layer) => {
        if (!layer.visible) return "";
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
      })
      .join("\n");

    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${docWidth}" height="${docHeight}" viewBox="0 0 ${docWidth} ${docHeight}" version="1.1">\n  <defs>\n    ${defsMasks}\n  </defs>\n  ${layersStr}\n</svg>`;

    return svg;
  }

  async function download(
    format /** @type {'svg'|'png'|'jpeg'|'webp'} */ = "svg",
    scaleFactor = 1
  ) {
    if (format === "svg") {
      const svgStr = buildSVGString();
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `artboard_${Date.now()}.svg`);
      URL.revokeObjectURL(url);
      return;
    }

    // Raster export via canvas
    const svgStr = buildSVGString();
    const svgUrl =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
    const img = new Image();
    // Allow cross-origin if needed
    img.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = svgUrl;
    });

    const w = Math.round(docWidth * scaleFactor);
    const h = Math.round(docHeight * scaleFactor);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (format === "jpeg") {
      // Fill background white for JPEG (no alpha)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }

    ctx.drawImage(img, 0, 0, w, h);
    const mime =
      format === "png"
        ? "image/png"
        : format === "jpeg"
        ? "image/jpeg"
        : "image/webp";
    const url = canvas.toDataURL(mime, 0.92);
    triggerDownload(url, `artboard_${Date.now()}.${format}`);
  }

  function triggerDownload(href, filename) {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // ---- UI Components ----
  function LayerItem({ layer, index }) {
    const isActive = layer.id === activeLayerId;
    // index: 0 is bottom; layers.length-1 is top
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
          isActive
            ? "bg-white/70 border-indigo-300 shadow-sm"
            : "bg-white/40 border-transparent"
        } hover:bg-white/70 transition`}
        onClick={() => setActiveLayerId(layer.id)}
      >
        <button
          className="p-1 rounded-md hover:bg-black/5"
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibility(layer.id);
          }}
          title={layer.visible ? "Hide" : "Show"}
        >
          {layer.visible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
        <span
          className="text-sm text-slate-700 font-medium truncate"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            renameLayer(layer.id, e.currentTarget.textContent || layer.name)
          }
        >
          {layer.name}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            className="p-1 rounded-md hover:bg-black/5"
            onClick={(e) => {
              e.stopPropagation();
              moveLayerUp(layer.id);
            }}
            title="Move up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            className="p-1 rounded-md hover:bg-black/5"
            onClick={(e) => {
              e.stopPropagation();
              moveLayerDown(layer.id);
            }}
            title="Move down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            className="p-1 rounded-md hover:bg-black/5 text-rose-500"
            onClick={(e) => {
              e.stopPropagation();
              deleteLayer(layer.id);
            }}
            title="Delete layer"
            disabled={layers.length === 1}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const topbar = (
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center gap-2 text-slate-700">
        <Layers className="w-4 h-4" />
        <span className="font-semibold">Mini Photoshop</span>
        <span className="text-xs text-slate-500">
          — Brush, Eraser, Layers, SVG Export
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setTool("brush")}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
              tool === "brush" ? "bg-white shadow" : ""
            }`}
            title="Brush (B)"
          >
            <Brush className="w-4 h-4" /> <span className="text-sm">Brush</span>
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
              tool === "eraser" ? "bg-white shadow" : ""
            }`}
            title="Eraser (E)"
          >
            <Eraser className="w-4 h-4" />{" "}
            <span className="text-sm">Eraser</span>
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <label className="text-xs text-slate-500">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-6 rounded border"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <label className="text-xs text-slate-500">Size</label>
          <input
            type="range"
            min={1}
            max={64}
            value={brushWidth}
            onChange={(e) => setBrushWidth(parseInt(e.target.value))}
            className="w-32"
          />
          <span className="text-sm tabular-nums w-8 text-right">
            {brushWidth}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <label className="text-xs text-slate-500">Canvas</label>
          <input
            type="number"
            min={64}
            max={4096}
            value={docWidth}
            onChange={(e) =>
              setDocWidth(clamp(parseInt(e.target.value) || 0, 64, 4096))
            }
            className="w-20 px-2 py-1 bg-slate-50 rounded border"
          />
          ×
          <input
            type="number"
            min={64}
            max={4096}
            value={docHeight}
            onChange={(e) =>
              setDocHeight(clamp(parseInt(e.target.value) || 0, 64, 4096))
            }
            className="w-20 px-2 py-1 bg-slate-50 rounded border"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => download("svg")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white shadow hover:bg-indigo-700"
            title="Download SVG"
          >
            <Download className="w-4 h-4" /> SVG
          </button>
          <button
            onClick={() => download("png", 1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-white shadow hover:bg-slate-900"
            title="Download PNG"
          >
            <Download className="w-4 h-4" /> PNG
          </button>
          <button
            onClick={() => download("jpeg", 1)}
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-white shadow hover:bg-slate-900"
            title="Download JPEG"
          >
            <Download className="w-4 h-4" /> JPEG
          </button>
          <button
            onClick={() => download("webp", 1)}
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-white shadow hover:bg-slate-900"
            title="Download WebP"
          >
            <Download className="w-4 h-4" /> WebP
          </button>
        </div>
      </div>
    </div>
  );

  const leftSidebar = (
    <div className="w-16 p-2 flex flex-col gap-2 border-r border-slate-200 bg-white/70">
      <ToolButton
        icon={<Brush className="w-5 h-5" />}
        label="Brush"
        active={tool === "brush"}
        onClick={() => setTool("brush")}
        shortcut="B"
      />
      <ToolButton
        icon={<Eraser className="w-5 h-5" />}
        label="Eraser"
        active={tool === "eraser"}
        onClick={() => setTool("eraser")}
        shortcut="E"
      />
    </div>
  );

  const rightSidebar = (
    <div className="w-72 border-l border-slate-200 bg-white/70 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-slate-700">
          <Layers className="w-4 h-4" />{" "}
          <span className="text-sm font-semibold">Layers</span>
        </div>
        <button
          onClick={addLayer}
          className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-900 px-2 py-1 rounded-lg hover:bg-indigo-50"
        >
          <Plus className="w-4 h-4" /> New
        </button>
      </div>
      <div className="p-3 flex-1 overflow-auto flex flex-col gap-2">
        {/* Show top-most first for UX */}
        {[...layers]
          .map((layer, idx) => (
            <LayerItem key={layer.id} layer={layer} index={idx} />
          ))
          .reverse()}
      </div>
    </div>
  );

  // Build live masks preview (like export) for on-screen rendering
  const LiveSVG = () => {
    // Build masks and layer groups similarly to export
    return (
      <svg
        ref={svgRef}
        width={docWidth}
        height={docHeight}
        viewBox={`0 0 ${docWidth} ${docHeight}`}
        className="touch-none select-none block"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <defs>
          {layers.map((layer) => (
            <mask
              id={`mask_${layer.id}`}
              key={`mask_${layer.id}`}
              maskUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={docWidth}
                height={docHeight}
                fill="white"
              />
              {layer.strokes
                .filter((s) => s.tool === "eraser")
                .map((s) => (
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

        {layers.map(
          (layer) =>
            layer.visible && (
              <g key={layer.id} mask={`url(#mask_${layer.id})`}>
                {layer.strokes
                  .filter((s) => s.tool === "brush")
                  .map((s) => (
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
            )
        )}

        {/* Live stroke preview while drawing */}
        {drawingRef.current.drawing &&
          drawingRef.current.stroke &&
          activeLayer?.visible &&
          (drawingRef.current.stroke.tool === "eraser" ? (
            <g mask={`url(#mask_${activeLayer.id})`}>
              {/* For eraser preview we overlay a translucent path */}
              <path
                d={pointsToPath(drawingRef.current.stroke.points)}
                fill="none"
                stroke="#00000055"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={drawingRef.current.stroke.width}
              />
            </g>
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

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900">
      {topbar}
      <div className="h-[calc(100vh-56px)] flex overflow-hidden">
        {leftSidebar}

        <div
          ref={boardWrapperRef}
          className="flex-1 relative flex items-center justify-center p-6"
        >
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] opacity-40"></div>
          <div
            className="relative rounded-2xl shadow-2xl border border-slate-300 bg-white/90 backdrop-blur p-4"
            style={{ transform: `scale(${scale})` }}
          >
            <div className="rounded-lg overflow-hidden bg-[conic-gradient(at_10%_10%,#f8fafc_0_25%,#ffffff_0_50%,#f8fafc_0_75%,#ffffff_0)]">
              <LiveSVG />
            </div>
          </div>
        </div>

        {rightSidebar}
      </div>

      {/* Shortcuts */}
      <KeyShortcuts
        onKey={(k) => {
          if (k === "b") setTool("brush");
          if (k === "e") setTool("eraser");
        }}
      />
    </div>
  );
}

function ToolButton({ icon, label, active, onClick, shortcut }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-xs ${
        active
          ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow"
          : "bg-white/70 border-slate-200 hover:bg-white"
      } transition`}
      title={`${label}${shortcut ? ` (${shortcut.toUpperCase()})` : ""}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function KeyShortcuts({ onKey }) {
  useEffect(() => {
    const handler = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || ""))
        return;
      if (e.key === "b" || e.key === "B") onKey("b");
      if (e.key === "e" || e.key === "E") onKey("e");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);
  return null;
}
