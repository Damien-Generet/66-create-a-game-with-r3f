import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import UseGame from "./stores/UseGame";


const Player = () => {

  const [ subscribeKeys, getKeys ] = useKeyboardControls();
  const body = useRef();
  const { rapier, world } = useRapier();

  const [ smoothCameraPosition ] = useState(() => new THREE.Vector3(10, 20, 10));
  const [ smoothCameraTarget ] = useState(() => new THREE.Vector3());

  const start = UseGame((state) => state.start);
  const end = UseGame((state) => state.end);
  const restart = UseGame((state) => state.restart);
  const blocksCount = UseGame((state) => state.blocksCount);


  useFrame((state, delta) => {


    // CONTROL

    const { forward, backward, leftward, rightward, jump } = getKeys();

    const impulse = {x: 0, y: 0, z: 0};
    const torque = {x: 0, y: 0, z: 0};

    const impusleStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward){
    impulse.z -= impusleStrength;
    torque.x -= torqueStrength;
    }

    if (backward){
    impulse.z += impusleStrength;
    torque.x += torqueStrength;
    }

    if (leftward){
    impulse.x -= impusleStrength;
    torque.z += torqueStrength;
    }

    if (rightward){
    impulse.x += impusleStrength;
    torque.z -= torqueStrength;
    }


      
    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    // CAMERA
    const bodyPosition = body.current.translation();
    const cameraPosition = new THREE.Vector3();

    cameraPosition.copy(bodyPosition);
    cameraPosition.y += 0.65;
    cameraPosition.z += 2.25;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothCameraPosition.lerp(cameraPosition, 0.1);
    smoothCameraTarget.lerp(cameraTarget, 0.1);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);

    // PHASES

    if(bodyPosition.z < - (blocksCount *4 +2)){
      end();
    }

    if(bodyPosition.y < - 4){
      restart()
    }

  });

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 0.31;
    const direction = {x: 0, y: -1, z: 0};
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if(hit.timeOfImpact < 0.15){
    body.current.applyImpulse({x: 0, y: 0.5, z: 0});
    }
  }

  const reset = () => {
    body.current.setTranslation({x: 0, y: 1, z: 0});
    body.current.setLinvel({x: 0, y: 0, z: 0});
    body.current.setAngvel({x: 0, y: 0, z: 0});

  }

  useEffect(() => {

    const unsubscribeReset = UseGame.subscribe((state) => state.phase, (phase) => {
       if(phase === "ready"){
         reset()
       }
    })

    const unsubcribeJump = subscribeKeys(
      (state) => {
        return state.jump
      },
      (value) => {
        if (value) {
         jump()
      }});
      const unsubcribeAny =  subscribeKeys(() => {
      start();
    });

    return () => {
      unsubcribeJump();
      unsubcribeAny();
      unsubscribeReset();
    }
  }, []);

  return (
    <RigidBody
    ref={body}
      type="dynamic"
      colliders="ball"
      position={[0, 1, 0]}
      friction={1}
      restitution={0.5}
      canSleep={false}
      angularDamping={0.5}
      linearDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
}
 
export default Player;