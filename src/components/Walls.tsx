import React from "react";
import { useStore } from "../store";
import { Plane } from "./Shapes/Plane";

// https://www.npmjs.com/package/nice-color-palettes
// https://raw.githubusercontent.com/Jam3/nice-color-palettes/HEAD/visualize/1000.png
// const palette = niceColors[6]; // e.g. => [ "#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900" ]
export function Walls() {
  const worldSize = useStore((state) => state.worldSize);
  // const palette = ["#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900"];
  // const rotFrontBack =
  const walls = [
    // {/* in front */}
    {
      rotation: [0 * Math.PI, 0, 0],
      color: "#27d3ca",
      position: [0, -0, -worldSize],
    },
    // {/* behind */}
    {
      rotation: [0, -1 * Math.PI, 0],
      color: "#e72747",
      position: [0, -0, worldSize],
    },
    // {/* left */}
    {
      rotation: [0, 0.5 * Math.PI, 0],
      color: "#f38630",
      position: [-worldSize, 0, 0],
    },
    // {/* right */}
    {
      rotation: [0, -0.5 * Math.PI, 0],
      color: "#f38630",
      position: [worldSize, -0, 0],
    },
    // {/* floor */}
    {
      rotation: [-0.5 * Math.PI, 0, 0],
      color: "#d5fd8b",
      position: [0, -worldSize, 0],
    },
    // {/* ceiling */}
    {
      rotation: [0.5 * Math.PI, 0, 0],
      color: "#ab3deb",
      position: [0, worldSize, 0],
    },
  ];

  return (
    <>
      {walls.map((props) => (
        <Plane {...props} width={worldSize * 2} height={worldSize * 2} />
      ))}
    </>
  );
}