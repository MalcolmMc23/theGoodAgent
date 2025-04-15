import React, { useState, useRef } from "react";
import { CanvasElement as CanvasElementType } from "./types";

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: (id: string, isMultiSelect: boolean) => void;
  onUpdate: (element: CanvasElementType) => void;
}

export default function CanvasElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
}: CanvasElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id, e.ctrlKey || e.metaKey);

    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setStartWidth(element.width);
    setStartHeight(element.height);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      onUpdate({
        ...element,
        x: element.x + deltaX,
        y: element.y + deltaY,
      });

      setStartX(e.clientX);
      setStartY(e.clientY);
    } else if (isResizing) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      onUpdate({
        ...element,
        width: Math.max(50, startWidth + deltaX),
        height: Math.max(50, startHeight + deltaY),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...element,
      content: e.target.value,
    });
  };

  const getElementStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      transform: `rotate(${element.rotation}deg)`,
      zIndex: element.zIndex,
      userSelect: "none",
    };

    switch (element.type) {
      case "sticky":
        return {
          ...baseStyle,
          backgroundColor: element.color,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "8px",
          overflow: "hidden",
        };
      case "text":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      case "rectangle":
        return {
          ...baseStyle,
          border: `2px solid ${element.color}`,
          backgroundColor: "transparent",
        };
      case "circle":
        return {
          ...baseStyle,
          border: `2px solid ${element.color}`,
          borderRadius: "50%",
          backgroundColor: "transparent",
        };
      case "arrow":
      case "line":
        return baseStyle;
      default:
        return baseStyle;
    }
  };

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove as any);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  return (
    <div
      ref={elementRef}
      style={getElementStyle()}
      onMouseDown={handleMouseDown}
      className={`${isSelected ? "ring-2 ring-blue-500" : ""}`}
    >
      {(element.type === "sticky" || element.type === "text") && (
        <textarea
          className="w-full h-full bg-transparent resize-none border-none focus:outline-none"
          value={element.content || ""}
          onChange={handleContentChange}
          style={{
            fontFamily:
              element.type === "sticky" ? "handwritten, cursive" : "inherit",
            fontSize: element.type === "text" ? "16px" : "14px",
          }}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {/* Render resize handle when selected */}
      {isSelected && (
        <div
          className="absolute w-10 h-10 bottom-0 right-0 cursor-nwse-resize flex items-center justify-center"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="w-3 h-3 bg-blue-500 rounded-sm" />
        </div>
      )}
    </div>
  );
}
