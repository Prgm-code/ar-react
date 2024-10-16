"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function ARScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [arJsLoaded, setArJsLoaded] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [modelStatus, setModelStatus] = useState<
    "loading" | "placed" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("AR.js script loaded successfully");
      setArJsLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load AR.js script");
      setErrorMessage("Failed to load AR.js script");
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (arJsLoaded && sceneRef.current && videoRef.current) {
      requestCameraPermission();
    }
  }, [arJsLoaded]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      initializeAR();
    } catch (error) {
      console.error("Error accessing camera:", error);
      setErrorMessage(
        "Failed to access camera. Please ensure you've granted camera permissions."
      );
    }
  };

  const initializeAR = () => {
    if (typeof window.THREEx === "undefined") {
      console.error("AR.js has not loaded properly, THREEx is undefined");
      setErrorMessage("AR.js failed to initialize properly");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (sceneRef.current) {
      sceneRef.current.appendChild(renderer.domElement);
    }

    const arToolkitSource = new window.THREEx.ArToolkitSource({
      sourceType: "webcam",
    });

    arToolkitSource.init(() => {
      setTimeout(() => {
        onResize();
      }, 2000);
    });

    const arToolkitContext = new window.THREEx.ArToolkitContext({
      cameraParametersUrl:
        "https://raw.githack.com/AR-js-org/AR.js/master/data/data/camera_para.dat",
      detectionMode: "mono",
    });

    arToolkitContext.init(() => {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    const markerRoot = new THREE.Group();
    scene.add(markerRoot);

    const markerControls = new window.THREEx.ArMarkerControls(
      arToolkitContext,
      markerRoot,
      {
        type: "pattern",
        patternUrl:
          "https://raw.githack.com/AR-js-org/AR.js/master/data/data/patt.hiro",
      }
    );

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/gltf-files/10_11_2024-2.glb",
      (gltf) => {
        console.log("GLTF model loaded successfully");
        const model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        markerRoot.add(model);
        setModelStatus("placed");
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% of model loaded");
      },
      (error) => {
        console.error("An error occurred while loading the GLTF model:", error);
        setModelStatus("error");
        setErrorMessage(`Failed to load 3D model: ${error.message}`);
      }
    );

    const onResize = () => {
      arToolkitSource.onResizeElement();
      arToolkitSource.copyElementSizeTo(renderer.domElement);
      if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
      }
    };

    window.addEventListener("resize", onResize);

    const animate = () => {
      requestAnimationFrame(animate);

      if (arToolkitSource.ready !== false) {
        arToolkitContext.update(arToolkitSource.domElement);
      }

      renderer.render(scene, camera);
    };

    animate();
  };

  return (
    <div className="relative w-full h-screen">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        playsInline
        autoPlay
        muted
      />
      <div ref={sceneRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="absolute top-0 left-0 z-10 p-4 bg-black bg-opacity-50 text-white">
        <h1 className="text-2xl font-bold">AR GLTF Viewer</h1>
        <p className="mt-2">
          {!cameraPermission &&
            "Por favor, concede permiso de cámara para usar AR."}
          {cameraPermission &&
            modelStatus === "loading" &&
            "Cargando modelo..."}
          {cameraPermission &&
            modelStatus === "placed" &&
            "Modelo cargado. Muestra el marcador Hiro a la cámara para ver el modelo."}
          {cameraPermission &&
            modelStatus === "error" &&
            "Error al cargar el modelo."}
        </p>
        {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
}
