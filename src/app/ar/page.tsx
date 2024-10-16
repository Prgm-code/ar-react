import React from "react";
import { VisualizeAr } from "../Components/VisualizeAr";
import { ARScene } from "../Components/ArScene";
import { App } from "../Components/Xr";

function page() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* 
      <ARScene />
      <App />
      */}
      <VisualizeAr />
    </div>
  );
}

export default page;
