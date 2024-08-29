import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float, Text } from "@react-three/drei";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floorMaterial = new THREE.MeshStandardMaterial({
  color: "limegreen",
});

const floor2Material = new THREE.MeshStandardMaterial({
  color: "greenyellow",
});

const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: "orangered",
});

const wallMaterial = new THREE.MeshStandardMaterial({
  color: "slategrey",
});

export function BlockStart({position = [0, 0, 0]}) {
  return (
    <group position={position}>
    <Float>
      <Text scale={0.5} font="./bebas-neue-v9-latin-regular.woff" maxWidth={0.25} lineHeight={0.75} textAlign="right" position={[0.75, 0.65, 0]} rotation-y={ - 0.25}>
      Marble Race
      <meshBasicMaterial toneMapped={false} />
      </Text>
    </Float>
      <mesh
        geometry={boxGeometry}
        material={floorMaterial}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>
    </group>
  );
}

export function BlockEnd({ position = [0, 0, 0] }) {

  const hamburger = useGLTF('/hamburger.glb');

  hamburger.scene.children.forEach((child) => {
    child.castShadow = true;
  });

  return (
    <group position={position}>
      <Float>
        <Text
          scale={0.5}
          font="./bebas-neue-v9-latin-regular.woff"
          textAlign="center"
          position={[0, 1.65, 2]}
          rotation-y={-0.25}
        >
          Finish Line
          <meshBasicMaterial toneMapped={false} color={"tomato"} />
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        material={floorMaterial}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>
      <RigidBody type="fixed" colliders="hull" restitution={0.2} friction={0}>
        <primitive
          object={hamburger.scene}
          position={[0, 0.125, 0]}
          scale={[0.2, 0.2, 0.2]}
        />
      </RigidBody>
    </group>
  );
}

export function BlockSpinner ({position = [0, 0, 0]}) {

  const [speed] = useState(() => (Math.random() + 0.3) * (Math.random() < 0.5 ? -1 : 1) );

  const obstacle = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0)); 

    obstacle.current.setNextKinematicRotation(rotation);
  })

  

  return (
    <group position={position}>

    <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />

    <RigidBody ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
      <mesh geometry={boxGeometry} material={obstacleMaterial} position={[0, 0.125, 0]} scale={[3.5, 0.3, 0.3]} receiveShadow castShadow/>
    </RigidBody>

    </group>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  const [timeOffest] = useState(
    () => Math.random() * Math.PI * 2
  );

  const obstacle = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    // Elevator effect quaternion
    const y = Math.sin(time + timeOffest) + 1.15;
    obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />

      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          position={[0, 0.125, 0]}
          scale={[3.5, 0.3, 0.3]}
          receiveShadow
          castShadow
        />
      </RigidBody>
    </group>
  );
}

export function BlockAxe({ position = [0, 0, 0] }) {
  const [timeOffest] = useState(() => Math.random() * Math.PI * 2);

  const obstacle = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    // Elevator effect quaternion
    const x = Math.sin(time + timeOffest) * 1.25 ;
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />

      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          position={[0, 0.125, 0]}
          scale={[1.5, 1.5, 0.3]}
          receiveShadow
          castShadow
        />
      </RigidBody>
    </group>
  );
}

function Bounds({length = 1}){
  return <>
  <RigidBody type="fixed" restitution={0.2} friction={0}>

    <mesh position={[2.15, 0.75,  - (length * 2) + 2]} geometry={boxGeometry} material={wallMaterial} scale={[0.3, 1.5, 4 * length]} />
    <mesh position={[- 2.15, 0.75,  - (length * 2) + 2]} geometry={boxGeometry} material={wallMaterial} scale={[0.3, 1.5, 4 * length]} />
    <mesh position={[0, 0.75,  - (length * 4) + 2]} geometry={boxGeometry} material={wallMaterial} scale={[4, 1.5, 0.3]} />
    <CuboidCollider args={[2, 0.1, 2 * length]} position={[ 0, - 0.1, - (length * 2) + 2]} restitution={0.2} friction={1} />
  </RigidBody>
  </>
}

export const Level = ({ count = 5, types = [BlockSpinner, BlockLimbo, BlockAxe], seed = 0 }) => {

  const blocks = useMemo(() => {
    const blocks = []
    for( let i = 0; i < count; i++) {
      const Block = types[Math.floor(Math.random() * types.length)];
      blocks.push(Block)
    }
    return blocks
  }, [types, count, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) =>  <Block key={index} position={[0, 0, - (index + 1) * 4]} />)}
      <BlockEnd position={[0, 0, - (count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
};