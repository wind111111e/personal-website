import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// 粒子数量配置
const PARTICLE_COUNT_DESKTOP = 12000;
const PARTICLE_COUNT_MOBILE = 4000;

// 自定义 Shader Material
const ParticleMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uMorph: { value: 0 }, // 0..3 连续变换值
    uExplosion: { value: 0 }, // 0..1 爆炸进度
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor1: { value: new THREE.Color('#116e9d') }, // 蓝色
    uColor2: { value: new THREE.Color('#273dcb') }, // 绿色/青色
    uPixelRatio: { value: 1 }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uMorph;
    uniform float uExplosion;
    uniform vec2 uMouse;
    uniform float uPixelRatio;

    attribute vec3 aPositionSphere;
    attribute vec3 aPositionRing;
    attribute vec3 aPositionSpiral;
    attribute float aRandom;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vec3 pos;
      
      // 平滑形态混合逻辑 (0->Sphere, 1->Ring, 2->Spiral, 3->Sphere)
      float t = mod(uMorph, 3.0);
      
      if (t < 1.0) {
        pos = mix(aPositionSphere, aPositionRing, t);
      } else if (t < 2.0) {
        pos = mix(aPositionRing, aPositionSpiral, t - 1.0);
      } else {
        pos = mix(aPositionSpiral, aPositionSphere, t - 2.0);
      }

      // 基础旋转 (整体缓慢旋转)
      float angle = uTime * 0.1;
      mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      pos.xz = rot * pos.xz;
      pos.yz = rot * pos.yz;

      // 鼠标交互 (简单的径向斥力)
      float distToMouse = distance(pos.xy, uMouse * 10.0); // 放大范围
      float repulse = 1.0 - smoothstep(0.0, 3.0, distToMouse);
      vec3 repulseDir = normalize(pos - vec3(uMouse.x * 10.0, uMouse.y * 10.0, 0.0));
      if (length(pos - vec3(uMouse.x * 10.0, uMouse.y * 10.0, 0.0)) < 0.001) repulseDir = vec3(0.0, 0.0, 1.0);
      
      pos += repulseDir * repulse * 0.5;

      // 爆炸效果
      vec3 normalDir = normalize(pos);
      if (length(pos) < 0.001) normalDir = vec3(0.0, 1.0, 0.0);
      
      vec3 explosionDir = normalDir;
      explosionDir += (vec3(aRandom) - 0.5) * 0.5;
      pos += explosionDir * uExplosion * 5.0;

      // 波动效果
      pos += normalDir * sin(uTime * 2.0 + pos.y) * 0.05;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // 大小随距离衰减
      gl_PointSize = (30.0 * uPixelRatio) * (1.0 / -mvPosition.z);
      gl_PointSize *= (1.0 + uExplosion * 2.0);
      
      // 限制最小和最大尺寸
      gl_PointSize = max(1.0, min(gl_PointSize, 60.0));

      // 颜色
      vColor = vec3(0.2, 0.6, 1.0); // 基础蓝
      vAlpha = 1.0;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      // 绘制圆形粒子
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      
      if (dist > 0.5) discard;

      // 径向渐变 (发光效果)
      float strength = 1.0 - (dist * 2.0);
      strength = pow(strength, 1.5);

      vec3 finalColor = mix(uColor1, uColor2, strength);
      finalColor += vec3(0.8) * strength * strength;

      gl_FragColor = vec4(finalColor, strength * vAlpha);
    }
  `
};

// 缓存几何体数据，避免路由切换时重新计算
const geometryCache: { [key: number]: any } = {};

function generateGeometry(count: number) {
  if (geometryCache[count]) {
    return geometryCache[count];
  }

  const positionsSphere = new Float32Array(count * 3);
  const positionsRing = new Float32Array(count * 3);
  const positionsSpiral = new Float32Array(count * 3);
  const randoms = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // 1. 球体
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const r = 1.8 + Math.random() * 0.2;
    
    positionsSphere[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positionsSphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positionsSphere[i * 3 + 2] = r * Math.cos(phi);

    // 2. 环形
    const ringR = 2.5;
    const tubeR = 0.3 + Math.random() * 0.2;
    const ringTheta = Math.random() * Math.PI * 2;
    const ringPhi = Math.random() * Math.PI * 2;
    
    const x = (ringR + tubeR * Math.cos(ringPhi)) * Math.cos(ringTheta);
    const y = (ringR + tubeR * Math.cos(ringPhi)) * Math.sin(ringTheta);
    const z = tubeR * Math.sin(ringPhi);
    
    positionsRing[i * 3] = x;
    positionsRing[i * 3 + 1] = y * 0.5 + z * 0.8;
    positionsRing[i * 3 + 2] = z * 0.5 - y * 0.8;

    // 3. 螺旋
    const spiralAngle = i * 0.1 + Math.random() * 0.5;
    const spiralR = (i / count) * 3.0 + 0.5;
    const branch = (i % 3) * (Math.PI * 2 / 3);
    
    positionsSpiral[i * 3] = spiralR * Math.cos(spiralAngle + branch);
    positionsSpiral[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
    positionsSpiral[i * 3 + 2] = spiralR * Math.sin(spiralAngle + branch);

    randoms[i] = Math.random();
  }

  const data = { positionsSphere, positionsRing, positionsSpiral, randoms };
  geometryCache[count] = data;
  return data;
}

const Particles = () => {
  const { gl } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  
  // 响应式粒子数量
  const [count, setCount] = useState(() => window.innerWidth < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP);

  useEffect(() => {
    const handleResize = () => {
      const newCount = window.innerWidth < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
      setCount(prev => (prev !== newCount ? newCount : prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 生成或获取缓存的几何体数据
  const { positionsSphere, positionsRing, positionsSpiral, randoms } = useMemo(() => {
    return generateGeometry(count);
  }, [count]);

  // 动画状态
  // const [targetIndex, setTargetIndex] = useState(0); // 不再需要手动控制 index
  const explosionRef = useRef({ active: false, startTime: 0, duration: 1.2 });

  useEffect(() => {
    // 持续变换：无需等待，每帧都在变
    // 我们在 useFrame 里使用 uTime 来驱动 morph，不再需要 setInterval
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;

    const time = state.clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uPixelRatio.value = gl.getPixelRatio();
    
    // 鼠标交互
    const pointer = state.pointer;
    materialRef.current.uniforms.uMouse.value.lerp(pointer, 0.1);

    // 变换逻辑 (停留2秒 + 平滑过渡)
    // 周期设计：
    // 0s - 2s: 形态0 (停留)
    // 2s - 8s: 形态0 -> 形态1 (过渡 6s)
    // 0s - 2s: 形态0 (停留)
      // 2s - 8s: 形态0 -> 形态1 (过渡 6s)
      // ...
      
      const holdDuration = 2.0;
      const morphDuration = 6.0;
      
      const totalCycleTime = (holdDuration + morphDuration) * 3;
      const loopTime = time % totalCycleTime;
      
      const currentStage = Math.floor(loopTime / (holdDuration + morphDuration));
      const timeInStage = loopTime % (holdDuration + morphDuration);
      
      let morphValue = currentStage;
      
      if (timeInStage > holdDuration) {
        // 过渡阶段
        const t = (timeInStage - holdDuration) / morphDuration;
        // EaseInOutSine
        const ease = -(Math.cos(Math.PI * t) - 1) / 2;
        morphValue += ease;
      }
      // 否则 morphValue 保持为 currentStage (即整数，停留状态)
      
      materialRef.current.uniforms.uMorph.value = morphValue;
    
    // 爆炸逻辑
    if (explosionRef.current.active) {
      const expElapsed = time - explosionRef.current.startTime;
      const expDuration = explosionRef.current.duration;
      
      let expProgress = 0;
      if (expElapsed < expDuration * 0.3) {
        expProgress = (expElapsed / (expDuration * 0.3));
        expProgress = 1 - Math.pow(1 - expProgress, 3);
      } else if (expElapsed < expDuration) {
        expProgress = 1.0 - (expElapsed - expDuration * 0.3) / (expDuration * 0.7);
        expProgress = expProgress * expProgress;
      } else {
        explosionRef.current.active = false;
        expProgress = 0;
      }
      materialRef.current.uniforms.uExplosion.value = expProgress;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positionsSphere}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aPositionSphere"
          count={count}
          array={positionsSphere}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aPositionRing"
          count={count}
          array={positionsRing}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aPositionSpiral"
          count={count}
          array={positionsSpiral}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={count}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      {/* @ts-ignore */}
      <shaderMaterial
        ref={materialRef}
        attach="material"
        args={[ParticleMaterial]}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const ParticleHero = ({ active = true }: { active?: boolean }) => {
  return (
    <div className={`absolute inset-0 z-0 w-full h-full transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}>
      <Canvas
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Particles />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    </div>
  );
};

export default ParticleHero;
