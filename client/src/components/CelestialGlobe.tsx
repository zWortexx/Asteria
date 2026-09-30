import { useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  Box3,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  LinearFilter,
  LinearMipmapLinearFilter,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  RingGeometry,
  SRGBColorSpace,
  Scene,
  SphereGeometry,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";
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
  lazy?: boolean;
  defer?: boolean;
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

const planetModelUrls: Record<string, string> = {
  mercury: "/manus-storage/mercury_868be0f9.glb",
  venus: "/manus-storage/venus_b21729cd.glb",
  earth: "/manus-storage/earth_cca723c9.glb",
  mars: "/manus-storage/mars_95dc8ddb.glb",
  moon: "/manus-storage/moon_b188d926.glb",
  jupiter: "/manus-storage/jupiter_665e4aeb.glb",
  saturn: "/manus-storage/saturn_ff700d66.glb",
  uranus: "/manus-storage/uranus_0b45b74c.glb",
  neptune: "/manus-storage/neptune_fc13bdbd.glb",
};

export default function CelestialGlobe({
  color,
  accent,
  textureUrl,
  textureAlt,
  globeKind = "sphere",
  planetId,
  motionEnabled = true,
  size = "detail",
  lazy = false,
  defer = false,
}: CelestialGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let stop = false;
    let renderer: WebGLRenderer | undefined;
    let scene: Scene | undefined;
    let camera: PerspectiveCamera | undefined;
    let frame = 0;
    let texture: Texture | undefined;
    const disposables: Array<{ dispose: () => void }> = [];
    const animatedGroups: Array<{ rotation: { y: number } }> = [];
    const profile = planetId ? planetProfiles[planetId] : undefined;
    const modelUrl = planetId ? planetModelUrls[planetId] : undefined;
    const mobileQuality = window.innerWidth < 740;
    const sphereSegments = mobileQuality ? 40 : 64;
    const atmosphereSegments = mobileQuality ? 28 : 48;
    const setFallback = (message: string) => {
      if (!disposed) setNotice(message);
    };

    const build = async () => {
      if (disposed) return;
      scene = new Scene();
      camera = new PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.z = 3.2;
      try {
        renderer = new WebGLRenderer({
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
      const group = new Group();
      group.scale.setScalar(
        size === "hero" && planetId === "saturn"
          ? 0.75
          : size === "hero"
            ? 0.66
            : size === "step"
              ? 0.78
              : 0.76
      );
      if (planetId === "saturn" && modelUrl) {
        group.rotation.x = Math.PI / 5.4;
      }
      scene.add(group);
      animatedGroups.push(group);
      const add = (object: Object3D) => group.add(object);
      const addGeometry = (geometry: BufferGeometry) => {
        disposables.push(geometry);
        return geometry;
      };
      const addMaterial = <T extends { dispose: () => void }>(material: T) => {
        disposables.push(material);
        return material;
      };

      if (modelUrl) {
        const loadingGeometry = addGeometry(
          new SphereGeometry(
            1,
            mobileQuality ? 24 : 32,
            mobileQuality ? 18 : 24
          )
        );
        const loadingMaterial = addMaterial(
          new MeshStandardMaterial({
            color: new Color(
              profile ? `rgb(${profile.base.join(",")})` : color
            ),
            emissive: new Color(
              profile ? `rgb(${profile.accent.join(",")})` : accent
            ),
            emissiveIntensity: 0.08,
            roughness: 0.84,
          })
        );
        const loadingPlanet = new Mesh(loadingGeometry, loadingMaterial);
        add(loadingPlanet);
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const loader = new GLTFLoader();
        loader.load(
          modelUrl,
          gltf => {
            if (disposed) return;
            const model = gltf.scene;
            model.updateMatrixWorld(true);
            const initialBounds = new Box3().setFromObject(model);
            const dimensions = initialBounds.getSize(new Vector3());
            const largestDimension = Math.max(
              dimensions.x,
              dimensions.y,
              dimensions.z
            );
            model.scale.setScalar(1.46 / Math.max(largestDimension, 0.001));
            model.updateMatrixWorld(true);
            const centeredBounds = new Box3().setFromObject(model);
            model.position.sub(centeredBounds.getCenter(new Vector3()));
            model.traverse(object => {
              if (object instanceof Mesh) {
                object.frustumCulled = false;
                object.castShadow = false;
                object.receiveShadow = false;
                const materials = Array.isArray(object.material)
                  ? object.material
                  : [object.material];
                const preparedMaterials = materials.map(material => {
                  if (
                    (planetId === "saturn" || planetId === "uranus") &&
                    /ring/i.test(material.name)
                  ) {
                    return new MeshBasicMaterial({
                      map: material.map,
                      color: material.color,
                      transparent: true,
                      opacity: 0.96,
                      alphaTest: 0.01,
                      depthWrite: false,
                      side: DoubleSide,
                    });
                  }
                  material.side = DoubleSide;
                  return material;
                });
                object.material =
                  preparedMaterials.length === 1
                    ? preparedMaterials[0]
                    : preparedMaterials;
              }
            });
            group.remove(loadingPlanet);
            group.add(model);
            animatedGroups.push(model);
            disposables.push({
              dispose: () => {
                model.traverse(object => {
                  if (object instanceof Mesh) {
                    object.geometry.dispose();
                    const materials = Array.isArray(object.material)
                      ? object.material
                      : [object.material];
                    materials.forEach(material => {
                      material.map?.dispose();
                      material.dispose();
                    });
                  }
                });
              },
            });
          },
          undefined,
          () => setFallback("Modelul 3D NASA nu s-a putut încărca.")
        );
      } else if (planetId === "sirius") {
        const binary = new Group();
        binary.add(
          new Mesh(
            addGeometry(
              new SphereGeometry(
                0.46,
                mobileQuality ? 20 : 32,
                mobileQuality ? 20 : 32
              )
            ),
            addMaterial(new MeshBasicMaterial({ color: new Color("#d8f2ff") }))
          )
        );
        const companion = new Mesh(
          addGeometry(
            new SphereGeometry(
              0.16,
              mobileQuality ? 14 : 24,
              mobileQuality ? 14 : 24
            )
          ),
          addMaterial(new MeshBasicMaterial({ color: new Color("#b8d5ff") }))
        );
        companion.position.set(0.74, 0.12, 0);
        binary.add(companion);
        const orbit = new Mesh(
          addGeometry(new RingGeometry(0.66, 0.675, mobileQuality ? 48 : 80)),
          addMaterial(
            new MeshBasicMaterial({
              color: new Color("#b7d7dc"),
              transparent: true,
              opacity: 0.5,
              side: DoubleSide,
            })
          )
        );
        orbit.rotation.x = Math.PI / 2;
        binary.add(orbit);
        add(binary);
        animatedGroups.push(binary);
      } else if (planetId === "orion") {
        const stars = [
          [0.72, 0.58, 0.05],
          [0.14, 0.22, 0],
          [-0.16, -0.12, 0.04],
          [-0.5, 0.52, -0.03],
          [0.5, -0.43, 0.02],
          [-0.42, -0.66, 0],
        ];
        const positions = new Float32Array(stars.flat());
        const geometry = addGeometry(new BufferGeometry());
        geometry.setAttribute(
          "position",
          new Float32BufferAttribute(positions, 3)
        );
        add(
          new Points(
            geometry,
            addMaterial(
              new PointsMaterial({
                color: new Color("#f2d9a4"),
                size: mobileQuality ? 0.09 : 0.075,
                sizeAttenuation: true,
              })
            )
          )
        );
        const lineGeometry = addGeometry(new BufferGeometry());
        lineGeometry.setAttribute(
          "position",
          new Float32BufferAttribute(
            [
              ...stars[0],
              ...stars[1],
              ...stars[1],
              ...stars[2],
              ...stars[2],
              ...stars[3],
              ...stars[2],
              ...stars[4],
              ...stars[4],
              ...stars[5],
            ],
            3
          )
        );
        add(
          new Line(
            lineGeometry,
            addMaterial(
              new LineBasicMaterial({
                color: new Color("#d7a55d"),
                transparent: true,
                opacity: 0.62,
              })
            )
          )
        );
      } else if (planetId === "orion-nebula" || planetId === "crab-nebula") {
        const isCrab = planetId === "crab-nebula";
        const cloudPositions: number[] = [];
        const cloudCount = mobileQuality ? 180 : isCrab ? 420 : 340;
        for (let index = 0; index < cloudCount; index += 1) {
          const angle = index * 2.399963;
          const radius = 0.08 + ((index % 37) / 37) * 0.92;
          const spread = isCrab ? 0.22 : 0.42;
          cloudPositions.push(
            Math.cos(angle) * radius * (isCrab ? 1.22 : 1),
            Math.sin(index * 1.73) * spread * (1 - radius * 0.35),
            Math.sin(angle) * radius * (isCrab ? 0.62 : 0.8)
          );
        }
        const cloudGeometry = addGeometry(new BufferGeometry());
        cloudGeometry.setAttribute(
          "position",
          new Float32BufferAttribute(cloudPositions, 3)
        );
        add(
          new Points(
            cloudGeometry,
            addMaterial(
              new PointsMaterial({
                color: new Color(isCrab ? "#6f9fb2" : "#4d9995"),
                size: isCrab ? 0.035 : 0.045,
                transparent: true,
                opacity: 0.72,
                blending: AdditiveBlending,
              })
            )
          )
        );
        add(
          new Mesh(
            addGeometry(
              new SphereGeometry(
                isCrab ? 0.16 : 0.2,
                mobileQuality ? 16 : 24,
                mobileQuality ? 16 : 24
              )
            ),
            addMaterial(
              new MeshBasicMaterial({
                color: new Color(isCrab ? "#ed9c78" : "#da8a69"),
                transparent: true,
                opacity: 0.88,
                blending: AdditiveBlending,
              })
            )
          )
        );
      } else if (planetId === "black-hole") {
        add(
          new Mesh(
            addGeometry(new CircleGeometry(0.34, mobileQuality ? 32 : 64)),
            addMaterial(
              new MeshBasicMaterial({
                color: new Color("#010207"),
                side: DoubleSide,
              })
            )
          )
        );
        const disk = new Mesh(
          addGeometry(new RingGeometry(0.42, 0.96, mobileQuality ? 48 : 96)),
          addMaterial(
            new MeshBasicMaterial({
              color: new Color("#e38d6e"),
              transparent: true,
              opacity: 0.8,
              side: DoubleSide,
              blending: AdditiveBlending,
            })
          )
        );
        disk.rotation.x = Math.PI / 2.7;
        add(disk);
        const halo = new Mesh(
          addGeometry(new RingGeometry(0.98, 1.08, mobileQuality ? 48 : 96)),
          addMaterial(
            new MeshBasicMaterial({
              color: new Color("#d8a95b"),
              transparent: true,
              opacity: 0.42,
              side: DoubleSide,
              blending: AdditiveBlending,
            })
          )
        );
        halo.rotation.x = Math.PI / 2.7;
        add(halo);
      } else if (globeKind === "galaxy") {
        const points: number[] = [];
        for (let i = 0; i < (mobileQuality ? 260 : 520); i += 1) {
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
        const geometry = addGeometry(new BufferGeometry());
        geometry.setAttribute(
          "position",
          new Float32BufferAttribute(points, 3)
        );
        add(
          new Points(
            geometry,
            addMaterial(
              new PointsMaterial({
                color: new Color(accent),
                size: 0.025,
                transparent: true,
                opacity: 0.9,
              })
            )
          )
        );
        add(
          new Mesh(
            addGeometry(new CircleGeometry(0.14, mobileQuality ? 16 : 32)),
            addMaterial(new MeshBasicMaterial({ color: new Color("#fff3cc") }))
          )
        );
        group.rotation.x = -0.3;
      } else if (globeKind === "star") {
        add(
          new Mesh(
            addGeometry(
              new SphereGeometry(
                0.55,
                mobileQuality ? 20 : 32,
                mobileQuality ? 20 : 32
              )
            ),
            addMaterial(new MeshBasicMaterial({ color: new Color(accent) }))
          )
        );
        add(
          new Mesh(
            addGeometry(
              new SphereGeometry(
                0.82,
                mobileQuality ? 20 : 32,
                mobileQuality ? 20 : 32
              )
            ),
            addMaterial(
              new MeshBasicMaterial({
                color: new Color(accent),
                transparent: true,
                opacity: 0.12,
                side: BackSide,
              })
            )
          )
        );
      } else if (globeKind === "field") {
        const points: number[] = [];
        for (let i = 0; i < (mobileQuality ? 60 : 110); i += 1)
          points.push(
            (Math.random() - 0.5) * 2.3,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 0.25
          );
        const geometry = addGeometry(new BufferGeometry());
        geometry.setAttribute(
          "position",
          new Float32BufferAttribute(points, 3)
        );
        add(
          new Points(
            geometry,
            addMaterial(
              new PointsMaterial({
                color: new Color(accent),
                size: 0.035,
              })
            )
          )
        );
      } else {
        const material = addMaterial(
          textureUrl
            ? new MeshBasicMaterial({ color: 0xffffff })
            : new MeshStandardMaterial({
                color: new Color(color),
                roughness: planetId === "moon" ? 0.95 : 0.72,
                metalness: 0.02,
              })
        );
        const surface = addGeometry(
          new SphereGeometry(1, sphereSegments, mobileQuality ? 30 : 48)
        );
        const planetMesh = new Mesh(surface, material);
        add(planetMesh);
        if (textureUrl) {
          const loader = new TextureLoader();
          loader.setCrossOrigin("anonymous");
          loader.load(
            textureUrl,
            loaded => {
              if (disposed) {
                loaded.dispose();
                return;
              }
              loaded.colorSpace = SRGBColorSpace;
              loaded.anisotropy =
                renderer?.capabilities.getMaxAnisotropy() ?? 1;
              loaded.minFilter = LinearMipmapLinearFilter;
              loaded.magFilter = LinearFilter;
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
          const atmosphere = new Mesh(
            addGeometry(
              new SphereGeometry(
                1.075,
                atmosphereSegments,
                mobileQuality ? 20 : 32
              )
            ),
            addMaterial(
              new MeshBasicMaterial({
                color: new Color(profile.atmosphere),
                transparent: true,
                opacity: planetId === "moon" ? 0.04 : 0.13,
                side: BackSide,
              })
            )
          );
          add(atmosphere);
          if (profile.ring) {
            const ring = new Mesh(
              addGeometry(
                new RingGeometry(
                  profile.ring.inner,
                  profile.ring.outer,
                  mobileQuality ? 64 : 128
                )
              ),
              addMaterial(
                new MeshBasicMaterial({
                  color: new Color(profile.ring.color),
                  transparent: true,
                  opacity: profile.ring.opacity,
                  side: DoubleSide,
                })
              )
            );
            ring.rotation.x = Math.PI / 4.6;
            add(ring);
          }
        }
      }

      if (!modelUrl && globeKind !== "star" && !profile) {
        const rim = new Mesh(
          addGeometry(
            new SphereGeometry(
              globeKind === "sphere" ? 1.045 : 1.16,
              mobileQuality ? 20 : 32,
              mobileQuality ? 20 : 32
            )
          ),
          addMaterial(
            new MeshBasicMaterial({
              color: new Color(accent),
              transparent: true,
              opacity: 0.18,
              side: BackSide,
            })
          )
        );
        add(rim);
      }
      const starGeometry = addGeometry(new BufferGeometry());
      const starCount = mobileQuality ? 90 : 180;
      const starPositions = new Float32Array(starCount * 3);
      for (let index = 0; index < starCount; index += 1) {
        const radius = 2.3 + Math.random() * 1.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        starPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[index * 3 + 1] = radius * Math.cos(phi);
        starPositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      }
      starGeometry.setAttribute(
        "position",
        new BufferAttribute(starPositions, 3)
      );
      const stars = new Points(
        starGeometry,
        addMaterial(
          new PointsMaterial({
            color: 0xd9eadc,
            size: 0.018,
            transparent: true,
            opacity: 0.72,
          })
        )
      );
      scene.add(stars);
      animatedGroups.push(stars);
      const keyLight = new DirectionalLight(0xffe3b0, 2.4);
      keyLight.position.set(3, 2, 4);
      scene.add(keyLight);
      scene.add(new HemisphereLight(0xffe7c1, 0x14201e, 0.95));
      scene.add(new AmbientLight(0x466257, 0.62));

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
          stop = !entry?.isIntersecting || document.hidden;
          if (!stop && !frame) frame = requestAnimationFrame(render);
        },
        { threshold: 0.01 }
      );
      visibilityObserver.observe(mount);
      const onVisibility = () => {
        stop = document.hidden;
        if (!stop && !frame) frame = requestAnimationFrame(render);
      };
      document.addEventListener("visibilitychange", onVisibility);
      const render = () => {
        frame = 0;
        if (disposed || stop) return;
        if (!renderer || !scene || !camera) return;
        if (motionEnabled) {
          animatedGroups[0].rotation.y += 0.0022;
          animatedGroups[1].rotation.y -= 0.0007;
        }
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      frame = requestAnimationFrame(render);
      (mount as HTMLDivElement & { __cleanup?: () => void }).__cleanup = () => {
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    };
    let loadObserver: IntersectionObserver | undefined;
    const startBuild = () => {
      if (!defer) {
        void build();
        return;
      }
      const run = () => void build();
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(run, { timeout: 1200 });
      } else {
        window.setTimeout(run, 180);
      }
    };
    if (lazy && "IntersectionObserver" in window) {
      loadObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            loadObserver?.disconnect();
            loadObserver = undefined;
            startBuild();
          }
        },
        { rootMargin: "240px" }
      );
      loadObserver.observe(mount);
    } else {
      startBuild();
    }
    return () => {
      disposed = true;
      loadObserver?.disconnect();
      cancelAnimationFrame(frame);
      (mount as HTMLDivElement & { __cleanup?: () => void }).__cleanup?.();
      texture?.dispose();
      disposables.forEach(resource => resource.dispose());
      renderer?.dispose();
      if (renderer?.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
      mount.classList.remove("celestial-globe-webgl");
    };
  }, [
    accent,
    color,
    globeKind,
    lazy,
    motionEnabled,
    planetId,
    size,
    textureUrl,
    defer,
  ]);

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
