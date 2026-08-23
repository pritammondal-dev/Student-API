import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/student/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex w-full items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? "bg-gray-900 text-white"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-gray-200 bg-white">

        {/* Brand */}
        <div className="border-b border-gray-200 px-6 py-6">
          <h2 className="text-xl font-bold text-gray-900">
            Student Portal
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Student Management
          </p>
        </div>

        {/* Student User */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">

          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          {/* User Info */}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-900">
              {user?.name || "Student"}
            </h3>

            <span className="text-xs text-gray-500">
              {user?.student_id || ""}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1.5 px-3.5 py-6">

          <NavLink
            to="/student/dashboard"
            className={navLinkClass}
          >
            <span>📊</span>
            <span className="ml-3">Dashboard</span>
          </NavLink>

          <NavLink
            to="/student/library"
            className={navLinkClass}
          >
            <span>📚</span>
            <span className="ml-3">Library</span>
          </NavLink>

          <NavLink
            to="/student/purchases"
            className={navLinkClass}
          >
            <span>🛒</span>
            <span className="ml-3">My Purchases</span>
          </NavLink>

          <NavLink
            to="/student/payments"
            className={navLinkClass}
          >
            <span>💳</span>
            <span className="ml-3">Payments</span>
          </NavLink>

          <NavLink
            to="/student/profile"
            className={navLinkClass}
          >
            <span>👤</span>
            <span className="ml-3">Profile</span>
          </NavLink>

        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Topbar */}
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-7">

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Student Portal
            </h1>
          </div>

          <div className="flex items-center">
            <span className="text-sm font-semibold text-gray-700">
              {user?.name || "Student"}
            </span>
          </div>

        </header>

        {/* Page Content */}
        <main className="min-w-0 flex-1 overflow-x-hidden p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default StudentLayout;