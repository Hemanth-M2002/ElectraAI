import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Html, ContactShadows, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const CardContent = ({ isFlipped, data }) => {
  const meshRef = useRef();
  
  // Subtle tilt towards mouse logic
  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = state.mouse;
    if (!isFlipped) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.1, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.1, 0.1);
    }
  });

  return (
    <group 
      ref={meshRef} 
      rotation={[0, isFlipped ? Math.PI : 0, 0]} 
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Card Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.5, 2.2, 0.05]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.5} />
      </mesh>

      {/* Front Face (Saffron/White/Green) */}
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[3.5, 2.2]} />
        <meshStandardMaterial transparent opacity={0}>
            {/* We'll use HTML for the complex layout to ensure text remains crisp */}
        </meshStandardMaterial>
        
        <Html transform distanceFactor={2.5} position={[0, 0, 0.01]} occlude>
          <div className="w-[350px] h-[220px] bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden relative font-jakarta select-none pointer-events-none">
            {/* Tricolor Header */}
            <div className="h-4 bg-saffron w-full" />
            
            <div className="p-4 flex gap-4">
              <div className="w-20 h-24 bg-slate-100 border border-slate-200 rounded flex items-center justify-center relative overflow-hidden">
                <div className="text-[8px] text-slate-400 font-bold uppercase text-center px-2">Voter Photo</div>
                <div className="absolute inset-0 bg-gradient-to-tr from-saffron/5 to-tricolor_green/5" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                    <div className="text-[10px] font-black text-navy_blue uppercase tracking-tighter">Election Commission of India</div>
                    <div className="w-6 h-6 rounded-full bg-saffron/20 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full border border-saffron" />
                    </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[7px] text-slate-400 font-bold uppercase leading-none">EPIC Number</p>
                  <p className="text-[10px] font-black text-navy_blue leading-none">{data?.epic || 'ABC1234567'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[7px] text-slate-400 font-bold uppercase leading-none">Name</p>
                  <p className="text-[10px] font-black text-navy_blue leading-none">{data?.name || 'CITIZEN NAME'}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <p className="text-[7px] text-slate-400 font-bold uppercase leading-none">Gender</p>
                        <p className="text-[8px] font-bold text-navy_blue leading-none">M/F</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[7px] text-slate-400 font-bold uppercase leading-none">DOB</p>
                        <p className="text-[8px] font-bold text-navy_blue leading-none">01/01/1990</p>
                    </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-tricolor_green flex items-center justify-center">
                <p className="text-[6px] text-white font-black uppercase tracking-widest">Electoral Photo Identity Card</p>
            </div>
            
            {/* Hologram Effect Overlay */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-50" />
          </div>
        </Html>
      </mesh>

      {/* Back Face */}
      <mesh position={[0, 0, -0.026]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.5, 2.2]} />
        <meshStandardMaterial transparent opacity={0} />
        <Html transform distanceFactor={2.5} position={[0, 0, 0.01]} occlude>
          <div className="w-[350px] h-[220px] bg-slate-50 rounded-lg shadow-2xl border border-slate-200 overflow-hidden relative font-jakarta p-4 flex flex-col justify-between select-none pointer-events-none">
            <div className="space-y-3">
               <div className="flex justify-between items-start">
                   <div className="space-y-1">
                       <p className="text-[7px] text-slate-400 font-bold uppercase leading-none">Address</p>
                       <p className="text-[8px] font-medium text-navy_blue w-48 leading-tight">123, Sample Street, District, State, Pincode: 000000</p>
                   </div>
                   <div className="w-12 h-12 bg-white border border-slate-200 p-1">
                       <div className="w-full h-full bg-slate-800 opacity-20" />
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                       <p className="text-[7px] text-slate-400 font-bold uppercase leading-none">Assembly Constituency</p>
                       <p className="text-[8px] font-bold text-navy_blue leading-none">000 - SAMPLE CONSTITUENCY</p>
                   </div>
                   <div className="space-y-1">
                       <p className="text-[7px] text-slate-400 font-bold uppercase leading-none">Part Number</p>
                       <p className="text-[8px] font-bold text-navy_blue leading-none">123</p>
                   </div>
               </div>
            </div>

            <div className="flex justify-between items-end">
                <div className="text-[6px] text-slate-400 italic">This is a digital educational representation of the EPIC card.</div>
                <div className="text-right">
                    <div className="h-6 w-16 border-b border-slate-300 ml-auto" />
                    <p className="text-[7px] font-black text-navy_blue uppercase mt-1">Reg. Officer Signature</p>
                </div>
            </div>
          </div>
        </Html>
      </mesh>
    </group>
  );
};

export default function VoterID3D({ data, height = "300px", interactive = true }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative group cursor-grab active:cursor-grabbing" style={{ height }}>
      <Canvas shadowMap camera={{ position: [0, 0, 5], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <CardContent isFlipped={isFlipped} data={data} />
        </Float>

        {interactive && <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/1.5} />}
        
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
        <Environment preset="city" />
      </Canvas>

      {/* Floating Interaction Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-1.5 rounded-full bg-navy_blue/90 text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-saffron transition-all active:scale-95"
         >
            {isFlipped ? 'Show Front' : 'Flip to Back'}
         </button>
      </div>

      <div className="absolute top-4 right-4 z-10 opacity-40">
         <div className="text-[8px] font-black text-navy_blue uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-tricolor_green animate-pulse" />
            Interactive 3D
         </div>
      </div>
    </div>
  );
}
