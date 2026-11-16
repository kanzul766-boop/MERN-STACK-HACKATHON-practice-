import { useEffect, useMemo, useRef } from "react";
import {
  Activity,
  Bell,
  CalendarDays,
  Clock3,
  Grid2X2,
  HeartPulse,
  LogOut,
  Search,
  Settings2,
  UserRound,
  UsersRound,
} from "lucide-react";
import gsap from "gsap";
import { navByRole } from "../data.js";

const icons = {
  search: Search,
  calendar: CalendarDays,
  bell: Bell,
  user: UserRound,
  grid: Grid2X2,
  clock: Clock3,
  users: UsersRound,
};

export default function AppShell({ user, view, setView, onLogout, children, unread = 0 }) {
  const mainRef = useRef(null);
  const items = navByRole[user.role] || navByRole.patient;
  const greetingName = user.name || user.userName || "there";
  const roleTitle = user.role === "admin" ? "Care operations" : user.role === "doctor" ? "Clinical workspace" : "Your care space";

  useEffect(() => {
    if (!mainRef.current) return;
    const entering = mainRef.current.querySelectorAll(".page-enter");
    if (entering.length) {
      gsap.fromTo(entering,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.48, stagger: 0.06, ease: "power2.out", clearProps: "transform" },
      );
    }
    const cards = mainRef.current.querySelectorAll(".doctor-card, .stat-card, .appointment-card");
    const cleanups = [];
    cards.forEach((card) => {
      const enter = () => gsap.to(card, { y: -4, duration: 0.2, ease: "power2.out", overwrite: true });
      const leave = () => gsap.to(card, { y: 0, duration: 0.24, ease: "power2.out", overwrite: true });
      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
        gsap.killTweensOf(card);
      });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [view]);

  const avatar = useMemo(() => (greetingName[0] || "C").toUpperCase(), [greetingName]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand brand-dark sidebar-brand" onClick={() => setView(user.role === "patient" ? "discover" : "overview")}>
          <span className="brand-mark"><HeartPulse size={20} /></span><span>clair<span className="brand-period">.</span></span>
        </button>
        <div className="workspace-label">{roleTitle}</div>
        <nav className="side-nav" aria-label="Main navigation">
          {items.map((item) => {
            const Icon = icons[item.icon];
            return (
              <button key={item.id} className={`nav-item ${view === item.id ? "selected" : ""}`} onClick={() => setView(item.id)}>
                <Icon size={18} strokeWidth={1.8} /><span>{item.label}</span>
                {item.id === "notifications" && unread > 0 && <span className="nav-count">{unread}</span>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-support">
          <div className="support-orbit"><Activity size={19} /></div>
          <strong>A little help?</strong>
          <span>Your care team is here for you.</span>
          <button onClick={() => setView("profile")}>Visit your profile <span>↗</span></button>
        </div>
        <button className="nav-item logout-item" onClick={onLogout}><LogOut size={18} /><span>Sign out</span></button>
        <div className="sidebar-legal">Thoughtful care, by Clair Health</div>
      </aside>
      <main className="workspace" ref={mainRef}>
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{items.find((item) => item.id === view)?.label || view}</strong></div>
          <div className="topbar-right">
            <button className="top-icon" onClick={() => setView("notifications")} aria-label="Notifications"><Bell size={18} />{unread > 0 && <i />}</button>
            <button className="user-chip" onClick={() => setView("profile")}>
              <span className="user-avatar-small">{avatar}</span>
              <span className="user-chip-text"><strong>{greetingName}</strong><small>{user.role}</small></span>
              <Settings2 size={15} className="chip-settings" />
            </button>
          </div>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
