"use client";

import React from "react";
import { ARCanvas, XR, DefaultXRControllers } from "@react-three/xr";
import { MeshBasicMaterial } from "three";
import { useXRPlanes, XRPlaneModel, XRSpace } from "@react-three/xr";

function RedWalls() {
  const wallPlanes = useXRPlanes("wall");

  return (
    <>
      {wallPlanes.map((plane, index) => (
        <XRSpace key={index} space={plane.planeSpace}>
          <XRPlaneModel plane={plane}>
            <meshBasicMaterial attach="material" color="red" />
          </XRPlaneModel>
        </XRSpace>
      ))}
    </>
  );
}

export default function App() {
  return (
    <ARCanvas
      sessionInit={{ optionalFeatures: ["local-floor", "bounded-floor"] }}
    >
      <XR>
        <DefaultXRControllers />
        {/* Componente RedWalls dentro del contexto XR */}
        <RedWalls />
      </XR>
    </ARCanvas>
  );
}
