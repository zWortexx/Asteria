import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { Shell } from "./components/layout/Shell";
import { MotionProvider } from "./contexts/MotionContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { getObject, getRoute, type AstroRoute } from "./lib/asteria-data";

const Home = lazy(() => import("./pages/Home"));
const Tonight = lazy(() => import("./pages/Tonight"));
const RoutesPage = lazy(() => import("./pages/Routes"));
const RouteDetail = lazy(() => import("./pages/RouteDetail"));
const Library = lazy(() => import("./pages/Library"));
const Saved = lazy(() => import("./pages/Saved"));
const About = lazy(() => import("./pages/About"));
const ObjectPage = lazy(() => import("./pages/ObjectPage"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

function PageFallback() {
  return (
    <div className="page-loading" role="status">
      Se încarcă…
    </div>
  );
}

function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tonight" component={Tonight} />
        <Route path="/routes" component={RoutesPage} />
        <Route path="/routes/:slug">
          {params => {
            const route = getRoute(params.slug);
            return route ? <RouteDetail route={route} /> : <NotFoundPage />;
          }}
        </Route>
        <Route path="/library" component={Library} />
        <Route path="/saved" component={Saved} />
        <Route path="/about" component={About} />
        <Route path="/object/:slug">
          {params => {
            const item = getObject(params.slug);
            return item ? <ObjectPage item={item} /> : <NotFoundPage />;
          }}
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <MotionProvider>
          <Shell>
            <AppRouter />
          </Shell>
        </MotionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
