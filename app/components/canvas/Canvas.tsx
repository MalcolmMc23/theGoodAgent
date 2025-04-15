import React, { useState, useRef, useEffect } from "react";
import CanvasContext from "./CanvasContext";
import CanvasToolbar from "./CanvasToolbar";
import CanvasElement from "./CanvasElement";
import Minimap from "./Minimap";
import {
  ElementType,
  CanvasState,
  CanvasElement as CanvasElementType,
} from "./types";

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    elements: [],
    selectedElementIds: [],
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    tool: "select",
  });

  const handleAddElement = (type: ElementType) => {
    const newElement: CanvasElementType = {
      id: Date.now().toString(),
      type,
      x: -canvasState.offsetX + window.innerWidth / 2 - 100,
      y: -canvasState.offsetY + window.innerHeight / 2 - 100,
      width: 200,
      height: type === "sticky" ? 200 : type === "text" ? 100 : 150,
      content:
        type === "text" ? "Text" : type === "sticky" ? "Sticky note" : "",
      color: type === "sticky" ? "#FFFF88" : "#000000",
      rotation: 0,
      zIndex: canvasState.elements.length,
    };

    setCanvasState({
      ...canvasState,
      elements: [...canvasState.elements, newElement],
      selectedElementIds: [newElement.id],
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (canvasState.tool === "select" && e.target === canvasRef.current) {
      // Start panning the canvas
      setCanvasState({
        ...canvasState,
        isDragging: true,
        lastMouseX: e.clientX,
        lastMouseY: e.clientY,
        selectedElementIds: [],
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (canvasState.isDragging) {
      const deltaX = e.clientX - canvasState.lastMouseX;
      const deltaY = e.clientY - canvasState.lastMouseY;

      setCanvasState({
        ...canvasState,
        offsetX: canvasState.offsetX + deltaX,
        offsetY: canvasState.offsetY + deltaY,
        lastMouseX: e.clientX,
        lastMouseY: e.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    if (canvasState.isDragging) {
      setCanvasState({
        ...canvasState,
        isDragging: false,
      });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    // Calculate new scale with zooming towards cursor position
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newScale = Math.max(0.1, Math.min(5, canvasState.scale + delta));

    // Calculate mouse position relative to canvas
    const mouseX = e.clientX - canvasState.offsetX;
    const mouseY = e.clientY - canvasState.offsetY;

    // Calculate new offsets to zoom towards cursor
    const newOffsetX = e.clientX - mouseX * (newScale / canvasState.scale);
    const newOffsetY = e.clientY - mouseY * (newScale / canvasState.scale);

    setCanvasState({
      ...canvasState,
      scale: newScale,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
    });
  };

  const handleSelectElement = (id: string, isMultiSelect: boolean) => {
    setCanvasState({
      ...canvasState,
      selectedElementIds: isMultiSelect
        ? canvasState.selectedElementIds.includes(id)
          ? canvasState.selectedElementIds.filter(
              (elementId) => elementId !== id
            )
          : [...canvasState.selectedElementIds, id]
        : [id],
    });
  };

  const handleUpdateElement = (updatedElement: CanvasElementType) => {
    setCanvasState({
      ...canvasState,
      elements: canvasState.elements.map((element) =>
        element.id === updatedElement.id ? updatedElement : element
      ),
    });
  };

  const handleDeleteSelected = () => {
    if (canvasState.selectedElementIds.length > 0) {
      setCanvasState({
        ...canvasState,
        elements: canvasState.elements.filter(
          (element) => !canvasState.selectedElementIds.includes(element.id)
        ),
        selectedElementIds: [],
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        handleDeleteSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvasState.selectedElementIds]);

  return (
    <CanvasContext.Provider value={{ canvasState, setCanvasState }}>
      <div className="h-screen w-full overflow-hidden flex flex-col">
        <CanvasToolbar
          onAddElement={handleAddElement}
          onChangeTool={(tool) => setCanvasState({ ...canvasState, tool })}
          selectedTool={canvasState.tool}
          onDeleteSelected={handleDeleteSelected}
        />

        <div
          ref={canvasRef}
          className="flex-1 relative bg-gray-100 dark:bg-gray-900 cursor-grab overflow-hidden"
          style={{ cursor: canvasState.isDragging ? "grabbing" : "grab" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="absolute"
            style={{
              transform: `translate(${canvasState.offsetX}px, ${canvasState.offsetY}px) scale(${canvasState.scale})`,
              transformOrigin: "0 0",
            }}
          >
            {/* Grid pattern */}
            <div className="absolute top-0 left-0 w-[10000px] h-[10000px] -translate-x-5000px -translate-y-5000px pointer-events-none">
              <div className="w-full h-full bg-[repeating-linear-gradient(#ccc_0px,#ccc_1px,transparent_1px,transparent_20px),repeating-linear-gradient(90deg,#ccc_0px,#ccc_1px,transparent_1px,transparent_20px)] dark:bg-[repeating-linear-gradient(#333_0px,#333_1px,transparent_1px,transparent_20px),repeating-linear-gradient(90deg,#333_0px,#333_1px,transparent_1px,transparent_20px)]"></div>
            </div>

            {/* Canvas elements */}
            {canvasState.elements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={canvasState.selectedElementIds.includes(element.id)}
                onSelect={handleSelectElement}
                onUpdate={handleUpdateElement}
              />
            ))}
          </div>
        </div>

        <Minimap
          elements={canvasState.elements}
          offsetX={canvasState.offsetX}
          offsetY={canvasState.offsetY}
          scale={canvasState.scale}
          onNavigate={(x, y) =>
            setCanvasState({ ...canvasState, offsetX: x, offsetY: y })
          }
        />
      </div>
    </CanvasContext.Provider>
  );
}
