"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

// ─── Icons (inline SVG components) ──────────────────────────────────────────
const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BagIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ─── Main Navbar Component ───────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistActive, setWishlistActive] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [activeNav, setActiveNav] = useState("/");
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 150);
    }
  }, [searchOpen]);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when menu/search is open
  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  const handleAddToCart = () => setCartCount((c) => c + 1);

  return (
    <>
      {/* ── Injected Styles ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        :root {
          --nav-bg: #FAFAF8;
          --nav-bg-scrolled: rgba(250,250,248,0.95);
          --nav-text: #1a1a18;
          --nav-accent: black;
          --nav-accent-light: #C9A84C;
          --nav-muted: #6b6b67;
          --nav-border: rgba(139,105,20,0.15);
          --nav-overlay: rgba(10,10,8,0.55);
          --nav-drawer-bg: #F5F3EE;
          --nav-height: 68px;
          --nav-height-sm: 60px;
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body: 'Jost', sans-serif;
          --transition: 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        .zaman-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          height: var(--nav-height);
          background: var(--nav-bg);
          border-bottom: 1px solid var(--nav-border);
          transition: background var(--transition), box-shadow var(--transition), height var(--transition);
          font-family: var(--font-body);
        }
        .zaman-nav.scrolled {
          background: var(--nav-bg-scrolled);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 1px 24px rgba(0,0,0,0.07);
        }
        .zaman-nav__inner {
          max-width: 1280px; margin: 0 auto;
          height: 100%; padding: 0 1.25rem;
          display: grid; grid-template-columns: 1fr auto 1fr;
          align-items: center; gap: 1rem;
        }
        
        /* ── Logo ── */
        .zaman-logo {
          display: flex; align-items: center; justify-content: center;
          grid-column: 2; text-decoration: none;
          font-family: var(--font-display); font-weight: 400;
          font-size: clamp(1.6rem, 3vw, 2rem);
          letter-spacing: 0.18em; color: var(--nav-text);
          user-select: none; transition: opacity 0.2s;
          white-space: nowrap;
        }
        .zaman-logo:hover { opacity: 0.72; }
        .zaman-logo img {
          max-height: 42px; max-width: 140px;
          width: auto; height: auto; object-fit: contain;
          display: block;
        }
        .zaman-logo__text {
          font-family: var(--font-display); font-size: 1.75rem;
          font-weight: 400; letter-spacing: 0.2em;
          color: var(--nav-text);
        }

        /* ── Desktop nav links ── */
        .zaman-nav__links {
          display: none;
          list-style: none; margin: 0; padding: 0;
          gap: 2.25rem; align-items: center;
        }
        @media(min-width:1024px){ .zaman-nav__links { display: flex; } }
        .zaman-nav__links a {
          font-family: var(--font-body); font-size: 0.7rem;
          font-weight: 500; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--nav-muted);
          text-decoration: none; position: relative;
          padding-bottom: 3px; transition: color var(--transition);
        }
        .zaman-nav__links a::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 1px; background: var(--nav-accent);
          transform: scaleX(0); transform-origin: left;
          transition: transform var(--transition);
        }
        .zaman-nav__links a:hover, .zaman-nav__links a.active { color: var(--nav-text); }
        .zaman-nav__links a:hover::after, .zaman-nav__links a.active::after { transform: scaleX(1); }

        /* ── Icon group ── */
        .zaman-nav__actions {
          display: flex; align-items: center; gap: 0.1rem;
          justify-content: flex-end;
        }
        .zaman-nav__left {
          display: flex; align-items: center; gap: 0.1rem;
          justify-content: flex-start;
        }
        .zaman-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 50%;
          background: transparent; border: none; cursor: pointer;
          color: var(--nav-text); position: relative;
          transition: background 0.2s, color 0.2s, transform 0.15s;
        }
        .zaman-icon-btn:hover {
            background: rgba(0,0,0,0.04);
  color: #111;
          transform: scale(1.08);
        }
        .zaman-icon-btn.active { color: var(--nav-accent); }
        .zaman-icon-btn.wishlist.active svg { fill: var(--nav-accent); }
        .zaman-cart-badge {
          position: absolute; top: 5px; right: 5px;
          width: 16px; height: 16px; border-radius: 50%;
          background: var(--nav-accent); color: #fff;
          font-size: 0.58rem; font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          line-height: 1; pointer-events: none;
          font-family: var(--font-body);
        }
        .zaman-hamburger { display: flex; }
        @media(min-width:1024px){ .zaman-hamburger { display: none; } }

        /* ── Mobile Drawer ── */
        .zaman-drawer-overlay {
          position: fixed; inset: 0; z-index: 1100;
          background: var(--nav-overlay);
          opacity: 0; pointer-events: none;
          transition: opacity var(--transition);
        }
        .zaman-drawer-overlay.open { opacity: 1; pointer-events: all; }
        .zaman-drawer {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: min(320px, 88vw); z-index: 1200;
          background: var(--nav-drawer-bg);
          transform: translateX(-100%);
          transition: transform var(--transition);
          display: flex; flex-direction: column;
          box-shadow: 4px 0 40px rgba(0,0,0,0.12);
        }
        .zaman-drawer.open { transform: translateX(0); }
        .zaman-drawer__header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 1.25rem;
          height: var(--nav-height-sm);
          border-bottom: 1px solid var(--nav-border);
          flex-shrink: 0;
        }
        .zaman-drawer__logo {
          font-family: var(--font-display); font-size: 1.5rem;
          font-weight: 400; letter-spacing: 0.2em; color: var(--nav-text);
          text-decoration: none;
        }
        .zaman-drawer__logo img {
          max-height: 36px; width: auto; height: auto; object-fit: contain;
        }
        .zaman-drawer__nav {
          flex: 1; padding: 2rem 0; overflow-y: auto;
        }
        .zaman-drawer__nav ul {
          list-style: none; margin: 0; padding: 0;
        }
        .zaman-drawer__nav li { border-bottom: 1px solid var(--nav-border); }
        .zaman-drawer__nav a {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 1.5rem;
          font-family: var(--font-body); font-size: 0.75rem;
          font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--nav-muted);
          text-decoration: none;
          transition: color 0.2s, padding-left 0.2s, background 0.2s;
        }
        .zaman-drawer__nav a:hover, .zaman-drawer__nav a.active {
          color: var(--nav-accent); background: rgba(139,105,20,0.04);
          padding-left: 1.85rem;
        }
        .zaman-drawer__nav a .arrow { opacity: 0; transition: opacity 0.2s, transform 0.2s; }
        .zaman-drawer__nav a:hover .arrow, .zaman-drawer__nav a.active .arrow {
          opacity: 1; transform: translateX(3px);
        }
        .zaman-drawer__footer {
          padding: 1.5rem; border-top: 1px solid var(--nav-border);
          display: flex; gap: 0.5rem; flex-shrink: 0;
        }
        .zaman-drawer__footer-btn {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; padding: 0.75rem 0.5rem;
          border-radius: 6px; border: 1px solid var(--nav-border);
          background: transparent; cursor: pointer; color: var(--nav-muted);
          font-family: var(--font-body); font-size: 0.7rem;
          font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
          transition: all 0.2s;
        }
        .zaman-drawer__footer-btn:hover {
          background: var(--nav-accent); color: #fff; border-color: var(--nav-accent);
        }

        /* ── Search Modal ── */
        .zaman-search-overlay {
          position: fixed; inset: 0; z-index: 1300;
          background: var(--nav-overlay);
          opacity: 0; pointer-events: none;
          transition: opacity var(--transition);
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 80px;
        }
        .zaman-search-overlay.open { opacity: 1; pointer-events: all; }
        .zaman-search-modal {
          width: min(640px, 92vw);
          background: var(--nav-bg);
          border-radius: 12px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18);
          overflow: hidden;
          transform: translateY(-24px) scale(0.97);
          transition: transform var(--transition);
        }
        .zaman-search-overlay.open .zaman-search-modal {
          transform: translateY(0) scale(1);
        }
        .zaman-search-modal__top {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid var(--nav-border);
        }
        .zaman-search-modal__input {
          flex: 1; border: none; outline: none; background: transparent;
          font-family: var(--font-body); font-size: 1rem;
          font-weight: 300; color: var(--nav-text);
          letter-spacing: 0.04em;
        }
        .zaman-search-modal__input::placeholder { color: #b0ae9d; }
        .zaman-search-modal__hint {
          padding: 1.5rem 1.25rem 1.75rem;
          font-family: var(--font-body); font-size: 0.72rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--nav-muted);
        }
        .zaman-search-modal__hint strong {
          display: block; margin-bottom: 0.75rem;
          color: var(--nav-text); font-weight: 500;
        }
        .zaman-search-tags {
          display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;
        }
        .zaman-search-tag {
          padding: 0.35rem 0.85rem; border-radius: 100px;
          border: 1px solid var(--nav-border); background: transparent;
          font-family: var(--font-body); font-size: 0.68rem;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--nav-muted); cursor: pointer;
          transition: all 0.2s;
        }
        .zaman-search-tag:hover {
          background: var(--nav-accent); color: #fff;
          border-color: var(--nav-accent);
        }

        /* ── Decorative top stripe ── */
        .zaman-nav::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--nav-accent-light) 40%, var(--nav-accent) 60%, transparent 100%);
        }

        /* ── Responsive tweaks ── */
        @media(max-width:480px){
          .zaman-nav__inner { padding: 0 1rem; }
          .zaman-logo__text { font-size: 1.5rem; }
        }
        @media(min-width:1024px){
          .zaman-nav { height: var(--nav-height); }
        }
      `}</style>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav
        className={`zaman-nav${scrolled ? " scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="zaman-nav__inner">
          {/* Left: hamburger (mobile) + desktop nav links */}
          <div className="zaman-nav__left">
            <button
              className="zaman-icon-btn zaman-hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <MenuIcon />
            </button>

            {/* Desktop links */}
            <ul className="zaman-nav__links" role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} >
                  <Link
                    href={item.href}
                    className={activeNav === item.href ? "active" : ""}
                    onClick={() => setActiveNav(item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/">
            <Image
              src="/bg-remove-logo.png"
              height={500}
              width={500}
              alt="Logo"
              style={{
                height: "75px", // mobile
                width: "auto",
                maxWidth: "110px",
                objectFit: "contain",
              }}
            />
          </Link>

          {/* Right: Search, Wishlist, Cart */}
          <div className="zaman-nav__actions">
            <button
              className={`zaman-icon-btn${searchOpen ? " active" : ""}`}
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <SearchIcon />
            </button>

            <button
              className={`zaman-icon-btn wishlist${wishlistActive ? " active" : ""}`}
              onClick={() => setWishlistActive((w) => !w)}
              aria-label={
                wishlistActive ? "Remove from wishlist" : "Add to wishlist"
              }
              aria-pressed={wishlistActive}
            >
              <HeartIcon filled={wishlistActive} />
            </button>

            <button
              className="zaman-icon-btn"
              onClick={handleAddToCart}
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <BagIcon />
              {cartCount > 0 && (
                <span className="zaman-cart-badge" aria-hidden="true">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer Overlay ────────────────────────────────────────── */}
      <div
        className={`zaman-drawer-overlay${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ────────────────────────────────────────────────── */}
      <aside
        className={`zaman-drawer${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="zaman-drawer__header">
          <Link href="/" onClick={() => setMenuOpen(false)}>
           
              <Image
                src="/bg-remove-logo.png"
                height={500}
                width={500}
                alt="Logo"
                style={{
                  height: "75px", // mobile
                  width: "auto",
                  maxWidth: "110px",
                  objectFit: "contain",
                }}
              />

          </Link>
          <button
            className="zaman-icon-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="zaman-drawer__nav">
          <ul role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={activeNav === item.href ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNav(item.href);
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                  <span className="arrow">
                    <ArrowRightIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="zaman-drawer__footer">
          <button
            className="zaman-drawer__footer-btn"
            onClick={() => {
              setWishlistActive((w) => !w);
              setMenuOpen(false);
            }}
            aria-label="Wishlist"
          >
            <HeartIcon filled={wishlistActive} />
            <span>Wishlist</span>
          </button>
          <button
            className="zaman-drawer__footer-btn"
            onClick={() => {
              handleAddToCart();
              setMenuOpen(false);
            }}
            aria-label="Add to cart"
          >
            <BagIcon />
            <span>Bag {cartCount > 0 && `(${cartCount})`}</span>
          </button>
        </div>
      </aside>

      {/* ── Search Modal Overlay ─────────────────────────────────────────── */}
      <div
        className={`zaman-search-overlay${searchOpen ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSearchOpen(false);
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="zaman-search-modal">
          <div className="zaman-search-modal__top">
            <SearchIcon />
            <input
              ref={searchInputRef}
              className="zaman-search-modal__input"
              type="search"
              placeholder="Search for products, collections…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
              aria-label="Search"
            />
            <button
              className="zaman-icon-btn"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="zaman-search-modal__hint">
            <strong>Popular searches</strong>
            <div className="zaman-search-tags">
              {[
                "New arrivals",
                "Kurtis",
                "Sarees",
                "Panjabi",
                "Eid collection",
                "Sale",
              ].map((tag) => (
                <button
                  key={tag}
                  className="zaman-search-tag"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
