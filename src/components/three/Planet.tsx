import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { PlanetData, useGameStore } from '@/store/gameStore';

interface PlanetProps {
  data: PlanetData;
  onApproach: (planet: PlanetData) => void;
}

export const Planet = ({ data, onApproach }: PlanetProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const orbitAngleRef = useRef(Math.random() * Math.PI * 2);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const { shipPosition } = useGameStore();

  const planetMaterial = useMemo(() => {
    const color = new THREE.Color(data.color);
    return new THREE.ShaderMaterial({
      uniforms: {
        baseColor: { value: color },
        lightColor: { value: new THREE.Color('#ffffff') },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 baseColor;
        uniform vec3 lightColor;
        uniform float time;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          vec3 lightDir = normalize(vec3(-1.0, 0.5, 1.0));
          float diff = max(dot(vNormal, lightDir), 0.0);
          
          float n = noise(vUv * 8.0 + time * 0.1);
          vec3 surfaceColor = baseColor * (0.8 + n * 0.4);
          
          vec3 ambient = baseColor * 0.3;
          vec3 diffuse = surfaceColor * diff * 0.7;
          
          float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
          vec3 rim = baseColor * fresnel * 0.5;
          
          gl_FragColor = vec4(ambient + diffuse + rim, 1.0);
        }
      `,
    });
  }, [data.color]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    orbitAngleRef.current += data.orbitSpeed;
    
    if (groupRef.current) {
      const x = Math.cos(orbitAngleRef.current) * data.orbitRadius;
      const z = Math.sin(orbitAngleRef.current) * data.orbitRadius;
      groupRef.current.position.set(x, 0, z);
      
      // Check proximity to ship
      const distance = groupRef.current.position.distanceTo(shipPosition);
      if (distance < data.size + 5) {
        onApproach(data);
      }
    }
    
    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.2;
      (planetRef.current.material as THREE.ShaderMaterial).uniforms.time.value = time;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Planet */}
      <mesh ref={planetRef} material={planetMaterial}>
        <sphereGeometry args={[data.size, 32, 32]} />
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh scale={1.2}>
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshBasicMaterial 
          color={data.color} 
          transparent 
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Saturn's Rings */}
      {data.hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[data.size * 1.4, data.size * 2.2, 64]} />
          <meshBasicMaterial 
            color={data.color} 
            transparent 
            opacity={0.6} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Planet name label using Html */}
      <Html
        position={[0, data.size + 1, 0]}
        center
        distanceFactor={15}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div className="font-orbitron text-xs text-primary whitespace-nowrap px-2 py-1 rounded glass-panel border border-primary/30">
          {data.title}
        </div>
      </Html>
    </group>
  );
};
