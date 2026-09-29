const loaders: Record<string, () => Promise<unknown>> = {
  "/tonight": () => import("../pages/Tonight"),
  "/library": () => import("../pages/Library"),
  "/routes": () => import("../pages/Routes"),
};

const prefetched = new Set<string>();

export function prefetchRoute(path: string) {
  const load = loaders[path];
  if (!load || prefetched.has(path)) return;
  prefetched.add(path);
  void load().catch(() => prefetched.delete(path));
}
