import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function Model({ color, ...props }) {
  const { scene } = useGLTF("gltf-files/10_11_2024-2.glb");

  return <primitive object={scene} {...props} />;
}

useGLTF.preload("gltf-files/10_11_2024-2.glb");
