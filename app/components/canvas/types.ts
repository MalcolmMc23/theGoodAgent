export type ElementType = "sticky" | "text" | "rectangle" | "circle" | "arrow" | "line";

export type CanvasTool = "select" | "sticky" | "text" | "rectangle" | "circle" | "arrow" | "line" | "pen";

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  color: string;
  rotation: number;
  zIndex: number;
  points?: { x: number; y: number }[]; // For lines and arrows
}

export interface CanvasState {
  elements: CanvasElement[];
  selectedElementIds: string[];
  scale: number;
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
  tool: CanvasTool;
} 