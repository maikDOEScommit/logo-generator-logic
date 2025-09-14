import { X } from 'lucide-react';
import { DrawingToolbar } from './DrawingToolbar';
import { LayerManager } from './LayerManager';
import { ColorPalette } from './ColorPalette';
import { ToolSettings } from './ToolSettings';
import { ElementControls } from './ElementControls';

type DrawingTool = 'brush' | 'eraser' | 'box' | 'line' | 'eyedropper' | 'move' | 'place';

interface EditLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'background' | 'original' | 'logo' | 'custom' | 'elements';
  strokes: any[];
  backgroundColor?: string;
  elements?: any[];
  order: number;
}

interface LogoElements {
  brand: any | null;
  slogan: any | null;
  icon: any | null;
}

interface EditorSidebarProps {
  onClose: () => void;
  drawingTool: DrawingTool;
  onDrawingToolChange: (tool: DrawingTool) => void;

  // Layer management
  editLayers: EditLayer[];
  activeLayer: string;
  onActiveLayerChange: (layerId: string) => void;
  onLayersChange: (layers: EditLayer[]) => void;
  onMoveLayerUp: (layerId: string) => void;
  onMoveLayerDown: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  onAddCustomLayer: (name: string) => void;
  onUpdateLayerBackgroundColor: (layerId: string, color: string) => void;

  // Tool settings
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
  eraserOpacity: number;
  brushLineCap: 'round' | 'square';
  onBrushColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onBrushOpacityChange: (opacity: number) => void;
  onEraserOpacityChange: (opacity: number) => void;
  onBrushLineCapChange: (lineCap: 'round' | 'square') => void;

  boxStrokeColor: string;
  boxFillColor: string;
  boxOpacity: number;
  selectedBox: string | null;
  onBoxStrokeColorChange: (color: string) => void;
  onBoxFillColorChange: (color: string) => void;
  onBoxOpacityChange: (opacity: number) => void;
  onBoxUpdate: (boxId: string, updates: any) => void;

  lineColor: string;
  lineWidth: number;
  lineCap: 'round' | 'square';
  onLineColorChange: (color: string) => void;
  onLineWidthChange: (width: number) => void;
  onLineCapChange: (lineCap: 'round' | 'square') => void;

  // Element controls
  selectedElement: string | null;
  logoElements: LogoElements;
  onLogoElementsChange: (elements: LogoElements) => void;
  onCenterElements: () => void;
}

export const EditorSidebar = (props: EditorSidebarProps) => {
  return (
    <div className="w-[456px] p-6 overflow-y-auto bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-white font-bold text-2xl mb-1">Edit Logo</h3>
          <p className="text-white/60 text-sm">Professional editing tools</p>
        </div>
        <button
          onClick={props.onClose}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          title="Close Editor"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex gap-4 h-full">
        {/* Main Column (70%) */}
        <div className="flex-[0.7] space-y-6 overflow-y-auto">
          <DrawingToolbar
            drawingTool={props.drawingTool}
            onToolChange={props.onDrawingToolChange}
          />

          <LayerManager
            editLayers={props.editLayers}
            activeLayer={props.activeLayer}
            onActiveLayerChange={props.onActiveLayerChange}
            onLayersChange={props.onLayersChange}
            onMoveLayerUp={props.onMoveLayerUp}
            onMoveLayerDown={props.onMoveLayerDown}
            onDeleteLayer={props.onDeleteLayer}
            onAddCustomLayer={props.onAddCustomLayer}
          />

          <ColorPalette
            editLayers={props.editLayers}
            activeLayer={props.activeLayer}
            onUpdateLayerBackgroundColor={props.onUpdateLayerBackgroundColor}
          />

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
            <ToolSettings
              drawingTool={props.drawingTool}
              brushColor={props.brushColor}
              brushSize={props.brushSize}
              brushOpacity={props.brushOpacity}
              eraserOpacity={props.eraserOpacity}
              brushLineCap={props.brushLineCap}
              onBrushColorChange={props.onBrushColorChange}
              onBrushSizeChange={props.onBrushSizeChange}
              onBrushOpacityChange={props.onBrushOpacityChange}
              onEraserOpacityChange={props.onEraserOpacityChange}
              onBrushLineCapChange={props.onBrushLineCapChange}
              boxStrokeColor={props.boxStrokeColor}
              boxFillColor={props.boxFillColor}
              boxOpacity={props.boxOpacity}
              selectedBox={props.selectedBox}
              onBoxStrokeColorChange={props.onBoxStrokeColorChange}
              onBoxFillColorChange={props.onBoxFillColorChange}
              onBoxOpacityChange={props.onBoxOpacityChange}
              onBoxUpdate={props.onBoxUpdate}
              lineColor={props.lineColor}
              lineWidth={props.lineWidth}
              lineCap={props.lineCap}
              onLineColorChange={props.onLineColorChange}
              onLineWidthChange={props.onLineWidthChange}
              onLineCapChange={props.onLineCapChange}
            />
          </div>

          <ElementControls
            selectedElement={props.selectedElement}
            logoElements={props.logoElements}
            onLogoElementsChange={props.onLogoElementsChange}
            onCenterElements={props.onCenterElements}
          />
        </div>

        {/* Secondary Column (30%) */}
        <div className="flex-[0.3] space-y-4 overflow-y-auto">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h5 className="text-white font-medium text-sm mb-3">Quick Actions</h5>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded text-xs transition-colors">
                Undo Last Action
              </button>
              <button className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded text-xs transition-colors">
                Clear All Drawings
              </button>
              <button className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded text-xs transition-colors">
                Reset Elements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};