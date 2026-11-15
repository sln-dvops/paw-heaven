import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  PawPrint,
  Menu,
  X,
  ArrowUpRight,
  Mail,
  LogOut,
  UserRound,
  LayoutDashboard,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../context/AppContext";
const nav = [
  ["Home", "/"],
  ["About", "/about"],
  ["Adoption", "/adopt"],
  ["Release", "/release"],
  ["How it works", "/how-it-works"],
  ["Activities", "/activities"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];
export function Brand({ footer = false }) {
  return (
    <Link
      to="/"
      className={`brand ${footer ? "brand-footer" : ""}`}
      aria-label="Pet Heaven home"
    >
      <span className="brand-mark">
        <svg viewBox="0 0 58 58" aria-hidden="true">
          <path
            d="M7 27 29 9l22 18v23H7V27Z"
            fill="white"
            stroke="#30343b"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <path
            d="M29 44c-3.5-3.4-10-6.7-10-12a6 6 0 0 1 10-4.1A6 6 0 0 1 39 32c0 5.3-6.5 8.6-10 12Z"
            fill="#ff8196"
          />
          <g fill="#ff8196">
            <ellipse cx="20" cy="21" rx="2.4" ry="3" />
            <ellipse cx="26" cy="17" rx="2.3" ry="3" />
            <ellipse cx="33" cy="17" rx="2.3" ry="3" />
            <ellipse cx="39" cy="21" rx="2.4" ry="3" />
          </g>
        </svg>
      </span>
      <span className="brand-copy">
        pet<span>heaven</span>
        <small>Little Paws. Big Second Chances.</small>
      </span>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user, logout } = useApp();
  const loc = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [loc.pathname]);
  const goLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(([label, path]) => (
              <NavLink
                key={path}
                end={path === "/"}
                to={path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              className="button button-dark button-sm desktop-action"
              to="/donate"
            >
              <Heart size={15} /> Donate
            </Link>
            {user ? (
              <div className="profile-menu">
                <button
                  className="avatar-button"
                  aria-expanded={menu}
                  onClick={() => setMenu(!menu)}
                  aria-label="Profile menu"
                >
                  {user.name[0]?.toUpperCase()}
                  <ChevronDown size={14} />
                </button>
                {menu && (
                  <div className="menu-popover">
                    <div className="popover-user">
                      <strong>{user.name}</strong>
                      <small>
                        {user.role === "staff" ? "Staff" : "Member"}
                      </small>
                    </div>
                    {user.role === "staff" ? (
                      <Link to="/staff">
                        <LayoutDashboard size={16} /> Staff Dashboard
                      </Link>
                    ) : (
                      <Link to="/profile">
                        <UserRound size={16} /> My Profile
                      </Link>
                    )}
                    <button onClick={goLogout}>
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="login-link desktop-action" to="/login">
                Log in <ArrowUpRight size={15} />
              </Link>
            )}
            <button
              className="mobile-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            <div className="container">
              {nav.map(([label, path]) => (
                <Link key={path} to={path}>
                  {label}
                </Link>
              ))}
              <Link to="/donate">Make a donation</Link>
              {user ? (
                <>
                  <Link to="/profile">My profile</Link>
                  {user.role === "staff" && (
                    <Link to="/staff">Staff dashboard</Link>
                  )}
                  <button onClick={goLogout}>Log out</button>
                </>
              ) : (
                <Link to="/login">Log in / Sign up</Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand footer />
            <p>
              A little joy. A lot of love. Thoughtful adoption and responsible
              care, with kindness at the heart of every second chance.
            </p>
            <span className="footer-social">
              <Link to="/contact" aria-label="Contact and enquiries">
                <Mail size={19} />
              </Link>
            </span>{" "}
          </div>
          <div className="footer-links">
            <h4>Explore</h4>
            <Link to="/adopt">Meet the pets</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/activities">Events & volunteering</Link>
          </div>
          <div className="footer-links">
            <h4>Get involved</h4>
            <Link to="/donate">Give a little love</Link>
            <Link to="/release">Rehome a pet</Link>
            <Link to="/blog">Pet care journal</Link>
            <Link to="/contact">Say hello</Link>
          </div>
          <div className="footer-news">
            <h4>Made with a whole lot of heart.</h4>
            <p>
              Every kind act starts small. Explore, learn and make a difference.
            </p>
            <Link className="button button-primary" to="/adopt">
              Find a furry friend <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Pet Heaven</span>
        </div>
      </div>
    </footer>
  );
}
export function Toast() {
  const { toast, setToast } = useApp();
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4700);
    return () => clearTimeout(id);
  }, [toast?.id, setToast]);
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          role="status"
          aria-live="polite"
          className={`toast ${toast.type === "error" ? "toast-error" : ""}`}
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 20,
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle2 size={20} />
          )}
          <span>{toast.message}</span>
          <button aria-label="Dismiss message" onClick={() => setToast(null)}>
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function PageIntro({ eyebrow, title, body, tone = "cream" }) {
  return (
    <section className={`page-intro intro-${tone}`}>
      <div className="container">
        <div className="eyebrow">
          <PawPrint size={14} />
          {eyebrow}
        </div>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </section>
  );
}
export function SectionHead({ eyebrow, title, body, action, center = false }) {
  return (
    <div className={`section-head ${center ? "text-center" : ""}`}>
      <div>
        <div className="eyebrow">
          <PawPrint size={14} />
          {eyebrow}
        </div>
        <h2>{title}</h2>
        {body && <p>{body}</p>}
      </div>
      {action}
    </div>
  );
}
export function Protect({ children, staff = false }) {
  const { user } = useApp();
  const loc = useLocation();
  if (!user)
    return (
      <div className="container protect">
        <div className="protect-icon">
          <Heart size={38} />
        </div>
        <h2>Just one little step first!</h2>
        <p>Log in to your member account to continue.</p>
        <Link
          className="button button-primary"
          to="/login"
          state={{
            from: loc.pathname,
          }}
        >
          Log in to continue <ArrowUpRight size={17} />
        </Link>
      </div>
    );
  if (staff && user.role !== "staff")
    return (
      <div className="container protect">
        <h2>Staff-only area</h2>
        <p>This dashboard is only available to the staff account.</p>
        <Link to="/profile" className="button button-dark">
          Back to my profile
        </Link>
      </div>
    );
  return children;
}
export function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
