// components/editor/AdvancedFabricLogoEditor.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LogoConfig } from '@/lib/types';
import { 
  Brush, 
  Eraser, 
  Square, 
  Type, 
  Palette, 
  Download, 
  Image, 
  FileText, 
  RotateCcw, 
  Trash2,
  Move,
  MousePointer,
  Layers
} from 'lucide-react';
import html2canvas from 'html2canvas';

// Fabric.js types (simplified for this implementation)
interface FabricCanvas {
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  clear: () => void;
  add: (obj: any) => void;
  remove: (obj: any) => void;
  getObjects: () => any[];
  toDataURL: (options?: any) => string;
  toSVG: () => string;
  isDrawingMode: boolean;
  freeDrawingBrush: {
    color: string;
    width: number;
  };
  selection: boolean;
  renderAll: () => void;
  loadFromJSON: (json: any, callback?: () => void) => void;
  toJSON: () => any;
  dispose: () => void;
  on: (event: string, handler: (e: any) => void) => void;
  off: (event: string, handler?: (e: any) => void) => void;
}

// Tool types
type Tool = 'select' | 'brush' | 'eraser' | 'rectangle' | 'text';
type Mode = 'vector' | 'raster';

interface AdvancedFabricLogoEditorProps {
  config: LogoConfig;
  onConfigUpdate?: (newConfig: Partial<LogoConfig>) => void;
  onClose?: () => void;
}

export default function AdvancedFabricLogoEditor({
  config,
  onConfigUpdate,
  onClose
}: AdvancedFabricLogoEditorProps) {
  console.log('🔥 AdvancedFabricLogoEditor rendering...', config);
  
  // Canvas and Fabric refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  // State management
  const [currentTool, setCurrentTool] = useState<Tool>('select');
  const [currentMode, setCurrentMode] = useState<Mode>('vector');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [rectangleWidth, setRectangleWidth] = useState(100);
  const [rectangleHeight, setRectangleHeight] = useState(100);
  const [isRasterMode, setIsRasterMode] = useState(false);
  const [vectorStateBackup, setVectorStateBackup] = useState<any>(null);
  const [fabricLoaded, setFabricLoaded] = useState(false);

  // Initialize Fabric.js canvas
  const initializeFabricCanvas = useCallback(async () => {
    console.log('🔄 Starting Fabric canvas initialization...');
    if (!canvasRef.current) {
      console.error('❌ Canvas ref is null');
      return;
    }
    console.log('✅ Canvas ref exists');

    try {
      console.log('📦 Importing Fabric.js...');
      // Dynamic import of fabric
      const { Canvas, Text, Rect, Group } = await import('fabric');
      console.log('✅ Fabric.js imported successfully', Canvas);
      
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true
      });

      fabricCanvasRef.current = canvas as any;
      console.log('✅ Canvas created and stored in ref');
      
      setFabricLoaded(true);
      console.log('✅ fabricLoaded set to true');

      // Initialize with logo content
      console.log('🎨 Initializing logo content...');
      try {
        await initializeLogoContent(canvas, { Text, Rect, Group });
        console.log('✅ Logo content initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize logo content:', error);
        // Continue anyway, editor should work without logo content
      }

      console.log('✅ Fabric.js canvas initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize Fabric.js:', error);
    }
  }, []);

  // Initialize logo content on canvas
  const initializeLogoContent = async (canvas: any, fabricClasses: any) => {
    // Add brand text if available
    if (config.text) {
      const textObj = new fabricClasses.Text(config.text, {
        left: 400,
        top: 250,
        fontSize: 48,
        fill: config.palette?.colors[1] || '#000000',
        fontFamily: config.font?.cssName || 'Arial',
        fontWeight: config.fontWeight || 600,
        originX: 'center',
        originY: 'center',
        selectable: true,
        editable: true
      });
      canvas.add(textObj);
    }

    // Add slogan if available
    if (config.slogan) {
      const sloganObj = new fabricClasses.Text(config.slogan, {
        left: 400,
        top: 320,
        fontSize: 24,
        fill: config.palette?.colors[2] || '#666666',
        fontFamily: config.font?.cssName || 'Arial',
        fontWeight: 300,
        originX: 'center',
        originY: 'center',
        selectable: true,
        editable: true
      });
      canvas.add(sloganObj);
    }

    // Add icon if available (simplified - would need SVG loading in real implementation)
    if (config.icon) {
      try {
        // Create a placeholder rectangle for the icon (in real app, load actual SVG)
        const iconRect = new fabricClasses.Rect({
          left: 400,
          top: 150,
          width: 64,
          height: 64,
          fill: config.palette?.colors[1] || '#000000',
          originX: 'center',
          originY: 'center',
          selectable: true,
          stroke: '#cccccc',
          strokeWidth: 1
        });
        
        // Add label for icon
        const iconLabel = new fabricClasses.Text('📝', {
          left: 400,
          top: 150,
          fontSize: 32,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false
        });
        
        const iconGroup = new fabricClasses.Group([iconRect, iconLabel], {
          left: 400,
          top: 150,
          originX: 'center',
          originY: 'center',
          selectable: true
        });
        
        canvas.add(iconGroup);
      } catch (error) {
        console.warn('Failed to add icon:', error);
      }
    }

    canvas.renderAll();
  };

  // Tool handlers
  const handleToolChange = (tool: Tool) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    setCurrentTool(tool);

    // Reset canvas modes
    canvas.isDrawingMode = false;
    canvas.selection = true;

    switch (tool) {
      case 'select':
        canvas.selection = true;
        break;
        
      case 'brush':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = brushColor;
        canvas.freeDrawingBrush.width = brushSize;
        canvas.selection = false;
        break;
        
      case 'eraser':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = '#ffffff';
        canvas.freeDrawingBrush.width = brushSize;
        canvas.selection = false;
        break;
        
      case 'rectangle':
        canvas.selection = false;
        setupRectangleTool(canvas);
        break;
        
      case 'text':
        canvas.selection = false;
        setupTextTool(canvas);
        break;
    }
  };

  // Rectangle tool setup
  const setupRectangleTool = (canvas: any) => {
    let isDrawing = false;
    let origX = 0;
    let origY = 0;
    let rectangle: any = null;

    const onMouseDown = (e: any) => {
      if (currentTool !== 'rectangle') return;
      
      isDrawing = true;
      const pointer = canvas.getPointer(e.e);
      origX = pointer.x;
      origY = pointer.y;

      // Dynamic import inside the function
      import('fabric').then(({ Rect }) => {
        rectangle = new Rect({
          left: origX,
          top: origY,
          width: 0,
          height: 0,
          fill: brushColor,
          stroke: brushColor,
          strokeWidth: 2,
          selectable: false
        });
        canvas.add(rectangle);
      });
    };

    const onMouseMove = (e: any) => {
      if (!isDrawing || !rectangle) return;
      
      const pointer = canvas.getPointer(e.e);
      const width = Math.abs(pointer.x - origX);
      const height = Math.abs(pointer.y - origY);
      
      rectangle.set({
        left: Math.min(origX, pointer.x),
        top: Math.min(origY, pointer.y),
        width: width,
        height: height
      });
      
      canvas.renderAll();
    };

    const onMouseUp = () => {
      if (rectangle) {
        rectangle.set({ selectable: true });
        isDrawing = false;
        rectangle = null;
        setCurrentTool('select');
        canvas.selection = true;
      }
    };

    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onMouseUp);
  };

  // Text tool setup
  const setupTextTool = (canvas: any) => {
    const onMouseDown = (e: any) => {
      if (currentTool !== 'text') return;
      
      const pointer = canvas.getPointer(e.e);
      
      // Dynamic import inside the function
      import('fabric').then(({ Text }) => {
        const textObj = new Text('New Text', {
          left: pointer.x,
          top: pointer.y,
          fontSize: 24,
          fill: brushColor,
          selectable: true,
          editable: true
        });
        
        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        setCurrentTool('select');
        canvas.selection = true;
      });
    };

    canvas.on('mouse:down', onMouseDown);
  };

  // Mode switching functions
  const enterRasterMode = async () => {
    if (!fabricCanvasRef.current) return;

    try {
      // Backup current vector state
      const vectorState = fabricCanvasRef.current.toJSON();
      setVectorStateBackup(vectorState);

      // Create snapshot of current canvas
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      const snapshot = await html2canvas(canvasElement, {
        backgroundColor: '#ffffff',
        scale: 2 // Higher resolution
      });

      // Clear canvas and add snapshot as background
      fabricCanvasRef.current.clear();
      
      // Dynamic import of fabric
      const { FabricImage } = await import('fabric');
      
      const imgInstance = new FabricImage(snapshot, {
        left: 0,
        top: 0,
        selectable: false,
        evented: false
      });

      fabricCanvasRef.current.add(imgInstance);
      fabricCanvasRef.current.renderAll();

      setIsRasterMode(true);
      setCurrentMode('raster');
      setCurrentTool('brush');

      console.log('✅ Entered raster mode');

    } catch (error) {
      console.error('❌ Failed to enter raster mode:', error);
    }
  };

  const exitRasterMode = () => {
    setIsRasterMode(false);
    setCurrentMode('vector');
    setCurrentTool('select');
    console.log('✅ Exited raster mode');
  };

  // Export functions
  const exportAsPNG = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2 // High resolution
    });

    // Trigger download
    const link = document.createElement('a');
    link.download = `logo_${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('✅ Exported as PNG');
  };

  const exportAsSVG = () => {
    if (!fabricCanvasRef.current) return;

    let svgString = '';

    if (isRasterMode && vectorStateBackup) {
      console.warn('⚠️ SVG export from raster mode may produce complex results');
      // In a real implementation, you would use potrace.js here for vectorization
      svgString = fabricCanvasRef.current.toSVG();
    } else {
      svgString = fabricCanvasRef.current.toSVG();
    }

    // Trigger download
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `logo_${Date.now()}.svg`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ Exported as SVG');
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.clear();
    
    if (isRasterMode) {
      (fabricCanvasRef.current as any).backgroundColor = '#ffffff';
    } else {
      // Re-initialize with logo content in vector mode
      import('fabric').then(({ Text, Rect, Group }) => {
        initializeLogoContent(fabricCanvasRef.current, { Text, Rect, Group });
      });
    }
    
    fabricCanvasRef.current.renderAll();
  };

  // Update brush settings
  useEffect(() => {
    if (fabricCanvasRef.current && (currentTool === 'brush' || currentTool === 'eraser')) {
      fabricCanvasRef.current.freeDrawingBrush.color = currentTool === 'eraser' ? '#ffffff' : brushColor;
      fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
    }
  }, [brushColor, brushSize, currentTool]);

  // Initialize canvas on component mount
  useEffect(() => {
    console.log('🚀 useEffect triggered - will check for canvas DOM element');
    
    let retryCount = 0;
    const maxRetries = 10;
    
    const attemptInitialization = () => {
      console.log(`🔍 Checking if canvas DOM element is available... (attempt ${retryCount + 1})`);
      
      if (canvasRef.current) {
        console.log('✅ Canvas DOM element found, initializing Fabric.js');
        initializeFabricCanvas();
        return;
      }
      
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`⏱️ Canvas DOM element not yet available, retrying in ${50 * retryCount}ms...`);
        setTimeout(attemptInitialization, 50 * retryCount);
      } else {
        console.error('❌ Canvas DOM element still not available after all retries');
        // Force show the editor anyway as a fallback
        setFabricLoaded(true);
      }
    };

    // Start the initialization attempt after a short delay
    const initialDelay = setTimeout(attemptInitialization, 100);

    return () => {
      clearTimeout(initialDelay);
      // Cleanup
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 text-white z-50 flex">
      {/* Loading Overlay */}
      {!fabricLoaded && (
        <div className="absolute inset-0 bg-gray-900 text-white z-60 flex flex-col items-center justify-center">
          <div className="text-white text-lg mb-4">Loading Advanced Editor...</div>
          <div className="text-sm text-gray-400 mb-4">Initializing Fabric.js canvas...</div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Close
          </button>
          {/* Fallback: Load editor anyway after 5 seconds */}
          <div className="mt-4 space-y-2">
            <button 
              onClick={() => {
                console.log('🔧 Force loading editor...');
                setFabricLoaded(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm block mx-auto"
            >
              Force Load Editor (Debug)
            </button>
            
            <button 
              onClick={() => {
                console.log('🔄 Retrying initialization...');
                initializeFabricCanvas();
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm block mx-auto"
            >
              Retry Initialize
            </button>
            
            <div className="text-xs text-gray-500 text-center mt-2">
              Check browser console for debug info
            </div>
          </div>
        </div>
      )}
      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative bg-white rounded-lg shadow-2xl">
          <canvas 
            ref={canvasRef}
            className="rounded-lg"
          />
          
          {/* Mode indicator */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-gray-800/80 rounded-lg text-sm">
            {isRasterMode ? '🎨 Raster Mode' : '📐 Vector Mode'}
          </div>
          
          {/* Tool indicator */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-gray-800/80 rounded-lg text-sm">
            {currentTool === 'select' ? '👆 Select' :
             currentTool === 'brush' ? '🖌️ Brush' :
             currentTool === 'eraser' ? '🧽 Eraser' :
             currentTool === 'rectangle' ? '⬜ Rectangle' :
             currentTool === 'text' ? '📝 Text' : ''}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="w-80 bg-gray-800 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Advanced Editor</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Mode Switch */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Mode</h3>
            <button
              onClick={isRasterMode ? exitRasterMode : enterRasterMode}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isRasterMode 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRasterMode ? 'Exit Raster Mode' : 'Enter Raster Mode'}
            </button>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleToolChange('select')}
                className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  currentTool === 'select' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <MousePointer size={20} />
                <span className="text-xs">Select</span>
              </button>
              
              <button
                onClick={() => handleToolChange('brush')}
                className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  currentTool === 'brush' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Brush size={20} />
                <span className="text-xs">Brush</span>
              </button>
              
              <button
                onClick={() => handleToolChange('eraser')}
                className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  currentTool === 'eraser' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Eraser size={20} />
                <span className="text-xs">Eraser</span>
              </button>
              
              <button
                onClick={() => handleToolChange('rectangle')}
                disabled={isRasterMode}
                className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  currentTool === 'rectangle' ? 'bg-purple-600' : 
                  isRasterMode ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Square size={20} />
                <span className="text-xs">Rectangle</span>
              </button>
              
              <button
                onClick={() => handleToolChange('text')}
                disabled={isRasterMode}
                className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  currentTool === 'text' ? 'bg-green-600' : 
                  isRasterMode ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Type size={20} />
                <span className="text-xs">Text</span>
              </button>
              
              <button
                onClick={clearCanvas}
                className="p-3 rounded-lg flex flex-col items-center gap-1 bg-red-600 hover:bg-red-700 transition-colors"
              >
                <Trash2 size={20} />
                <span className="text-xs">Clear</span>
              </button>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Color</h3>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-12 h-12 rounded border-2 border-gray-600 cursor-pointer"
              />
              <span className="text-sm text-gray-300">{brushColor}</span>
            </div>
          </div>

          {/* Brush Size */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Brush Size: {brushSize}px</h3>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Rectangle Settings */}
          {currentTool === 'rectangle' && !isRasterMode && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Rectangle Size</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Width</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={rectangleWidth}
                    onChange={(e) => setRectangleWidth(parseInt(e.target.value))}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Height</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={rectangleHeight}
                    onChange={(e) => setRectangleHeight(parseInt(e.target.value))}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Export Options */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Export</h3>
            <div className="space-y-2">
              <button
                onClick={exportAsPNG}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Image size={16} />
                Download PNG
              </button>
              
              <button
                onClick={exportAsSVG}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <FileText size={16} />
                Download SVG
              </button>
            </div>
            
            {isRasterMode && (
              <p className="text-xs text-yellow-400 mt-2">
                ⚠️ SVG export from raster mode may produce complex results
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}