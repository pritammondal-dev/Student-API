import { useCallback } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import useIdleLogout from "../hooks/useIdleLogout";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

const handleLogout = useCallback(() => {
  logout();
  navigate("/admin/login");
}, [logout, navigate]);

useIdleLogout(handleLogout);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      {/* ================= Header ================= */}

      <header className="h-16 shrink-0 border-b border-gray-200 bg-white flex items-center justify-between px-6">
        {/* Brand */}

        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Student Management
          </h1>
        </div>

        {/* User */}

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {user?.username || "Admin"}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================= Body ================= */}

      <div className="flex h-[calc(100vh-4rem)]">
        {/* ================= Sidebar ================= */}

        <aside className="w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          <nav className="space-y-2 p-4">
            <NavLink
              to="/admin/dashboard"
              className={navLinkClass}
            >
              <span className="text-lg">📊</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/students"
              className={navLinkClass}
            >
              <span className="text-lg">👨‍🎓</span>
              <span>Students</span>
            </NavLink>

            <NavLink
              to="/admin/documents"
              className={navLinkClass}
            >
              <span className="text-lg">📚</span>
              <span>Documents</span>
            </NavLink>

            <NavLink
              to="/admin/payments"
              className={navLinkClass}
            >
              <span className="text-lg">💳</span>
              <span>Payments</span>
            </NavLink>

            <NavLink
              to="/admin/purchases"
              className={navLinkClass}
            >
              <span className="text-lg">🛒</span>
              <span>Purchases</span>
            </NavLink>

            <NavLink
              to="/admin/activity-logs"
              className={navLinkClass}
            >
              <span className="text-lg">📋</span>
              <span>Activity Logs</span>
            </NavLink>
          </nav>
        </aside>

        {/* ================= Page Content ================= */}

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;