import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Stars = () => {
  const starsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  const [starGeometry, starMaterial] = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    const sizes = new Float32Array(2000);
    
    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3;
      const radius = 150 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else if (colorChoice < 0.85) {
        colors[i3] = 0.8;
        colors[i3 + 1] = 0.9;
        colors[i3 + 2] = 1;
      } else {
        colors[i3] = 1;
        colors[i3 + 1] = 0.95;
        colors[i3 + 2] = 0.8;
      }
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });
    
    return [geometry, material];
  }, []);

  const [dustGeometry, dustMaterial] = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    
    for (let i = 0; i < 300; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 300;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 300;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: '#4B70DD',
      size: 0.5,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    return [geometry, material];
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.005;
    }
    
    if (dustRef.current) {
      dustRef.current.rotation.y = time * 0.01;
    }
  });

  return (
    <>
      <points ref={starsRef} geometry={starGeometry} material={starMaterial} />
      <points ref={dustRef} geometry={dustGeometry} material={dustMaterial} />
    </>
  );
};
