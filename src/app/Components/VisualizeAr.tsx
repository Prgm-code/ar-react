"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

export const VisualizeAr = () => {
  const canvasRef = useRef<HTMLDivElement>(null); // Tipar correctamente el ref

  useEffect(() => {
    // Configuración de la escena Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      10
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Configurar el tamaño del renderizado
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Habilitar la realidad aumentada (WebXR)

    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);

      // Añadir el botón AR dentro del mismo contenedor del canvas
      const arButton = ARButton.createButton(renderer);
      canvasRef.current.appendChild(arButton);
    }

    // Añadir luces
    const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiental
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Luz direccional
    scene.add(ambientLight);
    scene.add(directionalLight);

    // Cargar el modelo GLTF
    const loader = new GLTFLoader();
    loader.load("/gltf-files/10_11_2024-2.glb", (gltf: THREE.GLTF) => {
      const model = gltf.scene;
      model.position.set(0, 0, -1); // Posiciona el modelo frente a la cámara
      scene.add(model);
    });

    // Animación y renderizado
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };
    animate();

    // Manejo de redimensionamiento de ventana
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup: Eliminar el renderizador del DOM y cancelar animación cuando el componente es desmontado
    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      renderer.setAnimationLoop(null); // Detener el bucle de animación
      cancelAnimationFrame(animationFrameId); // Cancelar la animación
    };
  }, []);

  return <div ref={canvasRef} style={{ width: "100%", height: "100%" }}></div>;
};
