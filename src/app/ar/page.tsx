import React from "react";
import { VisualizeAr } from "../Components/VisualizeAr";
import { ARScene } from "../Components/ArScene";
import { App } from "../Components/Xr";

function page() {
  return (
    <div
      // style={{ width: "100vw", height: "100vh" }}
      className="relative w-full h-screen bg-slate-700"
    >
      {/* 
      <ARScene />
      <App />
      */}
      <VisualizeAr />
    </div>
  );
}

export default page;
