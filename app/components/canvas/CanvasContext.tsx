import React from "react";
import { CanvasState } from "./types";

interface CanvasContextType {
  canvasState: CanvasState;
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>;
}

const CanvasContext = React.createContext<CanvasContextType | undefined>(
  undefined
);

export default CanvasContext;
