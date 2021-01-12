/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei/useGLTF";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF(
    "/models/public/six_fold_symmetric_dna_scaffold_10.glb"
  );
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        material={nodes["6dklcif_A_SES_surface"].material}
        geometry={nodes["6dklcif_A_SES_surface"].geometry}
      />
      <mesh
        material={nodes["6dklcif_B_SES_surface"].material}
        geometry={nodes["6dklcif_B_SES_surface"].geometry}
      />
      <mesh
        material={nodes["6dklcif_C_SES_surface"].material}
        geometry={nodes["6dklcif_C_SES_surface"].geometry}
      />
      <mesh
        material={nodes["6dklcif_D_SES_surface"].material}
        geometry={nodes["6dklcif_D_SES_surface"].geometry}
      />
    </group>
  );
}

useGLTF.preload("/models/public/six_fold_symmetric_dna_scaffold_10.glb");