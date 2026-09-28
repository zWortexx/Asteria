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
    ring: { inner: 1.02, outer: 1.78, color: "#e4c28c", opacity: 0.72 },
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

const clamp = (value: number) => Math.max(0, Math.min(255, value));
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;
const noise = (x: number, y: number, seed: number) => {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return value - Math.floor(value);
};

function createPlanetTexture(
  THREE: typeof import("three"),
  planetId: string,
  profile: PlanetProfile
) {
  const width = 256;
  const height = 128;
  const pixels = new Uint8Array(width * height * 4);
  const [r, g, b] = profile.base;
  const [ar, ag, ab] = profile.accent;

  for (let y = 0; y < height; y += 1) {
    const latitude = y / (height - 1);
    const latitudeShade = 0.78 + Math.sin(latitude * Math.PI) * 0.22;
    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      const v = latitude;
      const grain = noise(u * 17, v * 13, planetId.length) - 0.5;
      let rr = r;
      let gg = g;
      let bb = b;

      if (planetId === "earth") {
        const land =
          Math.sin(u * 18 + Math.sin(v * 12) * 1.5) +
            Math.cos(v * 25 - u * 9) +
            noise(u * 8, v * 8, 4) * 1.8 >
          1.45;
        if (land) {
          rr = mix(r, 74, 0.75);
          gg = mix(g, 142, 0.76);
          bb = mix(b, 78, 0.8);
        }
        if (noise(u * 42, v * 24, 9) > 0.81) {
          rr = mix(rr, 235, 0.54);
          gg = mix(gg, 245, 0.54);
          bb = mix(bb, 238, 0.54);
        }
      } else if (planetId === "mars") {
        const darkTerrain = noise(u * 11, v * 9, 2) > 0.62;
        rr = darkTerrain ? 132 : r;
        gg = darkTerrain ? 47 : g;
        bb = darkTerrain ? 35 : b;
        if (noise(u * 65, v * 34, 8) > 0.91) {
          rr = mix(rr, 84, 0.38);
          gg = mix(gg, 32, 0.38);
          bb = mix(bb, 27, 0.38);
        }
      } else if (planetId === "moon") {
        const crater = noise(u * 31, v * 18, 6);
        const shade = crater > 0.74 ? 0.52 : crater > 0.62 ? 0.78 : 1;
        rr *= shade;
        gg *= shade;
        bb *= shade;
      } else if (planetId === "jupiter" || planetId === "saturn") {
        const bands = Math.sin(
          v * Math.PI * (planetId === "jupiter" ? 17 : 13)
        );
        const bandAmount = bands > 0 ? 0.2 : -0.12;
        rr = mix(r, ar, 0.32 + bandAmount);
        gg = mix(g, ag, 0.28 + bandAmount);
        bb = mix(b, ab, 0.26 + bandAmount);
        const turbulence = noise(u * 16, v * 34, 11);
        rr += turbulence * 24 - 10;
        gg += turbulence * 18 - 8;
        bb += turbulence * 12 - 5;
        if (planetId === "jupiter") {
          const dx = Math.abs(((u - 0.69 + 0.5) % 1) - 0.5) * 2;
          const dy = Math.abs(v - 0.61) * 3.1;
          if (dx * dx + dy * dy < 0.2) {
            rr = 191;
            gg = 82;
            bb = 54;
          }
        }
      } else if (planetId === "uranus") {
        const bands = Math.sin(v * Math.PI * 11) * 0.12;
        rr = mix(r, ar, 0.45 + bands);
        gg = mix(g, ag, 0.45 + bands);
        bb = mix(b, ab, 0.45 + bands);
      }

      const index = (y * width + x) * 4;
      pixels[index] = clamp(rr * latitudeShade + grain * 8);
      pixels[index + 1] = clamp(gg * latitudeShade + grain * 8);
      pixels[index + 2] = clamp(bb * latitudeShade + grain * 8);
      pixels[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(
    pixels,
    width,
    height,
    THREE.RGBAFormat
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function createPhotoTexture(
  THREE: typeof import("three"),
  image: HTMLImageElement,
  planetId: string
) {
  const isSaturn = planetId === "saturn";
  const canvas = document.createElement("canvas");
  const width = isSaturn ? 640 : 512;
  const height = isSaturn ? 310 : 512;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.drawImage(image, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height);
  if (isSaturn) {
    for (let index = 0; index < pixels.data.length; index += 4) {
      const luminance =
        pixels.data[index] * 0.2126 +
        pixels.data[index + 1] * 0.7152 +
        pixels.data[index + 2] * 0.0722;
      pixels.data[index + 3] =
        luminance < 16 ? 0 : Math.min(255, (luminance - 8) * 18);
    }
  } else {
    const radius = width * 0.47;
    const center = width / 2;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const distance = Math.hypot(x - center, y - center);
        const pixelIndex = (y * width + x) * 4;
        const luminance =
          pixels.data[pixelIndex] * 0.2126 +
          pixels.data[pixelIndex + 1] * 0.7152 +
          pixels.data[pixelIndex + 2] * 0.0722;
        const edgeAlpha = Math.max(
          0,
          Math.min(1, (radius + 5 - distance) / 10)
        );
        const backgroundAlpha = luminance < 12 ? 0 : 1;
        pixels.data[pixelIndex + 3] = Math.round(
          edgeAlpha * backgroundAlpha * 255
        );
      }
    }
  }
  context.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

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
    const photoTextureMode = Boolean(textureUrl?.startsWith("/manus-storage/"));
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
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: planetId === "moon" ? 0.95 : 0.72,
            metalness: 0.02,
            transparent: photoTextureMode,
            opacity: photoTextureMode ? 0.05 : 1,
            depthWrite: !photoTextureMode,
          })
        );
        const surface = addGeometry(new THREE.SphereGeometry(1, 64, 48));
        add(new THREE.Mesh(surface, material));
        if (profile) {
          const generated = createPlanetTexture(THREE, planetId!, profile);
          disposables.push(generated);
          material.map = generated;
          material.color.set(0xffffff);
          material.needsUpdate = true;
        }
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
              const photoTexture = createPhotoTexture(
                THREE,
                loaded.image,
                planetId ?? ""
              );
              loaded.dispose();
              if (!photoTexture) return;
              disposables.push(photoTexture);
              const photoMaterial = addMaterial(
                new THREE.MeshBasicMaterial({
                  map: photoTexture,
                  transparent: true,
                  depthWrite: false,
                  side: THREE.DoubleSide,
                })
              );
              const isSaturn = planetId === "saturn";
              const photo = new THREE.Mesh(
                addGeometry(
                  new THREE.PlaneGeometry(
                    isSaturn ? 2.42 : 1.92,
                    isSaturn ? 1.17 : 1.92
                  )
                ),
                photoMaterial
              );
              photo.position.z = 1.01;
              photo.renderOrder = 3;
              add(photo);
            },
            undefined,
            () => {
              if (!profile) {
                setFallback("Textura nu s-a putut încărca.");
              }
            }
          );
        }
        if (profile) {
          const atmosphere = new THREE.Mesh(
            addGeometry(new THREE.SphereGeometry(1.075, 48, 32)),
            addMaterial(
              new THREE.MeshBasicMaterial({
                color: new THREE.Color(profile.atmosphere),
                transparent: true,
                opacity: photoTextureMode
                  ? 0.03
                  : planetId === "moon"
                    ? 0.04
                    : 0.13,
                side: THREE.BackSide,
              })
            )
          );
          add(atmosphere);
          if (profile.ring && !textureUrl) {
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
            ring.rotation.x = Math.PI / 2.35;
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
      scene.add(new THREE.DirectionalLight(0xffe3b0, 2.2));
      scene.add(new THREE.AmbientLight(0x2c4841, 0.48));

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
