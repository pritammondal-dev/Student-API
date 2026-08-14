import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route path="/" element={<LandingPage />} />

      <Route
        path="/admin/register"
        element={<AdminRegister />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

      </Route>

    </Routes>
  );
}

export default App;