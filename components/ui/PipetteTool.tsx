// components/tools/PipetteTool.tsx
'use client';

import React from 'react';
import { Point } from '../ui/LogoEditor';

export interface LogoElements {
  brand: any | null;
  slogan: any | null;
  icon: any | null;
}

export interface EditLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'background' | 'original' | 'logo' | 'custom' | 'elements';
  order: number;
  backgroundColor?: string;
  strokes?: Stroke[];
  elements?: any[];
}

export interface Stroke {
  id: string;
  tool: string;
  points: Point[];
  color: string;
  width: number;
  opacity: number;
  lineCap?: 'round' | 'square';
}

export interface BoxShape {
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
  opacity: number;
  permanent: boolean;
}

interface PipetteToolProps {
  logoElements: LogoElements;
  editLayers: EditLayer[];
  boxes: BoxShape[];
  onColorSampled: (color: string | null) => void;
}

export class PipetteTool {
  private logoElements: LogoElements;
  private editLayers: EditLayer[];
  private boxes: BoxShape[];
  private onColorSampled: (color: string | null) => void;

  constructor(props: PipetteToolProps) {
    this.logoElements = props.logoElements;
    this.editLayers = props.editLayers;
    this.boxes = props.boxes;
    this.onColorSampled = props.onColorSampled;
  }

  public async sampleColor(point: Point, e: React.MouseEvent): Promise<void> {
    console.log('🎨 Pipette sampling at point:', point);

    try {
      let sampledColor: string | null = null;

      // Method 1: Check logo elements directly by position
      console.log('🔍 Checking logo elements at point:', point);

      // Check if point hits brand text element
      if (this.logoElements.brand) {
        const brand = this.logoElements.brand;
        const textWidth = brand.text.length * (brand.fontSize * 0.6); // Approximate text width
        const textHeight = brand.fontSize;

        if (point.x >= brand.x - textWidth/2 && point.x <= brand.x + textWidth/2 &&
            point.y >= brand.y - textHeight/2 && point.y <= brand.y + textHeight/2) {
          sampledColor = brand.color;
          console.log('✅ Sampled brand text color:', sampledColor);
        }
      }

      // Check if point hits slogan text element
      if (!sampledColor && this.logoElements.slogan) {
        const slogan = this.logoElements.slogan;
        const textWidth = slogan.text.length * (slogan.fontSize * 0.6);
        const textHeight = slogan.fontSize;

        if (point.x >= slogan.x - textWidth/2 && point.x <= slogan.x + textWidth/2 &&
            point.y >= slogan.y - textHeight/2 && point.y <= slogan.y + textHeight/2) {
          sampledColor = slogan.color;
          console.log('✅ Sampled slogan text color:', sampledColor);
        }
      }

      // Check if point hits icon element
      if (!sampledColor && this.logoElements.icon) {
        const icon = this.logoElements.icon;
        const iconBounds = {
          left: icon.x - icon.size/2,
          right: icon.x + icon.size/2,
          top: icon.y - icon.size/2,
          bottom: icon.y + icon.size/2
        };

        if (point.x >= iconBounds.left && point.x <= iconBounds.right &&
            point.y >= iconBounds.top && point.y <= iconBounds.bottom) {
          sampledColor = icon.color;
          console.log('✅ Sampled icon color:', sampledColor);
        }
      }

      // Check if point hits any strokes (brush/line drawings)
      if (!sampledColor) {
        for (const layer of this.editLayers) {
          if (layer.visible && layer.strokes) {
            for (const stroke of layer.strokes) {
              // Check if point is close to any point in the stroke path
              for (let i = 0; i < stroke.points.length - 1; i++) {
                const p1 = stroke.points[i];
                const p2 = stroke.points[i + 1];

                // Calculate distance from point to line segment
                const lineLength = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
                if (lineLength === 0) continue;

                const t = Math.max(0, Math.min(1, ((point.x - p1.x) * (p2.x - p1.x) + (point.y - p1.y) * (p2.y - p1.y)) / (lineLength * lineLength)));
                const projection = {
                  x: p1.x + t * (p2.x - p1.x),
                  y: p1.y + t * (p2.y - p1.y)
                };

                const distance = Math.sqrt(Math.pow(point.x - projection.x, 2) + Math.pow(point.y - projection.y, 2));

                // If click is within stroke width distance, sample the color
                if (distance <= stroke.width / 2 + 5) { // +5 for easier clicking
                  sampledColor = stroke.color;
                  console.log('✅ Sampled stroke color:', sampledColor, 'from stroke:', stroke.id);
                  break;
                }
              }
              if (sampledColor) break;
            }
            if (sampledColor) break;
          }
        }
      }

      // Check if point hits any boxes
      if (!sampledColor) {
        for (const box of this.boxes) {
          if (point.x >= box.x && point.x <= box.x + box.width &&
              point.y >= box.y && point.y <= box.y + box.height) {
            sampledColor = box.fillColor !== 'transparent' ? box.fillColor : box.strokeColor;
            console.log('✅ Sampled box color:', sampledColor, 'from box:', box.id);
            break;
          }
        }
      }

      // Check background layers
      if (!sampledColor) {
        const backgroundLayers = this.editLayers.filter(layer =>
          (layer.type === 'background' || layer.type === 'original') &&
          layer.visible &&
          layer.backgroundColor &&
          layer.backgroundColor !== 'transparent'
        );

        if (backgroundLayers.length > 0) {
          const topBackground = backgroundLayers.sort((a, b) => b.order - a.order)[0];
          const bgColor = topBackground.backgroundColor!;

          if (bgColor.includes('linear-gradient')) {
            // Extract first color from gradient
            const colorMatch = bgColor.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)/);
            if (colorMatch) {
              sampledColor = this.convertToHex(colorMatch[0]);
              console.log('✅ Sampled gradient background color:', sampledColor);
            }
          } else {
            sampledColor = bgColor;
            console.log('✅ Sampled background color:', sampledColor);
          }
        }
      }

      // Method 2: Fallback to DOM sampling if no logical hit
      if (!sampledColor) {
        console.log('🔍 Fallback: Using DOM element sampling...');
        const elementsUnderPoint = document.elementsFromPoint(e.clientX, e.clientY);

        for (const element of elementsUnderPoint) {
          if (element instanceof SVGTextElement) {
            const fill = element.getAttribute('fill');
            if (fill && fill !== 'none' && !fill.includes('url(')) {
              sampledColor = fill;
              console.log('✅ DOM sampled SVG text color:', sampledColor);
              break;
            }
          }
          else if (element instanceof SVGElement && element.tagName.toLowerCase() === 'path') {
            const fill = element.getAttribute('fill');
            if (fill && fill !== 'none' && !fill.includes('url(')) {
              sampledColor = fill;
              console.log('✅ DOM sampled SVG path color:', sampledColor);
              break;
            }
          }
          else if (element instanceof SVGRectElement) {
            const fill = element.getAttribute('fill');
            if (fill && fill !== 'none' && !fill.includes('url(')) {
              sampledColor = fill;
              console.log('✅ DOM sampled SVG rect color:', sampledColor);
              break;
            }
          }
        }
      }

      // Set the sampled color if found
      if (sampledColor) {
        sampledColor = this.convertToHex(sampledColor) || sampledColor;
        this.onColorSampled(sampledColor);
        console.log('🎯 Final sampled color:', sampledColor);
        return;
      }

    } catch (error) {
      console.error('❌ Error in sampleColor:', error);
    }

    // Fallback: use no color found
    console.log('🔄 No color found');
    this.onColorSampled(null);
  }

  // Helper function to convert rgb/rgba colors to hex
  private convertToHex(color: string): string | null {
    if (color.startsWith('#')) {
      return color.toUpperCase();
    }

    if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        const [r, g, b] = matches.map(Number);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
      }
    }

    return null;
  }

  // Update method to refresh data
  public updateData(props: PipetteToolProps): void {
    this.logoElements = props.logoElements;
    this.editLayers = props.editLayers;
    this.boxes = props.boxes;
    this.onColorSampled = props.onColorSampled;
  }
}

// React Hook for using the PipetteTool
export const usePipetteTool = (props: PipetteToolProps) => {
  const pipetteRef = React.useRef<PipetteTool>(new PipetteTool(props));

  // Update the tool when props change
  React.useEffect(() => {
    pipetteRef.current.updateData(props);
  }, [props]);

  const sampleColor = React.useCallback(
    (point: Point, e: React.MouseEvent) => {
      return pipetteRef.current.sampleColor(point, e);
    },
    []
  );

  return { sampleColor };
};