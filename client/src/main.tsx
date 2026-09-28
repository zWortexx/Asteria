import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initDomAnimations } from "./lib/dom-animations";

createRoot(document.getElementById("root")!).render(<App />);
window.requestAnimationFrame(() => initDomAnimations());

const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
if (analyticsEndpoint && analyticsWebsiteId) {
  const script = document.createElement("script");
  script.defer = true;
  script.src = `${analyticsEndpoint.replace(/\/$/, "")}/umami`;
  script.dataset.websiteId = analyticsWebsiteId;
  document.head.appendChild(script);
}
