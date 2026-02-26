"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  useTexture,
  Float,
  SpotLight,
  MeshReflectorMaterial,
  MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";

// ============================================
// HOLOGRAPHIC AGENT (Zero-Texture / GPU Safe)
// ============================================
function HologramAgent({
  position,
  color,
  label,
  subtext,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  subtext: string;
}) {
  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.6}>
      <group position={position}>
        <mesh>
          <capsuleGeometry args={[0.3, 0.7, 4, 16]} />
          {/* We use MeshDistortMaterial but NO textures to save GPU slots */}
          <MeshDistortMaterial
            color={color}
            speed={4}
            distort={0.3}
            transparent
            opacity={0.7}
            emissive={color}
            emissiveIntensity={1.5}
          />
        </mesh>
        <Html position={[0, 1.1, 0]} center>
          <div className="flex flex-col items-center pointer-events-none select-none">
            <div className="bg-black/90 border border-white/20 px-2 py-1 text-white font-mono text-[8px] whitespace-nowrap uppercase tracking-widest">
              {label}
            </div>
            <div
              style={{ color: color }}
              className="font-mono text-[7px] mt-1 uppercase font-bold text-center w-24 leading-tight"
            >
              {subtext}
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
}

// ============================================
// NEON COUNTER (Texture-Free Logic)
// ============================================
function NeonCounter({
  position,
  args = [4, 1, 16],
  hasFrontLights = true,
}: {
  position: [number, number, number];
  args?: [number, number, number];
  hasFrontLights?: boolean;
}) {
  const neonColor = "#39FF14";
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color="#020202" roughness={0.1} metalness={0.9} />
      </mesh>
      {[args[1] / 2, -args[1] / 2].map((y, i) => (
        <lineSegments key={i} position={[0, y, 0]}>
          <edgesGeometry
            args={[new THREE.BoxGeometry(args[0], 0.01, args[2])]}
          />
          <lineBasicMaterial color={neonColor} linewidth={3} />
        </lineSegments>
      ))}
      {hasFrontLights &&
        [-4, 0, 4].map((z, i) => (
          <mesh key={i} position={[position[0] > 0 ? -2.01 : 2.01, 0, z]}>
            <planeGeometry
              args={[0.2, 0.4]}
              rotation={[0, position[0] > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
            />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
    </group>
  );
}

// ============================================
// MAIN SCENE
// ============================================
function Scene() {
  // Limited to 5 main template textures to stay safe
  const leftTextures = useTexture([
    "/pic1.png",
    "/pic2.png",
    "/pic3.png",
    "/pic4.png",
    "/pic5.png",
  ]);
  const clerkTexture = useTexture("/veejs.jpg");

  const agents = [
    {
      label: "WEB_DEV_BOT",
      subtext: "Autonomously builds sites",
      color: "#39FF14",
    },
    { label: "AI_FRIEND", subtext: "Emotional companion", color: "#FF69B4" },
    {
      label: "VIRTUAL_BF_GF",
      subtext: "Digital partnership",
      color: "#FF1493",
    },
    { label: "SYS_ARCHITECT", subtext: "Backend & Logic", color: "#00FFFF" },
    { label: "CREATIVE_GEN", subtext: "Video & Art", color: "#A020F0" },
  ];

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.01} />

      {/* COUNTERS */}
      <NeonCounter position={[-7.5, 0.5, 0]} />
      <NeonCounter position={[7.5, 0.5, 0]} />

      {/* CLERK & BACK DESK */}
      <group position={[0, 0.5, -8]}>
        <NeonCounter
          position={[0, 0, 0]}
          args={[4, 1, 2]}
          hasFrontLights={false}
        />
        <mesh position={[0, 1.2, -0.5]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial map={clerkTexture} transparent />
        </mesh>
      </group>

      {/* SHINY REFLECTIVE FLOOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          mirror={1}
          blur={[300, 100]}
          resolution={512} // Lowered resolution to stop crashes
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          color="#101010"
          metalness={0.5}
        />
      </mesh>

      {/* TEMPLATES (LEFT) */}
      {leftTextures.map((tex, idx) => (
        <Float key={idx} speed={1.5}>
          <mesh position={[-7.5, 3, idx * 3.5 - 7]}>
            <planeGeometry args={[1.8, 2.5]} />
            <meshBasicMaterial map={tex} transparent opacity={0.9} />
          </mesh>
        </Float>
      ))}

      {/* AGENTS (RIGHT) */}
      {agents.map((agent, idx) => (
        <HologramAgent
          key={idx}
          position={[7.5, 2.0, idx * 3.2 - 6]}
          color={agent.color}
          label={agent.label}
          subtext={agent.subtext}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.05}
      />
    </>
  );
}

export default function StorePage() {
  return (
    <main className="h-screen w-full bg-black overflow-hidden">
      <Canvas
        shadows
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <PerspectiveCamera makeDefault position={[0, 4, 16]} fov={45} />
        <Scene />
      </Canvas>
    </main>
  );
}
