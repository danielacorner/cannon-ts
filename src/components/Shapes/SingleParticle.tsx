import React, { useRef } from "react";
import { useConvexPolyhedron } from "@react-three/cannon";
import { useJitterParticle } from "./useJitterParticle";
import { useStore } from "../../store";
import * as THREE from "three";
import { useChangeVelocityWhenTemperatureChanges } from "./useChangeVelocityWhenTemperatureChanges";
import styled from "styled-components/macro";
import { HTML } from "@react-three/drei";

/** Particle which can interact with others, or not (passes right through them) */
export function SingleParticle(props) {
  const Particle = props.interactive
    ? InteractiveParticle
    : NonInteractiveParticle;
  return <Particle {...props} />;
}
/** interacts with other particles using @react-three/cannon */
function InteractiveParticle(props) {
  const { position, Component, mass, numIcosahedronFaces } = props;

  const set = useStore((s) => s.set);
  const scale = useStore((s) => s.scale);
  const isTooltipMaximized = useStore((s) => s.isTooltipMaximized);
  const selectedProtein = useStore((s) => s.selectedProtein);
  const isSelectedProtein =
    selectedProtein && selectedProtein.name === props.name;

  // each virus has a polyhedron shape, usually icosahedron (20 faces)
  // this shape determines how it bumps into other particles
  // https://codesandbox.io/s/r3f-convex-polyhedron-cnm0s?from-embed=&file=/src/index.js:1639-1642
  const detail = Math.floor(numIcosahedronFaces / 20);
  const volumeOfSphere = (4 / 3) * Math.PI * props.radius ** 3;
  const mockMass = 10 ** -5 * volumeOfSphere;

  const [ref, api] = useConvexPolyhedron(() => ({
    // TODO: accurate mass data from PDB --> need to multiply by number of residues or something else? doesn't seem right
    mass: mockMass, // approximate mass using volume of a sphere equation
    position,
    // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
    args: new THREE.IcosahedronGeometry(1, detail),
  }));

  useJitterParticle({
    mass,
    ref,
    api,
  });

  // when temperature changes, change particle velocity
  useChangeVelocityWhenTemperatureChanges({ mass, api });

  const handleSetSelectedProtein = () =>
    set({ selectedProtein: { ...props, api } });

  const pointerDownTime = useRef(0);
  // if we mousedown AND mouseup over the same particle very quickly, select it
  const handlePointerDown = () => {
    pointerDownTime.current = Date.now();
  };
  const handlePointerUp = () => {
    const timeSincePointerDown = Date.now() - pointerDownTime.current;
    if (timeSincePointerDown < 300) {
      handleSetSelectedProtein();
    }
  };

  // https://codeworkshop.dev/blog/2020-11-05-displacement-maps-normal-maps-and-textures-in-react-three-fiber/
  // const displacementMap = useLoader(
  //   THREE.TextureLoader,
  //   "/images/maps/displacement-map.jpg"
  // );
  // const normalMap = useLoader(
  //   THREE.TextureLoader,
  //   "/images/maps/normal-map.jpg"
  // );
  // // apply texture on mount to all mesh nodes
  // const circleRef = useRef(null as any);
  // React.useEffect(() => {
  //   if (ref.current) {
  //     console.log("🌟🚨 ~ React.useEffect ~ ref.current", ref.current);
  //     ref.current.traverse((node) => {
  //       console.log("🌟🚨 ~ ref.current.traverse ~ node", node);
  //       if ((node as any).material) {
  //         (node as any).material.displacementMap = displacementMap;
  //         (node as any).material.normalMap = normalMap;
  //       }
  //     });
  //   }
  //   if (circleRef.current) {
  //     circleRef.current.material.map = displacementMap;
  //     circleRef.current.material.displacementMap = displacementMap;
  //     circleRef.current.material.normalMap = normalMap;
  //   }
  // }, []);
  return (
    <mesh
      ref={ref}
      scale={[scale, scale, scale]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {isSelectedProtein && !isTooltipMaximized ? <HighlightParticle /> : null}
      <Component />
      {/* <mesh ref={circleRef}>
        <sphereBufferGeometry args={[10, 16, 16]} />
        <meshStandardMaterial
          attach="material"
          color={"red"}
          // map={displacementMap}
          // displacementMap={displacementMap}
          // normalMap={normalMap}
        />
      </mesh> */}
    </mesh>
  );
}

const CircleOutline = styled.div`
  pointer-events: none;
  border: 2px solid #ff4775;
  box-sizing: border-box;
  border-radius: 50%;
  width: ${(props) => props.radius * 2}px;
  height: ${(props) => props.radius * 2}px;
  margin-left: ${(props) => -props.radius}px;
  margin-top: ${(props) => -props.radius}px;
`;
function HighlightParticle() {
  const selectedProtein = useStore((s) => s.selectedProtein);
  const scale = useStore((s) => s.scale);
  return selectedProtein ? (
    <HTML>
      <CircleOutline radius={selectedProtein.radius * scale * 70} />
    </HTML>
  ) : null;
}

/** hide particle if too big or too small */
export function useShouldRenderParticle(radius: number) {
  const scale = useStore((s) => s.scale);
  const worldRadius = useStore((s) => s.worldRadius);

  return getShouldRenderParticle(scale, radius, worldRadius);
}

const MIN_RADIUS = 5;
const MAX_RADIUS = 20;
export function getShouldRenderParticle(
  scale: number,
  radius: number,
  worldRadius: number
) {
  const particleSize = scale * radius;
  const tooBigToRender = particleSize > worldRadius / MIN_RADIUS;
  const tooSmallToRender = particleSize < worldRadius / MAX_RADIUS;
  return !(tooBigToRender || tooSmallToRender);
}

/** doesn't interact with other particles (passes through them) */
function NonInteractiveParticle({
  pathToGLTF,
  mass,
  position,
  Component,
  numIcosahedronFaces,
  pathToImage,
}) {
  const ref = useRef();
  useJitterParticle({
    mass,
    ref,
  });
  const scale = useStore((state) => state.scale);

  return (
    <mesh
      renderOrder={3}
      ref={ref}
      scale={[scale, scale, scale]}
      position={position}
    >
      <Component />
    </mesh>
  );
}
