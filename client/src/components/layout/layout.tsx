import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, Search, Star, X } from "lucide-react";
import { Toaster } from "sonner";
import { initDomAnimations } from "../../lib/dom-animations";
import { useMotion } from "../../contexts/MotionContext";
import { cx } from "../../lib/utils";
import { prefetchRoute } from "../../lib/route-preload";
import {
  emptySearchBody,
  emptySearchTitle,
  footerLinks,
  footerNote,
  getSearchText,
  navItems,
  normalizeText,
  objects,
} from "../../lib/asteria-data";
export function Brand() {
  return (
    <Link
      href="/"
      className="brand-mark"
      aria-label="Pagina principală Asteria"
    >
      <span className="brand-dot" /> <span>Asteria</span>
      <small>Ghid de astronomie</small>
    </Link>
  );
}

export function Header({
  onSearch,
  onMenu,
}: {
  onSearch: () => void;
  onMenu: () => void;
}) {
  const [location] = useLocation();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navigare principală">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => prefetchRoute(item.href)}
              onFocus={() => prefetchRoute(item.href)}
              className={cx(
                "nav-link",
                (item.href === "/"
                  ? location === "/"
                  : location.startsWith(item.href)) && "is-active"
              )}
            >
              <span>{item.short}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button search-trigger"
            onClick={onSearch}
            aria-label="Caută în colecție"
          >
            <Search size={17} />
            <span>
              Caută <kbd>⌘ K</kbd>
            </span>
          </button>
          <button
            className="icon-button menu-trigger"
            onClick={onMenu}
            aria-label="Deschide navigarea"
          >
            <Menu size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Brand />
          <p className="footer-note">{footerNote}</p>
        </div>
        <div>
          <p className="eyebrow">Pe scurt</p>
          <p className="footer-copy">
            Începe cu o întrebare. Pleacă având un loc pe cer.
          </p>
        </div>
        <div>
          <p className="eyebrow">Navigare</p>
          <div className="footer-links">
            {footerLinks.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => prefetchRoute(item.href)}
                onFocus={() => prefetchRoute(item.href)}
              >
                {item.label}
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Asteria</span>
        <span>Limbaj clar · surse verificate · mișcare opțională</span>
        <span>Versiunea 1.0</span>
      </div>
    </footer>
  );
}

function useOverlayFocus(onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, input, a, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(element => !element.hasAttribute("disabled"));
    focusables()[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const elements = focusables();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [onClose]);
  return panelRef;
}

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [, navigate] = useLocation();
  const panelRef = useOverlayFocus(onClose);
  const matches = useMemo(
    () =>
      objects
        .filter(item =>
          getSearchText(item).includes(normalizeText(query.trim()))
        )
        .slice(0, 6),
    [query]
  );
  const searchResults = query.trim() ? matches : objects.slice(0, 6);
  const openActiveResult = () => {
    const item = searchResults[activeIndex];
    if (!item) return;
    navigate(`/object/${item.slug}`);
    onClose();
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && searchResults.length) {
      event.preventDefault();
      setActiveIndex(index => (index + 1) % searchResults.length);
    } else if (event.key === "ArrowUp" && searchResults.length) {
      event.preventDefault();
      setActiveIndex(
        index => (index - 1 + searchResults.length) % searchResults.length
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      openActiveResult();
    }
  };
  return (
    <div
      className="overlay-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Caută în colecție"
    >
      <div ref={panelRef} className="search-panel">
        <div className="search-panel-top">
          <div className="search-input-wrap">
            <Search size={19} />
            <input
              autoFocus
              value={query}
              onKeyDown={handleKeyDown}
              onChange={event => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              placeholder="Caută lumi, modele sau idei…"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls="search-results-list"
              aria-activedescendant={
                searchResults[activeIndex]
                  ? `search-option-${searchResults[activeIndex].id}`
                  : undefined
              }
            />
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Închide căutarea"
          >
            <X size={19} />
          </button>
        </div>
        <div className="search-hint">
          Încearcă „apă”, „lumină”, „M31” sau o categorie.
        </div>
        {!query.trim() && <p className="search-suggestions-title">Sugestii</p>}
        <div
          className="search-results"
          id="search-results-list"
          role="listbox"
          aria-label={query.trim() ? "Rezultate" : "Sugestii"}
        >
          {query.trim() && matches.length === 0 ? (
            <div className="empty-search">
              <p className="eyebrow">{emptySearchTitle}</p>
              <p>{emptySearchBody}</p>
            </div>
          ) : (
            searchResults.map((item, index) => (
              <Link
                onClick={onClose}
                key={item.id}
                id={`search-option-${item.id}`}
                href={`/object/${item.slug}`}
                className={cx(
                  "search-result",
                  activeIndex === index && "is-active"
                )}
                role="option"
                aria-selected={activeIndex === index}
                onMouseMove={() => setActiveIndex(index)}
              >
                <div
                  className="search-result-icon"
                  style={
                    { "--object-color": item.color } as React.CSSProperties
                  }
                >
                  <Star size={14} />
                </div>
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {item.family} · {item.eyebrow}
                  </span>
                </div>
                <ArrowUpRight size={15} />
              </Link>
            ))
          )}
        </div>
        <div className="search-footer">
          <span>↑ ↓ navighează</span>
          <span>Enter deschide</span>
          <kbd>Esc</kbd>
        </div>
      </div>
    </div>
  );
}

export function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay-backdrop mobile-menu-backdrop">
      <aside className="mobile-drawer">
        <div className="drawer-top">
          <Brand />
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Închide navigarea"
          >
            <X size={19} />
          </button>
        </div>
        <p className="drawer-label">Navigare</p>
        {navItems.map(item => (
          <Link
            onClick={onClose}
            key={item.href}
            href={item.href}
            onMouseEnter={() => prefetchRoute(item.href)}
            onFocus={() => prefetchRoute(item.href)}
            className="drawer-link"
          >
            <span>{item.short}</span>
            <strong>{item.label}</strong>
            <ArrowUpRight size={15} />
          </Link>
        ))}
        <div className="drawer-rule" />
        <p className="drawer-label">
          Asteria este un ghid spațial calm pentru explorarea cerului.
        </p>
      </aside>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    initDomAnimations();
  }, [location]);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Sari la conținut
      </a>
      <Header
        onSearch={() => setSearchOpen(true)}
        onMenu={() => setMenuOpen(true)}
      />
      <main id="main">{children}</main>
      <Footer />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: "#ece7d9", color: "#182321", border: "0" },
        }}
      />
    </div>
  );
}
