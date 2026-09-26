import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import * as THREE from "three";

import { Button } from "@/components/ui/button";
import { MaskedLines } from "@/components/Motion";
import { EVENT_INFO } from "@/lib/data";

import { useAuth } from "@/context/AuthContext";
const PARTICLE_COUNT = 1200;

function CyberChess3D() {
  const containerRef = useRef(null);
  

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let animationId;

    /* ================================================================
       SCENE
    ================================================================ */

    const scene = new THREE.Scene();

    // IMPORTANT:
    // Do NOT set scene.background.
    // The Three.js canvas must remain transparent.
    scene.background = null;

    /* ================================================================
       CAMERA
    ================================================================ */

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );

    camera.position.set(0, 0, 18);

    /* ================================================================
       RENDERER
    ================================================================ */

    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.error("WebGL could not initialize:", error);
      return;
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.setClearColor(
      0x000000,
      0
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    /* ================================================================
       CANVAS LAYER
    ================================================================ */

    const canvas =
      renderer.domElement;

    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";

    /*
     * IMPORTANT:
     *
     * Background = 0
     * Content = 20+
     *
     * So the canvas can NEVER cover the hero.
     */
    canvas.style.zIndex = "0";
    canvas.style.pointerEvents = "none";

    container.appendChild(canvas);

    /* ================================================================
       WORLD
    ================================================================ */

    const world =
      new THREE.Group();

    scene.add(world);

    /* ================================================================
       PARTICLE FIELD
    ================================================================ */

    const positions =
      new Float32Array(
        PARTICLE_COUNT * 3
      );

    const colors =
      new Float32Array(
        PARTICLE_COUNT * 3
      );

    const particleData = [];

    const cyan =
      new THREE.Color(
        0x2ffcff
      );

    const cyanBright =
      new THREE.Color(
        0xb9ffff
      );

    for (
      let i = 0;
      i < PARTICLE_COUNT;
      i++
    ) {
      const i3 = i * 3;

      /*
       * 3D spherical distribution.
       */

      const theta =
        Math.random() *
        Math.PI *
        2;

      const phi =
        Math.acos(
          2 * Math.random() - 1
        );

      const radius =
        2.5 +
        Math.pow(
          Math.random(),
          0.55
        ) *
          18;

      positions[i3] =
        Math.sin(phi) *
        Math.cos(theta) *
        radius;

      positions[i3 + 1] =
        Math.sin(phi) *
        Math.sin(theta) *
        radius *
        0.65;

      positions[i3 + 2] =
        Math.cos(phi) *
        radius;

      /*
       * Mostly cyan.
       *
       * Small percentage becomes
       * almost white.
       */

      const color =
        Math.random() < 0.07
          ? cyanBright
          : cyan;

      colors[i3] =
        color.r;

      colors[i3 + 1] =
        color.g;

      colors[i3 + 2] =
        color.b;

      particleData.push({
        radius,
        theta,
        phi,

        speed:
          0.0005 +
          Math.random() *
            0.0015,

        direction:
          Math.random() > 0.5
            ? 1
            : -1,

        phase:
          Math.random() *
          Math.PI *
          2,

        drift:
          0.3 +
          Math.random() *
            1.4,

        size:
          Math.random() < 0.05
            ? 0.13 +
              Math.random() *
                0.08
            : 0.035 +
              Math.random() *
                0.055,

        depth:
          Math.random(),
      });
    }

    const particleGeometry =
      new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(
        colors,
        3
      )
    );

    /*
     * Built-in Three.js material.
     *
     * Much more reliable than custom GLSL.
     */

    const particleMaterial =
      new THREE.PointsMaterial({
        size: 0.075,

        sizeAttenuation: true,

        vertexColors: true,

        transparent: true,

        opacity: 0.75,

        depthWrite: false,

        blending:
          THREE.AdditiveBlending,
      });

    const particles =
      new THREE.Points(
        particleGeometry,
        particleMaterial
      );

    world.add(
      particles
    );

    /* ================================================================
       LARGE GLOW PARTICLES
    ================================================================ */

    const glowMaterial =
      new THREE.PointsMaterial({
        size: 0.18,

        sizeAttenuation: true,

        color:
          0x2ffcff,

        transparent: true,

        opacity: 0.055,

        depthWrite: false,

        blending:
          THREE.AdditiveBlending,
      });

    const glowParticles =
      new THREE.Points(
        particleGeometry,
        glowMaterial
      );

    world.add(
      glowParticles
    );

    /* ================================================================
       CENTRAL CORE
    ================================================================ */

    const coreGroup =
      new THREE.Group();

    coreGroup.position.set(
      -1.8,
      0,
      0
    );

    world.add(
      coreGroup
    );

    /*
     * Core sphere.
     */

    const coreGeometry =
      new THREE.SphereGeometry(
        0.35,
        24,
        24
      );

    const coreMaterial =
      new THREE.MeshBasicMaterial({
        color:
          0x2ffcff,

        transparent: true,

        opacity: 0.12,

        blending:
          THREE.AdditiveBlending,

        depthWrite: false,
      });

    const core =
      new THREE.Mesh(
        coreGeometry,
        coreMaterial
      );

    coreGroup.add(
      core
    );

    /* ================================================================
       ENERGY RINGS
    ================================================================ */

    const rings = [];

    for (
      let i = 0;
      i < 5;
      i++
    ) {
      const ringGeometry =
        new THREE.RingGeometry(
          0.8 +
            i * 0.48,
          0.81 +
            i * 0.48,
          96
        );

      const ringMaterial =
        new THREE.MeshBasicMaterial({
          color:
            0x2ffcff,

          transparent: true,

          opacity:
            0.035 -
            i * 0.004,

          side:
            THREE.DoubleSide,

          depthWrite: false,

          blending:
            THREE.AdditiveBlending,
        });

      const ring =
        new THREE.Mesh(
          ringGeometry,
          ringMaterial
        );

      ring.rotation.x =
        Math.PI / 2;

      coreGroup.add(
        ring
      );

      rings.push(
        ring
      );
    }

    /* ================================================================
       CHESS BOARD GRID
    ================================================================ */

    const board =
      new THREE.Group();

    board.position.set(
      -1.8,
      -2.8,
      0
    );

    board.rotation.x =
      -0.38;

    world.add(
      board
    );

    const gridMaterial =
      new THREE.LineBasicMaterial({
        color:
          0x2ffcff,

        transparent: true,

        opacity: 0.045,

        blending:
          THREE.AdditiveBlending,
      });

    const boardSize = 11;

    const divisions = 8;

    for (
      let i = 0;
      i <= divisions;
      i++
    ) {
      const p =
        i / divisions;

      const x =
        -boardSize / 2 +
        p * boardSize;

      const geometry =
        new THREE.BufferGeometry().setFromPoints(
          [
            new THREE.Vector3(
              x,
              0,
              -boardSize / 2
            ),

            new THREE.Vector3(
              x,
              0,
              boardSize / 2
            ),
          ]
        );

      board.add(
        new THREE.Line(
          geometry,
          gridMaterial
        )
      );
    }

    for (
      let i = 0;
      i <= divisions;
      i++
    ) {
      const p =
        i / divisions;

      const z =
        -boardSize / 2 +
        p * boardSize;

      const geometry =
        new THREE.BufferGeometry().setFromPoints(
          [
            new THREE.Vector3(
              -boardSize / 2,
              0,
              z
            ),

            new THREE.Vector3(
              boardSize / 2,
              0,
              z
            ),
          ]
        );

      board.add(
        new THREE.Line(
          geometry,
          gridMaterial
        )
      );
    }

    /* ================================================================
       HOLOGRAPHIC KING
    ================================================================ */

    const hologramCanvas =
      document.createElement(
        "canvas"
      );

    hologramCanvas.width =
      256;

    hologramCanvas.height =
      256;

    const hctx =
      hologramCanvas.getContext(
        "2d"
      );

    if (hctx) {
      hctx.clearRect(
        0,
        0,
        256,
        256
      );

      hctx.textAlign =
        "center";

      hctx.textBaseline =
        "middle";

      hctx.font =
        "170px serif";

      hctx.fillStyle =
        "rgba(47,252,254,0.5)";

      hctx.fillText(
        "♔",
        128,
        130
      );
    }

    const hologramTexture =
      new THREE.CanvasTexture(
        hologramCanvas
      );

    const hologramMaterial =
      new THREE.SpriteMaterial({
        map:
          hologramTexture,

        transparent: true,

        opacity: 0.045,

        depthWrite: false,

        blending:
          THREE.AdditiveBlending,
      });

    const hologram =
      new THREE.Sprite(
        hologramMaterial
      );

    hologram.scale.set(
      3.5,
      3.5,
      1
    );

    hologram.position.set(
      -1.8,
      0,
      -0.5
    );

    world.add(
      hologram
    );

    /* ================================================================
       MOUSE
    ================================================================ */

    let mouseX = 0;
    let mouseY = 0;

    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove =
      (event) => {
        targetMouseX =
          event.clientX /
            window.innerWidth -
          0.5;

        targetMouseY =
          event.clientY /
            window.innerHeight -
          0.5;
      };

    window.addEventListener(
      "mousemove",
      onMouseMove
    );

    /* ================================================================
       CLOCK
    ================================================================ */

    const clock =
      new THREE.Clock();

    /* ================================================================
       ANIMATION
    ================================================================ */

const animate = () => {
  animationId = requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  /* ================================================================
     MOUSE
  ================================================================= */

  mouseX = THREE.MathUtils.lerp(
    mouseX,
    targetMouseX,
    0.045
  );

  mouseY = THREE.MathUtils.lerp(
    mouseY,
    targetMouseY,
    0.045
  );

  /* ================================================================
     ATMOSPHERIC MOTION
  ================================================================= */

  const slowWave =
    Math.sin(time * 0.12);

  const mediumWave =
    Math.sin(time * 0.27 + 1.7);

  const fastWave =
    Math.sin(time * 0.55 + 4.1);

  const atmospheric =
    Math.sin(time * 0.11) * 0.45 +
    Math.sin(time * 0.23 + 2.4) * 0.35 +
    Math.sin(time * 0.41 + 5.2) * 0.20;

  /* ================================================================
     ENERGY WAVES

     Much more frequent than before.
  ================================================================= */

  const energyA = Math.pow(
    Math.max(
      0,
      Math.sin(time * 0.18 + 0.4)
    ),
    5
  );

  const energyB = Math.pow(
    Math.max(
      0,
      Math.sin(time * 0.11 + 2.8)
    ),
    7
  );

  const energyC = Math.pow(
    Math.max(
      0,
      Math.sin(time * 0.075 + 5.1)
    ),
    9
  );

  const energy =
    Math.min(
      1,
      energyA * 0.55 +
      energyB * 0.3 +
      energyC * 0.2
    );

  /* ================================================================
     RELEASE WAVE
  ================================================================= */

  const releaseA = Math.pow(
    Math.max(
      0,
      Math.sin(time * 0.18 - 0.9)
    ),
    7
  );

  const releaseB = Math.pow(
    Math.max(
      0,
      Math.sin(time * 0.11 + 2.1)
    ),
    9
  );

  const release =
    Math.min(
      1,
      releaseA * 0.7 +
      releaseB * 0.3
    );

  /* ================================================================
     PARTICLES
  ================================================================= */

  const positionAttribute =
    particleGeometry.getAttribute(
      "position"
    );

  for (
    let i = 0;
    i < PARTICLE_COUNT;
    i++
  ) {
    const i3 =
      i * 3;

    const p =
      particleData[i];

    /* --------------------------------------------------------------
       FASTER INDIVIDUAL TIME
    -------------------------------------------------------------- */

    const individualTime =
      time *
      (
        1.5 +
        p.depth * 1.4
      );

    /* --------------------------------------------------------------
       PERSONAL MOTION
    -------------------------------------------------------------- */

    const personalWave =
      Math.sin(
        individualTime * 0.35 +
        p.phase
      );

    const personalWave2 =
      Math.cos(
        individualTime * 0.22 +
        p.phase * 1.7
      );

    /* --------------------------------------------------------------
       FASTER ORBIT
    -------------------------------------------------------------- */

    const angle =
      p.theta +
      time *
      p.speed *
      p.direction *
      2.8;

    /* --------------------------------------------------------------
       BREATHING
    -------------------------------------------------------------- */

    const breathing =
      1 +
      personalWave * 0.055 +
      atmospheric * 0.035;

    let radius =
      p.radius *
      breathing;

    /* --------------------------------------------------------------
       ENERGY CONVERGENCE
    -------------------------------------------------------------- */

    const compressedRadius =
      p.radius *
      (
        0.10 +
        p.depth * 0.05
      );

    radius =
      THREE.MathUtils.lerp(
        radius,
        compressedRadius,
        energy
      );

    /* --------------------------------------------------------------
       BASE 3D POSITION
    -------------------------------------------------------------- */

    let x =
      Math.sin(p.phi) *
      Math.cos(angle) *
      radius;

    let y =
      Math.sin(p.phi) *
      Math.sin(angle) *
      radius *
      0.68;

    let z =
      Math.cos(p.phi) *
      radius;

    /* --------------------------------------------------------------
       STRONGER ORGANIC FLOW
    -------------------------------------------------------------- */

    x +=
      personalWave *
      p.drift *
      0.28;

    y +=
      personalWave2 *
      p.drift *
      0.20;

    z +=
      Math.sin(
        individualTime * 0.16 +
        p.phase
      ) *
      p.drift *
      0.18;

    /* --------------------------------------------------------------
       VORTEX
    -------------------------------------------------------------- */

    const vortexStrength =
      energy *
      (
        0.8 +
        p.depth * 1.0
      );

    const vortexAngle =
      vortexStrength *
      0.9;

    const cosVortex =
      Math.cos(
        vortexAngle
      );

    const sinVortex =
      Math.sin(
        vortexAngle
      );

    const vortexX =
      x * cosVortex -
      z * sinVortex;

    const vortexZ =
      x * sinVortex +
      z * cosVortex;

    x =
      THREE.MathUtils.lerp(
        x,
        vortexX,
        energy * 0.8
      );

    z =
      THREE.MathUtils.lerp(
        z,
        vortexZ,
        energy * 0.8
      );

    /* --------------------------------------------------------------
       ENERGY RELEASE
    -------------------------------------------------------------- */

    if (release > 0) {

      const distance =
        Math.sqrt(
          x * x +
          y * y +
          z * z
        ) || 1;

      const particleExplosion =
        release *
        (
          4 +
          p.depth * 10
        );

      x +=
        (x / distance) *
        particleExplosion;

      y +=
        (y / distance) *
        particleExplosion;

      z +=
        (z / distance) *
        particleExplosion;
    }

    /* --------------------------------------------------------------
       FAST FLOW
    -------------------------------------------------------------- */

    const flow =
      Math.sin(
        time * 0.31 +
        p.phase
      );

    x +=
      flow *
      0.10 *
      p.depth;

    y +=
      Math.cos(
        time * 0.25 +
        p.phase
      ) *
      0.08;

    z +=
      Math.sin(
        time * 0.19 +
        p.phase
      ) *
      0.07;

    /* --------------------------------------------------------------
       UPDATE
    -------------------------------------------------------------- */

    positionAttribute.setXYZ(
      i,
      x,
      y,
      z
    );
  }

  positionAttribute.needsUpdate =
    true;

  /* ================================================================
     PARTICLE FIELD ROTATION
  ================================================================= */

  particles.rotation.y =
    Math.sin(
      time * 0.075
    ) * 0.12;

  particles.rotation.x =
    Math.sin(
      time * 0.06
    ) * 0.035;

  glowParticles.rotation.y =
    Math.sin(
      time * 0.065
    ) * 0.15;

  /* ================================================================
     CORE
  ================================================================= */

  const coreBreathing =
    1 +
    Math.sin(
      time * 1.8
    ) *
    0.07;

  core.scale.setScalar(
    coreBreathing +
    energy * 1.0
  );

  coreMaterial.opacity =
    0.05 +
    energy * 0.18 +
    release * 0.08;

  /* ================================================================
     RINGS
  ================================================================= */

  rings.forEach(
    (ring, index) => {

      const speed =
        0.09 +
        index * 0.025;

      ring.rotation.z =
        time *
        speed *
        (
          index % 2 === 0
            ? 1
            : -1
        );

      ring.rotation.x =
        Math.PI / 2 +
        Math.sin(
          time *
          (
            0.12 +
            index * 0.025
          )
        ) *
        0.06;

      const breathing =
        Math.sin(
          time *
          (
            0.25 +
            index * 0.04
          )
        );

      ring.scale.setScalar(
        1 +
        breathing * 0.04 +
        energy *
        (
          0.10 +
          index * 0.035
        )
      );

      ring.material.opacity =
        0.02 +
        energy *
        (
          0.04 +
          index * 0.009
        ) +
        release * 0.025;
    }
  );

  /* ================================================================
     CHESS GRID
  ================================================================= */

  const gridBreathing =
    Math.max(
      0,
      Math.sin(
        time * 0.16 +
        1.5
      )
    );

  const gridStrength =
    0.018 +
    gridBreathing * 0.012 +
    energy * 0.08 +
    release * 0.025;

  board.children.forEach(
    (line) => {
      line.material.opacity =
        gridStrength;
    }
  );

  board.rotation.z =
    Math.sin(
      time * 0.12
    ) *
    0.035;

  board.rotation.y =
    Math.sin(
      time * 0.08
    ) *
    0.025;

  /* ================================================================
     HOLOGRAM
  ================================================================= */

  const hologramPulse =
    Math.sin(
      time * 0.8
    );

  hologram.material.opacity =
    0.015 +
    energy * 0.085 +
    release * 0.04;

  hologram.scale.setScalar(
    3.0 +
    hologramPulse * 0.08 +
    energy * 0.65
  );

  hologram.position.y =
    -1.8 +
    Math.sin(
      time * 0.35
    ) *
    0.12;

  /* ================================================================
     PARTICLE BRIGHTNESS
  ================================================================= */

  particleMaterial.opacity =
    0.55 +
    energy * 0.3 +
    release * 0.15;

  glowMaterial.opacity =
    0.03 +
    energy * 0.08 +
    release * 0.045;

  /* ================================================================
     WORLD MOVEMENT
  ================================================================= */

  world.rotation.y =
    Math.sin(
      time * 0.055
    ) *
    0.065;

  world.rotation.x =
    Math.sin(
      time * 0.043
    ) *
    0.025;

  world.rotation.z =
    Math.sin(
      time * 0.032
    ) *
    0.012;

  /* ================================================================
     MOUSE PARALLAX
  ================================================================= */

  world.position.x =
    THREE.MathUtils.lerp(
      world.position.x,
      mouseX * 1.1,
      0.035
    );

  world.position.y =
    THREE.MathUtils.lerp(
      world.position.y,
      -mouseY * 0.6,
      0.035
    );

  /* ================================================================
     CAMERA
  ================================================================= */

  camera.position.x =
    THREE.MathUtils.lerp(
      camera.position.x,
      mouseX * 0.9 +
      Math.sin(
        time * 0.035
      ) * 0.2,
      0.025
    );

  camera.position.y =
    THREE.MathUtils.lerp(
      camera.position.y,
      -mouseY * 0.55 +
      Math.sin(
        time * 0.045
      ) * 0.1,
      0.025
    );

  camera.position.z =
    18 +
    Math.sin(
      time * 0.045
    ) * 0.45 -
    energy * 0.9;

  camera.lookAt(
    -0.5,
    0,
    0
  );

  /* ================================================================
     RENDER
  ================================================================= */

  renderer.render(
    scene,
    camera
  );
};

    /* ================================================================
       RESIZE
    ================================================================ */

    const onResize = () => {
      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio || 1,
          2
        )
      );
    };

    window.addEventListener(
      "resize",
      onResize
    );

    /* ================================================================
       START
    ================================================================ */

    onResize();

    animate();

    /* ================================================================
       CLEANUP
    ================================================================ */

    return () => {
      cancelAnimationFrame(
        animationId
      );

      window.removeEventListener(
        "resize",
        onResize
      );

      window.removeEventListener(
        "mousemove",
        onMouseMove
      );

      particleGeometry.dispose();

      particleMaterial.dispose();

      glowMaterial.dispose();

      coreGeometry.dispose();

      coreMaterial.dispose();

      hologramTexture.dispose();

      hologramMaterial.dispose();

      gridMaterial.dispose();

      rings.forEach(
        (ring) => {
          ring.geometry.dispose();
        }
      );

      renderer.dispose();

      if (
        canvas.parentNode
      ) {
        canvas.parentNode.removeChild(
          canvas
        );
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        fixed
        inset-0
        w-screen
        h-screen
        pointer-events-none
        z-0
      "
    />
  );
}

/* =========================================================================
   HERO
============================================================================ */

export default function KineticHero() {

  const { user, ready } = useAuth();

const isLoggedIn = ready && user && user !== false;
  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden
      "
      data-testid="kinetic-hero"
    >

      {/* ================================================================
          3D BACKGROUND
      ================================================================ */}

      <CyberChess3D />

      {/* ================================================================
          VERY SUBTLE ATMOSPHERIC GLOW
      ================================================================ */}

      <div
        className="
          fixed
          inset-0
          z-[1]
          pointer-events-none
          bg-[radial-gradient(circle_at_22%_48%,rgba(47,252,254,0.045),transparent_32%)]
        "
      />

      {/* ================================================================
          HERO CONTENT
      ================================================================ */}

      <div
        className="
          relative
          z-[20]
          min-h-screen
          flex
          flex-col
          items-center
          justify-center
          px-6
          text-center
        "
      >

        {/* ------------------------------------------------------------
            EVENT LABEL
        ------------------------------------------------------------ */}

        <motion.p
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
            duration: 0.8,
          }}
          className="
            font-mono
            text-xs
            md:text-sm
            uppercase
            tracking-[0.35em]
            text-amber-glow
            mb-6
          "
        >
          {EVENT_INFO.host}
          {" \u00B7 "}
          {EVENT_INFO.college}
        </motion.p>

        {/* ------------------------------------------------------------
            TITLE
        ------------------------------------------------------------ */}

        <MaskedLines
          className="
            font-black
            font-orbitron
            text-6xl
            md:text-8xl
            lg:text-9xl
            tracking-tighter
            leading-[0.85]
          "
          lines={[
            <span
              key="infotrek"
              className="font-color"
            >
              INFOTREK
            </span>,

            <span key="26">
              {"'26"}
            </span>,
          ]}
        />

        {/* ------------------------------------------------------------
            DESCRIPTION
        ------------------------------------------------------------ */}

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.1,
            duration: 0.8,
          }}
          className="
            mt-8
            font-mono
            text-sm
            md:text-base
            text-zinc-300
            max-w-xl
            mx-auto
          "
        >
          {EVENT_INFO.tagline}.{" "}
          {EVENT_INFO.dates}.
        </motion.p>

        {/* ------------------------------------------------------------
            BUTTONS
        ------------------------------------------------------------ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.35,
            duration: 0.8,
          }}
          className="
            mt-10
            flex
            flex-wrap
            items-center
            justify-center
            gap-4
          "
        >

          {!isLoggedIn ? (
  <Button
    asChild
    className="
      rounded-full
      bg-color
      text-ink-base
      font-mono
      text-xs
      font-bold
      uppercase
      tracking-wider
      px-8
      py-6
      hover:bg-color
      hover:scale-105
      transition-transform
    "
  >
    <Link to="/signup">
      Enter the Board
    </Link>
  </Button>
) : (
  <Button
    asChild
    className="
      rounded-full
      bg-color
      text-ink-base
      font-mono
      text-xs
      font-bold
      uppercase
      tracking-wider
      px-8
      py-6
      hover:bg-color
      hover:scale-105
      transition-transform
    "
  >
    <Link to="/events">
      Enter the Arena →
    </Link>
  </Button>
)}

          <Button
            asChild
            variant="outline"
            className="
              rounded-full
              border-white/20
              bg-white/5
              font-mono
              text-xs
              uppercase
              tracking-wider
              px-8
              py-6
              hover:border-cyan-glow/60
              hover:bg-white/5
            "
          >
            <Link to="/events">
              View Events
            </Link>
          </Button>

        </motion.div>
      </div>

      {/* ================================================================
          SCROLL INDICATOR
      ================================================================ */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.8,
        }}
        className="
          absolute
          z-[30]
          bottom-10
          left-1/2
          -translate-x-1/2
          flex
          flex-col
          items-center
          gap-2
          text-zinc-500
        "
      >
        <span
          className="
            font-mono
            text-[10px]
            uppercase
            tracking-[0.3em]
          "
        >
          Explore the board
        </span>

        <ArrowDown
          className="
            w-4
            h-4
            animate-bounce
          "
        />
      </motion.div>
    </section>
  );
}