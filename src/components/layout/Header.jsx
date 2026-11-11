import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Inbox,
  LogOut,
  Menu,
  MessagesSquare,
  Share2,
  User,
  UserCheck,
  X,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import Logo from "./Logo";

const guestLinks = [
  { label: "How it works", href: "/#how" },
  { label: "Why Psst", href: "/#why" },
];

const memberLinks = [
  { label: "Inbox", to: "/inbox", icon: Inbox, badge: "messages" },
  { label: "Requests", to: "/requests", icon: UserCheck, badge: "requests" },
  { label: "Chats", to: "/conversations", icon: MessagesSquare, badge: "conversations" },
  { label: "My link", to: "/share", icon: Share2 },
];

function UnreadBadge({ count }) {
  if (!count) return null;
  return (
    <span
      aria-label={`${count} unread`}
      className="ml-0.5 inline-flex min-w-5 items-center justify-center border-2 border-ink bg-psst-pink px-1 text-[10px] leading-4 font-black text-ink"
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { unread } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onPointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout();
    toast.info("Logged out.");
    navigate("/", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    cn(
      "flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide underline-offset-4",
      isActive ? "underline decoration-psst-pink decoration-3" : "hover:underline"
    );

  return (
    <header className="sticky top-0 z-50 border-b-3 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo />

        <nav className="hidden items-center gap-5 md:flex">
          {isAuthenticated
            ? memberLinks.map(({ label, to, icon: Icon, badge }) => (
                <NavLink key={to} to={to} className={navLinkClass}>
                  <Icon size={15} />
                  {label}
                  <UnreadBadge count={badge ? unread[badge] : 0} />
                </NavLink>
              ))
            : guestLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-wide underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Account menu"
                className="press block"
              >
                <Avatar name={user?.username} image={user?.image} size={38} />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 border-3 border-ink bg-white shadow-brutal"
                >
                  <div className="border-b-3 border-ink px-3 py-2.5">
                    <p className="truncate text-sm font-black">{user?.username}</p>
                    <p className="truncate text-xs font-medium text-ink/55">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    role="menuitem"
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold hover:bg-psst-lime"
                  >
                    <User size={16} /> Profile
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t-3 border-ink px-3 py-2.5 text-left text-sm font-bold hover:bg-psst-pink"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button to="/login" variant="paper" size="sm">
                Log in
              </Button>
              <Button to="/signup" variant="primary" size="sm">
                Get my link
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="press border-3 border-ink bg-white p-1.5 shadow-brutal md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t-3 border-ink bg-white px-4 py-4 md:hidden">
          {isAuthenticated ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <Avatar name={user?.username} image={user?.image} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{user?.username}</p>
                  <p className="truncate text-xs font-medium text-ink/55">
                    {user?.email}
                  </p>
                </div>
              </div>

              <nav className="flex flex-col gap-3">
                {memberLinks.map(({ label, to, icon: Icon, badge }) => (
                  <NavLink key={to} to={to} className={navLinkClass}>
                    <Icon size={15} />
                    {label}
                    <UnreadBadge count={badge ? unread[badge] : 0} />
                  </NavLink>
                ))}
                <NavLink to="/profile" className={navLinkClass}>
                  <User size={15} />
                  Profile
                </NavLink>
              </nav>

              <Button
                variant="ink"
                size="sm"
                className="mt-4 w-full"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Log out
              </Button>
            </>
          ) : (
            <>
              <nav className="flex flex-col gap-3">
                {guestLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-bold uppercase tracking-wide"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2">
                <Button to="/login" variant="paper" size="sm">
                  Log in
                </Button>
                <Button to="/signup" variant="primary" size="sm">
                  Get my link
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
