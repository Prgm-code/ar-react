import { useGLTF } from "@react-three/drei";
//import * as THREE from "three";

export function Model({ color, ...props }: { color: string }) {
  const { scene } = useGLTF("gltf-files/10_11_2024-2.glb");

  console.log("color", color);

  return <primitive object={scene} scale={[3, 3, 3]} {...props} />;
}

useGLTF.preload("gltf-files/10_11_2024-2.glb");
