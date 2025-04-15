import React from "react";
import { CanvasTool, ElementType } from "./types";

interface CanvasToolbarProps {
  onAddElement: (type: ElementType) => void;
  onChangeTool: (tool: CanvasTool) => void;
  selectedTool: CanvasTool;
  onDeleteSelected: () => void;
}

export default function CanvasToolbar({
  onAddElement,
  onChangeTool,
  selectedTool,
  onDeleteSelected,
}: CanvasToolbarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
      <ToolButton
        isActive={selectedTool === "select"}
        onClick={() => onChangeTool("select")}
        icon="👆"
        tooltip="Select"
      />
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1" />
      <ToolButton
        isActive={selectedTool === "sticky"}
        onClick={() => {
          onChangeTool("sticky");
          onAddElement("sticky");
        }}
        icon="📝"
        tooltip="Sticky Note"
      />
      <ToolButton
        isActive={selectedTool === "text"}
        onClick={() => {
          onChangeTool("text");
          onAddElement("text");
        }}
        icon="T"
        tooltip="Text"
      />
      <ToolButton
        isActive={selectedTool === "rectangle"}
        onClick={() => {
          onChangeTool("rectangle");
          onAddElement("rectangle");
        }}
        icon="□"
        tooltip="Rectangle"
      />
      <ToolButton
        isActive={selectedTool === "circle"}
        onClick={() => {
          onChangeTool("circle");
          onAddElement("circle");
        }}
        icon="○"
        tooltip="Circle"
      />
      <ToolButton
        isActive={selectedTool === "arrow"}
        onClick={() => {
          onChangeTool("arrow");
          onAddElement("arrow");
        }}
        icon="→"
        tooltip="Arrow"
      />
      <ToolButton
        isActive={selectedTool === "line"}
        onClick={() => {
          onChangeTool("line");
          onAddElement("line");
        }}
        icon="—"
        tooltip="Line"
      />
      <ToolButton
        isActive={selectedTool === "pen"}
        onClick={() => onChangeTool("pen")}
        icon="✏️"
        tooltip="Pen"
      />
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1" />
      <ToolButton
        isActive={false}
        onClick={onDeleteSelected}
        icon="🗑️"
        tooltip="Delete Selected"
      />
    </div>
  );
}

interface ToolButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: string;
  tooltip: string;
}

function ToolButton({ isActive, onClick, icon, tooltip }: ToolButtonProps) {
  return (
    <button
      className={`w-8 h-8 flex items-center justify-center rounded ${
        isActive
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      onClick={onClick}
      title={tooltip}
    >
      {icon}
    </button>
  );
}
