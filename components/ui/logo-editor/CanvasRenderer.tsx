import { useRef, useState } from 'react';
import { Point, Stroke, BoxShape, TextElement, IconElement } from '../LogoEditor';

interface CanvasRendererProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  svgRef: React.RefObject<SVGSVGElement>;
  drawingTool: string;
  isZoomed: boolean;
  brushSize: number;
  cursorPosition: { x: number; y: number } | null;
  setCursorPosition: (pos: { x: number; y: number } | null) => void;
  variation?: {
    backgroundColor?: string;
  };
  editLayers: any[];
  startDrawing: (e: React.MouseEvent) => void;
  continueDrawing: (e: React.MouseEvent) => void;
  endDrawing: (e: React.MouseEvent) => void;
  renderDrawingLayers: () => JSX.Element;
  isMoving: boolean;
  movingBox: BoxShape | null;
  setIsMoving: (moving: boolean) => void;
  setMovingBox: (box: BoxShape | null) => void;
  setMoveStart: (point: Point | null) => void;
  localConfig: any;
  currentFontWeight: number;
  fontWeightUpdateKey: number;
  forceRender: number;
}

export const CanvasRenderer = ({
  canvasRef,
  svgRef,
  drawingTool,
  isZoomed,
  brushSize,
  cursorPosition,
  setCursorPosition,
  variation,
  editLayers,
  startDrawing,
  continueDrawing,
  endDrawing,
  renderDrawingLayers,
  isMoving,
  movingBox,
  setIsMoving,
  setMovingBox,
  setMoveStart,
  localConfig,
  currentFontWeight,
  fontWeightUpdateKey,
  forceRender
}: CanvasRendererProps) => {
  return (
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
          className={`absolute inset-0 rounded-lg ${(drawingTool === 'brush' || drawingTool === 'eraser' || drawingTool === 'line') && !isZoomed ? 'cursor-none' : drawingTool === 'eyedropper' ? 'cursor-crosshair' : drawingTool === 'move' ? 'cursor-move' : drawingTool === 'place' ? 'cursor-pointer' : 'cursor-crosshair'}`}
          style={{
            cursor: isZoomed && drawingTool === 'brush' ?
                    `url("data:image/svg+xml,%3Csvg width='${Math.max(brushSize * 2, 16)}' height='${Math.max(brushSize * 2, 16)}' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='${Math.max(brushSize, 8)}' cy='${Math.max(brushSize, 8)}' r='${Math.max(brushSize/2, 4)}' fill='rgba(0,0,0,0.2)' stroke='white' stroke-width='2'/%3E%3Ccircle cx='${Math.max(brushSize, 8)}' cy='${Math.max(brushSize, 8)}' r='1' fill='white'/%3E%3C/svg%3E") ${Math.max(brushSize, 8)} ${Math.max(brushSize, 8)}, crosshair` :
                    isZoomed && drawingTool === 'eraser' ?
                    `url("data:image/svg+xml,%3Csvg width='${Math.max(brushSize * 2, 16)}' height='${Math.max(brushSize * 2, 16)}' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='${Math.max(brushSize, 8)}' cy='${Math.max(brushSize, 8)}' r='${Math.max(brushSize/2, 4)}' fill='rgba(255,255,255,0.3)' stroke='%23ff6b6b' stroke-width='2'/%3E%3Ccircle cx='${Math.max(brushSize, 8)}' cy='${Math.max(brushSize, 8)}' r='1' fill='white'/%3E%3C/svg%3E") ${Math.max(brushSize, 8)} ${Math.max(brushSize, 8)}, crosshair` :
                    isZoomed && drawingTool === 'line' ? 'none' :
                    isZoomed && drawingTool === 'eyedropper' ? `url("data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='2' fill='white' stroke='black' stroke-width='1'/%3E%3C/svg%3E") 16 16, crosshair` :
                    isZoomed && drawingTool === 'move' ? 'move' : undefined
          }}
          onMouseDown={startDrawing}
          onMouseMove={(e) => {
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
          }}
          onDoubleClick={() => {
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
           drawingTool === 'line' ? `📏 Line` :
           drawingTool === 'eyedropper' ? `🎨 Pipette` :
           drawingTool === 'move' ? `↔️ Move Elements` :
           drawingTool === 'place' ? `📍 Place Here` :
           '✏️ Drawing'}
          {isZoomed && <span className="ml-2 text-blue-400">2x</span>}
        </div>

        {/* Custom Cursor Overlay */}
        {cursorPosition && (drawingTool === 'brush' || drawingTool === 'eraser') && !isZoomed && (
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
              className={`border-2 border-white shadow-lg rounded-full ${
                drawingTool === 'brush' ? 'bg-black/20' :
                drawingTool === 'eraser' ? 'bg-white/30' : 'bg-blue-500/30'
              }`}
              style={{
                width: `${brushSize}px`,
                height: `${brushSize}px`,
                borderColor: drawingTool === 'eraser' ? '#ff6b6b' : '#000'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};