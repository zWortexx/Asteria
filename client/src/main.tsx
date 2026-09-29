import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

const loadAnimations = () => {
  void import("./lib/dom-animations").then(({ initDomAnimations }) => {
    initDomAnimations();
  });
};

if (typeof window.requestIdleCallback === "function") {
  window.requestIdleCallback(loadAnimations, { timeout: 1200 });
} else {
  window.setTimeout(loadAnimations, 250);
}

const loadAnalytics = () => {
  const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
  if (!analyticsEndpoint || !analyticsWebsiteId) return;
  const script = document.createElement("script");
  script.defer = true;
  script.async = true;
  script.src = `${analyticsEndpoint.replace(/\/$/, "")}/umami`;
  script.dataset.websiteId = analyticsWebsiteId;
  document.head.appendChild(script);
};

if (typeof window.requestIdleCallback === "function") {
  window.requestIdleCallback(loadAnalytics, { timeout: 2500 });
} else {
  window.addEventListener("load", loadAnalytics, { once: true });
}
