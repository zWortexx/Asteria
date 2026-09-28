import { useEffect, useRef, useState } from "react";
import type { GlobeKind } from "../lib/asteria-data";

type CelestialGlobeProps = {
  color: string;
  accent: string;
  textureUrl?: string;
  textureAlt?: string;
  globeKind?: GlobeKind;
  planetId?: string;
  motionEnabled?: boolean;
  size?: "hero" | "detail" | "step";
};

type PlanetProfile = {
  base: [number, number, number];
  accent: [number, number, number];
  atmosphere: string;
  ring?: { inner: number; outer: number; color: string; opacity: number };
};

const planetProfiles: Record<string, PlanetProfile> = {
  mars: {
    base: [156, 57, 38],
    accent: [235, 152, 91],
    atmosphere: "#e9a16d",
  },
  earth: {
    base: [20, 74, 101],
    accent: [83, 156, 105],
    atmosphere: "#9ed4bd",
  },
  moon: {
    base: [132, 128, 119],
    accent: [215, 209, 192],
    atmosphere: "#d7d1c0",
  },
  jupiter: {
    base: [169, 126, 83],
    accent: [228, 191, 135],
    atmosphere: "#e8c896",
  },
  saturn: {
    base: [184, 151, 99],
    accent: [241, 211, 155],
    atmosphere: "#f1d39c",
    ring: { inner: 1.04, outer: 1.52, color: "#e4c28c", opacity: 0.58 },
  },
  uranus: {
    base: [91, 166, 172],
    accent: [176, 225, 219],
    atmosphere: "#b0e1dc",
    ring: { inner: 1.02, outer: 1.52, color: "#b1d8d4", opacity: 0.42 },
  },
};

const getDpr = () =>
  window.innerWidth < 740
    ? Math.min(window.devicePixelRatio, 1.5)
    : Math.min(window.devicePixelRatio, 2);

export default function CelestialGlobe({
  color,
  accent,
  textureUrl,
  textureAlt,
  globeKind = "sphere",
  planetId,
  motionEnabled = true,
  size = "detail",
}: CelestialGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let stop = false;
    let renderer: import("three").WebGLRenderer | undefined;
    let scene: import("three").Scene | undefined;
    let camera: import("three").PerspectiveCamera | undefined;
    let frame = 0;
    let texture: import("three").Texture | undefined;
    const disposables: Array<{ dispose: () => void }> = [];
    const animatedGroups: Array<{ rotation: { y: number } }> = [];
    const profile = planetId ? planetProfiles[planetId] : undefined;
    const setFallback = (message: string) => {
      if (!disposed) setNotice(message);
    };

    const build = async () => {
      const THREE = await import("three");
      if (disposed) return;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.z = 3.2;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch {
        setFallback(
          "WebGL nu este disponibil. Se afișează o reprezentare statică."
        );
        return;
      }
      renderer.setPixelRatio(getDpr());
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      mount.classList.add("celestial-globe-webgl");
      const group = new THREE.Group();
      group.scale.setScalar(
        size === "hero" ? 0.66 : size === "step" ? 0.78 : 0.76
      );
      scene.add(group);
      animatedGroups.push(group);
      const add = (object: import("three").Object3D) => group.add(object);
      const addGeometry = (geometry: import("three").BufferGeometry) => {
        disposables.push(geometry);
        return geometry;
      };
      const addMaterial = <T extends { dispose: () => void }>(material: T) => {
        disposables.push(material);
        return material;
      };

      if (globeKind === "galaxy") {
        const points: number[] = [];
        for (let i = 0; i < 520; i += 1) {
          const arm = i % 4;
          const radius = 0.08 + Math.random() * 1.1;
          const angle =
            radius * 4.8 + (arm * Math.PI) / 2 + (Math.random() - 0.5) * 0.55;
          points.push(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 0.08,
            Math.sin(angle) * radius * 0.52
          );
        }
        const geometry = addGeometry(new THREE.BufferGeometry());
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(points, 3)
        );
        add(
          new THREE.Points(
            geometry,
            addMaterial(
              new THREE.PointsMaterial({
                color: new THREE.Color(accent),
                size: 0.025,
                transparent: true,
                opacity: 0.9,
              })
            )
          )
        );
        add(
          new THREE.Mesh(
            addGeometry(new THREE.CircleGeometry(0.14, 32)),
            addMaterial(
              new THREE.MeshBasicMaterial({ color: new THREE.Color("#fff3cc") })
            )
          )
        );
        group.rotation.x = -0.3;
      } else if (globeKind === "star") {
        add(
          new THREE.Mesh(
            addGeometry(new THREE.SphereGeometry(0.55, 32, 32)),
            addMaterial(
              new THREE.MeshBasicMaterial({ color: new THREE.Color(accent) })
            )
          )
        );
        add(
          new THREE.Mesh(
            addGeometry(new THREE.SphereGeometry(0.82, 32, 32)),
            addMaterial(
              new THREE.MeshBasicMaterial({
                color: new THREE.Color(accent),
                transparent: true,
                opacity: 0.12,
                side: THREE.BackSide,
              })
            )
          )
        );
      } else if (globeKind === "field") {
        const points: number[] = [];
        for (let i = 0; i < 110; i += 1)
          points.push(
            (Math.random() - 0.5) * 2.3,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 0.25
          );
        const geometry = addGeometry(new THREE.BufferGeometry());
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(points, 3)
        );
        add(
          new THREE.Points(
            geometry,
            addMaterial(
              new THREE.PointsMaterial({
                color: new THREE.Color(accent),
                size: 0.035,
              })
            )
          )
        );
      } else {
        const material = addMaterial(
          textureUrl
            ? new THREE.MeshBasicMaterial({ color: 0xffffff })
            : new THREE.MeshStandardMaterial({
                color: new THREE.Color(color),
                roughness: planetId === "moon" ? 0.95 : 0.72,
                metalness: 0.02,
              })
        );
        const surface = addGeometry(new THREE.SphereGeometry(1, 64, 48));
        const planetMesh = new THREE.Mesh(surface, material);
        add(planetMesh);
        if (textureUrl) {
          const loader = new THREE.TextureLoader();
          loader.setCrossOrigin("anonymous");
          loader.load(
            textureUrl,
            loaded => {
              if (disposed) {
                loaded.dispose();
                return;
              }
              loaded.colorSpace = THREE.SRGBColorSpace;
              loaded.anisotropy =
                renderer?.capabilities.getMaxAnisotropy() ?? 1;
              loaded.minFilter = THREE.LinearMipmapLinearFilter;
              loaded.magFilter = THREE.LinearFilter;
              disposables.push(loaded);
              material.map = loaded;
              material.color.set(0xffffff);
              material.needsUpdate = true;
            },
            undefined,
            () => {
              if (!profile) {
                setFallback("Textura nu s-a putut încărca.");
              }
            }
          );
        }
        if (profile && !textureUrl) {
          const atmosphere = new THREE.Mesh(
            addGeometry(new THREE.SphereGeometry(1.075, 48, 32)),
            addMaterial(
              new THREE.MeshBasicMaterial({
                color: new THREE.Color(profile.atmosphere),
                transparent: true,
                opacity: planetId === "moon" ? 0.04 : 0.13,
                side: THREE.BackSide,
              })
            )
          );
          add(atmosphere);
          if (profile.ring) {
            const ring = new THREE.Mesh(
              addGeometry(
                new THREE.RingGeometry(
                  profile.ring.inner,
                  profile.ring.outer,
                  128
                )
              ),
              addMaterial(
                new THREE.MeshBasicMaterial({
                  color: new THREE.Color(profile.ring.color),
                  transparent: true,
                  opacity: profile.ring.opacity,
                  side: THREE.DoubleSide,
                })
              )
            );
            ring.rotation.x = Math.PI / 4.6;
            add(ring);
          }
        }
      }

      if (globeKind !== "star" && !profile) {
        const rim = new THREE.Mesh(
          addGeometry(
            new THREE.SphereGeometry(
              globeKind === "sphere" ? 1.045 : 1.16,
              32,
              32
            )
          ),
          addMaterial(
            new THREE.MeshBasicMaterial({
              color: new THREE.Color(accent),
              transparent: true,
              opacity: 0.18,
              side: THREE.BackSide,
            })
          )
        );
        add(rim);
      }
      const starGeometry = addGeometry(new THREE.BufferGeometry());
      const starPositions = new Float32Array(180 * 3);
      for (let index = 0; index < 180; index += 1) {
        const radius = 2.3 + Math.random() * 1.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        starPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[index * 3 + 1] = radius * Math.cos(phi);
        starPositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      }
      starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(starPositions, 3)
      );
      const stars = new THREE.Points(
        starGeometry,
        addMaterial(
          new THREE.PointsMaterial({
            color: 0xd9eadc,
            size: 0.018,
            transparent: true,
            opacity: 0.72,
          })
        )
      );
      scene.add(stars);
      animatedGroups.push(stars);
      const keyLight = new THREE.DirectionalLight(0xffe3b0, 2.4);
      keyLight.position.set(3, 2, 4);
      scene.add(keyLight);
      scene.add(new THREE.HemisphereLight(0xffe7c1, 0x14201e, 0.95));
      scene.add(new THREE.AmbientLight(0x466257, 0.62));

      const resize = () => {
        if (!renderer || !camera) return;
        const width = mount.clientWidth || 390;
        const height = mount.clientHeight || 390;
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(getDpr());
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          stop = !entry?.isIntersecting;
        },
        { threshold: 0.01 }
      );
      visibilityObserver.observe(mount);
      const onVisibility = () => {
        stop = document.hidden;
      };
      document.addEventListener("visibilitychange", onVisibility);
      const render = () => {
        if (!disposed) frame = requestAnimationFrame(render);
        if (!renderer || !scene || !camera || stop) return;
        if (motionEnabled) {
          animatedGroups[0].rotation.y += 0.0022;
          animatedGroups[1].rotation.y -= 0.0007;
        }
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(render);
      (mount as HTMLDivElement & { __cleanup?: () => void }).__cleanup = () => {
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    };
    void build();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      (mount as HTMLDivElement & { __cleanup?: () => void }).__cleanup?.();
      texture?.dispose();
      disposables.forEach(resource => resource.dispose());
      renderer?.dispose();
      if (renderer?.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
      mount.classList.remove("celestial-globe-webgl");
    };
  }, [accent, color, globeKind, motionEnabled, planetId, size, textureUrl]);

  return (
    <div
      ref={mountRef}
      className={`celestial-globe celestial-globe-${size} celestial-globe-${globeKind}`}
      role="img"
      aria-label={textureAlt ?? "Glob ceresc tridimensional"}
    >
      <div className="celestial-globe-fallback" aria-hidden="true" />
      <span className="celestial-globe-notice" role="status">
        {notice}
      </span>
    </div>
  );
}
