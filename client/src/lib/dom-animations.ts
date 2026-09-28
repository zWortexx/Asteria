import { animate, stagger } from "animejs";

const entranceSelector = [
  ".hero-copy h1 span",
  ".hero-copy > .hero-dek",
  ".hero-copy .hero-actions .button",
  ".hero-copy > .hero-footnote",
  ".section-intro h1",
  ".section-intro .intro-dek",
].join(", ");
const revealSelector = [
  ".home-section h2",
  ".object-card",
  ".route-card",
  ".trust-strip > div",
  ".detail-section",
  ".aside-card",
  ".route-step-visual",
].join(", ");

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const staticMode = () => {
  try {
    return JSON.parse(
      localStorage.getItem("asteria-static-view-v1") ?? "false"
    ) as boolean;
  } catch {
    return false;
  }
};

function showImmediately(elements: HTMLElement[]) {
  elements.forEach(element => {
    element.style.opacity = "1";
    element.style.transform = "none";
  });
}

function staggeredEntrance() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(entranceSelector)
  ).filter(element => !element.dataset.animeEntered);
  if (!elements.length) return;
  elements.forEach(element => {
    element.dataset.animeEntered = "true";
    element.style.opacity = "0";
  });
  if (reducedMotion() || staticMode()) {
    showImmediately(elements);
    return;
  }
  animate(elements, {
    opacity: [0, 1],
    translateY: [24, 0],
    delay: stagger(68),
    duration: 760,
    ease: "out(4)",
  });
}

function observeScrollReveals() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(revealSelector)
  ).filter(element => !element.dataset.animeReveal);
  if (!elements.length || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => entry.target as HTMLElement);
      if (!visible.length) return;
      visible.forEach(element => {
        element.dataset.animeReveal = "true";
        observer.unobserve(element);
      });
      if (reducedMotion() || staticMode()) {
        showImmediately(visible);
        return;
      }
      visible.forEach(element => {
        element.style.opacity = "0";
      });
      animate(visible, {
        opacity: [0, 1],
        translateY: [18, 0],
        delay: stagger(55),
        duration: 620,
        ease: "out(4)",
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  elements.forEach(element => observer.observe(element));
}

function addCtaPhysics() {
  if (reducedMotion() || staticMode()) return;
  document
    .querySelectorAll<HTMLElement>(".hero-actions .button, .button-brass")
    .forEach(button => {
      if (button.dataset.animeHover) return;
      button.dataset.animeHover = "true";
      button.addEventListener("pointerenter", () =>
        animate(button, {
          scale: 1.035,
          translateY: -2,
          duration: 520,
          ease: "outElastic(1, .55)",
        })
      );
      button.addEventListener("pointerleave", () =>
        animate(button, {
          scale: 1,
          translateY: 0,
          duration: 260,
          ease: "out(2)",
        })
      );
      button.addEventListener("focus", () =>
        animate(button, {
          scale: 1.02,
          duration: 420,
          ease: "outElastic(1, .55)",
        })
      );
      button.addEventListener("blur", () =>
        animate(button, { scale: 1, duration: 220, ease: "out(2)" })
      );
    });
}

function addHeroParallax() {
  if (reducedMotion() || staticMode()) return;
  document.querySelectorAll<HTMLElement>(".hero-orbit-card").forEach(panel => {
    if (panel.dataset.animeParallax) return;
    panel.dataset.animeParallax = "true";
    panel.addEventListener("pointermove", event => {
      const rect = panel.getBoundingClientRect();
      animate(panel, {
        rotateX: ((event.clientY - rect.top) / rect.height - 0.5) * -2.4,
        rotateY: ((event.clientX - rect.left) / rect.width - 0.5) * 2.8,
        duration: 500,
        ease: "out(2)",
      });
    });
    panel.addEventListener("pointerleave", () =>
      animate(panel, {
        rotateX: 0,
        rotateY: 0,
        duration: 700,
        ease: "outElastic(1, .45)",
      })
    );
  });
}

export function initDomAnimations() {
  staggeredEntrance();
  observeScrollReveals();
  addCtaPhysics();
  addHeroParallax();
}
