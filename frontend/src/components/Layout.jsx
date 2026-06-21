import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Search, PieChart, Newspaper, ShieldAlert,
  ScrollText, Sparkles, TrendingUp, Bell, Settings,
  MessageSquare, GitCompareArrows, FlaskConical, MapPin,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/search", label: "Company Search", icon: Search },
  { to: "/risk", label: "Risk Breakdown", icon: PieChart },
  { to: "/news", label: "News Feed", icon: Newspaper },
  { to: "/cyber", label: "Cyber Exposure", icon: ShieldAlert },
  { to: "/compliance", label: "Compliance", icon: ScrollText },
  { to: "/insights", label: "AI Insights", icon: Sparkles },
  { to: "/trends", label: "Historical Trends", icon: TrendingUp },
  { to: "/alerts", label: "Alert Center", icon: Bell },
  { to: "/chat", label: "AI Chat Assistant", icon: MessageSquare },
  { to: "/similar", label: "Similar Companies", icon: GitCompareArrows },
  { to: "/scenario", label: "Scenario Simulation", icon: FlaskConical },
  { to: "/map", label: "Risk Map", icon: MapPin },
  { to: "/admin", label: "Admin", icon: Settings },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 bg-slate-900 text-slate-200 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-800">
          <h1 className="text-lg font-bold text-white leading-tight">Vendor Risk</h1>
          <p className="text-xs text-slate-400">Intelligence Platform</p>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 text-xs text-slate-500 border-t border-slate-800">
          Mock data mode — connect live APIs in backend/services
        </div>
      </aside>
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
