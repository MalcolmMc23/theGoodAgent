import React from "react";
import { Canvas } from "../components/canvas/Canvas";

export function meta() {
  return [
    { title: "FigJam-like Canvas" },
    {
      name: "description",
      content: "Interactive whiteboard with infinite canvas",
    },
  ];
}

export default function CanvasPage() {
  return <Canvas />;
}
