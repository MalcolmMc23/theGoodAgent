import React from "react";
import { CanvasElement } from "./types";

interface MinimapProps {
  elements: CanvasElement[];
  offsetX: number;
  offsetY: number;
  scale: number;
  onNavigate: (x: number, y: number) => void;
}

export default function Minimap({
  elements,
  offsetX,
  offsetY,
  scale,
  onNavigate,
}: MinimapProps) {
  const mapWidth = 150;
  const mapHeight = 100;
  const mapScale = 0.05;

  // Calculate the bounds of all elements
  const bounds = React.useMemo(() => {
    if (elements.length === 0) {
      return { minX: -1000, minY: -1000, maxX: 1000, maxY: 1000 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach((element) => {
      minX = Math.min(minX, element.x);
      minY = Math.min(minY, element.y);
      maxX = Math.max(maxX, element.x + element.width);
      maxY = Math.max(maxY, element.y + element.height);
    });

    // Add padding
    const padding = 200;
    return {
      minX: minX - padding,
      minY: minY - padding,
      maxX: maxX + padding,
      maxY: maxY + padding,
    };
  }, [elements]);

  // Check if we're in a browser environment
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate viewport rectangle - Only when in client
  const viewport = React.useMemo(() => {
    if (!isClient) {
      return {
        x: 0,
        y: 0,
        width: mapWidth / 2,
        height: mapHeight / 2,
      };
    }

    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1000;
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 800;

    return {
      x: (-offsetX / scale) * mapScale,
      y: (-offsetY / scale) * mapScale,
      width: (viewportWidth / scale) * mapScale,
      height: (viewportHeight / scale) * mapScale,
    };
  }, [isClient, offsetX, offsetY, scale, mapScale]);

  // Handle click on minimap
  const handleMinimapClick = (e: React.MouseEvent) => {
    if (!isClient) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / mapScale;
    const y = (e.clientY - rect.top) / mapScale;

    // Calculate the new offset
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1000;
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 800;

    const newOffsetX = -x * scale + viewportWidth / 2;
    const newOffsetY = -y * scale + viewportHeight / 2;

    onNavigate(newOffsetX, newOffsetY);
  };

  if (!isClient) {
    // Return a simplified version during SSR
    return (
      <div className="absolute bottom-4 right-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div style={{ width: mapWidth, height: mapHeight }}>
          <div>Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div
        className="relative"
        style={{ width: mapWidth, height: mapHeight }}
        onClick={handleMinimapClick}
      >
        {/* Render elements */}
        {elements.map((element) => (
          <div
            key={element.id}
            style={{
              position: "absolute",
              left: (element.x - bounds.minX) * mapScale,
              top: (element.y - bounds.minY) * mapScale,
              width: element.width * mapScale,
              height: element.height * mapScale,
              backgroundColor:
                element.type === "sticky" ? element.color : "gray",
              border:
                element.type !== "sticky"
                  ? `1px solid ${element.color}`
                  : "none",
              borderRadius: element.type === "circle" ? "50%" : "0",
            }}
          />
        ))}

        {/* Render viewport */}
        <div
          style={{
            position: "absolute",
            left: viewport.x,
            top: viewport.y,
            width: viewport.width,
            height: viewport.height,
            border: "2px solid blue",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
          }}
        />
      </div>
    </div>
  );
}
