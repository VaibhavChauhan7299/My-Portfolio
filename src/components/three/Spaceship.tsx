import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

interface SpaceshipProps {
  onPositionUpdate: (position: THREE.Vector3) => void;
}

export const Spaceship = ({ onPositionUpdate }: SpaceshipProps) => {
  const shipRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const { isWarping, warpTarget, endWarp } = useGameStore();
  
  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef(new THREE.Euler(0, Math.PI, 0));
  const targetRotation = useRef(new THREE.Euler(0, Math.PI, 0));
  const initialized = useRef(false);
  
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  const joystick = useRef({ x: 0, y: 0, active: false });

  // Initialize camera position
  useEffect(() => {
    if (!initialized.current && shipRef.current) {
      camera.position.set(0, 5, 60);
      camera.lookAt(0, 2, 50);
      initialized.current = true;
    }
  }, [camera]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
          e.preventDefault();
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true;
          e.preventDefault();
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true;
          e.preventDefault();
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true;
          e.preventDefault();
          break;
        case 'Space':
          keys.current.up = true;
          e.preventDefault();
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.down = true;
          e.preventDefault();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false;
          break;
        case 'Space':
          keys.current.up = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.down = false;
          break;
      }
    };

    const handleJoystickMove = (e: CustomEvent) => {
      joystick.current = e.detail;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('joystick-move' as any, handleJoystickMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('joystick-move' as any, handleJoystickMove);
    };
  }, []);

  useFrame((state, delta) => {
    if (!shipRef.current) return;
    
    const ship = shipRef.current;
    
    // Warp handling
    if (isWarping && warpTarget) {
      const direction = warpTarget.clone().sub(ship.position);
      const distance = direction.length();
      
      if (distance > 3) {
        direction.normalize();
        const warpSpeed = Math.min(distance * 0.08, 3);
        ship.position.add(direction.multiplyScalar(warpSpeed));
        
        // Smoothly rotate towards target
        const targetQuat = new THREE.Quaternion();
        const lookAtMatrix = new THREE.Matrix4();
        lookAtMatrix.lookAt(ship.position, warpTarget, new THREE.Vector3(0, 1, 0));
        targetQuat.setFromRotationMatrix(lookAtMatrix);
        ship.quaternion.slerp(targetQuat, 0.05);
      } else {
        endWarp();
        // Reset rotation state after warp
        rotation.current.setFromQuaternion(ship.quaternion);
        targetRotation.current.copy(rotation.current);
      }
    } else {
      // Normal controls
      const acceleration = 0.02;
      const maxSpeed = 1.0;
      const rotationSpeed = 0.04;
      const damping = 0.97;
      
      let inputX = 0;
      let inputY = 0;
      
      if (keys.current.forward) inputY = 1;
      if (keys.current.backward) inputY = -1;
      if (keys.current.left) inputX = -1;
      if (keys.current.right) inputX = 1;
      
      if (joystick.current.active) {
        inputX = joystick.current.x;
        inputY = -joystick.current.y;
      }
      
      if (inputX !== 0) {
        targetRotation.current.y -= inputX * rotationSpeed;
      }
      
      rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.15;
      ship.rotation.copy(rotation.current);
      
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyEuler(rotation.current);
      
      if (inputY !== 0) {
        const thrust = inputY > 0 ? acceleration : acceleration * 0.5;
        velocity.current.add(forward.multiplyScalar(thrust * inputY));
      }
      
      if (keys.current.up) {
        velocity.current.y += acceleration * 0.6;
      }
      if (keys.current.down) {
        velocity.current.y -= acceleration * 0.6;
      }
      
      if (velocity.current.length() > maxSpeed) {
        velocity.current.normalize().multiplyScalar(maxSpeed);
      }
      
      ship.position.add(velocity.current);
      velocity.current.multiplyScalar(damping);
      
      const maxBound = 100;
      ship.position.clamp(
        new THREE.Vector3(-maxBound, -30, -maxBound),
        new THREE.Vector3(maxBound, 30, maxBound)
      );
    }
    
    // Third-person camera
    const cameraOffset = new THREE.Vector3(0, 4, 12);
    cameraOffset.applyQuaternion(ship.quaternion);
    const targetCameraPos = ship.position.clone().add(cameraOffset);
    
    camera.position.lerp(targetCameraPos, 0.08);
    
    const lookTarget = ship.position.clone().add(new THREE.Vector3(0, 1, 0));
    camera.lookAt(lookTarget);
    
    onPositionUpdate(ship.position.clone());
  });

  return (
    <group ref={shipRef} position={[0, 2, 50]}>
      {/* Ship body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.4, 2, 8]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#00A1E0"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[0, 0.15, -0.4]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#00A1E0" 
          metalness={0.95} 
          roughness={0.05}
          transparent
          opacity={0.9}
          emissive="#00A1E0"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Left Wing */}
      <mesh position={[0.6, 0, 0.4]} rotation={[0, 0, Math.PI / 8]}>
        <boxGeometry args={[1, 0.06, 0.5]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Right Wing */}
      <mesh position={[-0.6, 0, 0.4]} rotation={[0, 0, -Math.PI / 8]}>
        <boxGeometry args={[1, 0.06, 0.5]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Engine glow */}
      <mesh position={[0, 0, 1]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial 
          color="#00A1E0" 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Engine light */}
      <pointLight 
        position={[0, 0, 1.2]} 
        color="#00A1E0" 
        intensity={2} 
        distance={8}
      />
      
      {/* Cockpit light */}
      <pointLight 
        position={[0, 0.2, -0.3]} 
        color="#00A1E0" 
        intensity={0.5} 
        distance={3}
      />
    </group>
  );
};
