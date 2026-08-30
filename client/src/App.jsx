import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";

import StudentRegister from "./pages/student/StudentRegister";
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentLibrary from "./pages/student/StudentLibrary";
import StudentPayments from "./pages/student/StudentPayments";
import StudentProfile from "./pages/student/StudentProfile";
import StudentDocumentViewer from "./pages/student/StudentDocumentViewer";
import StudentPurchases from "./pages/student/StudentPurchases";

import StudentRoute from "./components/StudentRoute";
import StudentLayout from "./layouts/StudentLayout";

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminPurchases from "./pages/admin/AdminPurchases";
import AdminActivityLogs from "./pages/admin/AdminActivityLogs";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminEvents from "./pages/admin/AdminEvents";

function App() {
  return (
    <Routes>
      {/* =========================
          Public
      ========================= */}

      <Route path="/" element={<LandingPage />} />

      {/* =========================
          Admin Authentication
      ========================= */}

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin/register" element={<AdminRegister />} />

      {/* =========================
          Student Authentication
      ========================= */}

      <Route path="/student/login" element={<StudentLogin />} />

      <Route
  path="/student/register"
  element={<StudentRegister />}
/>

      <Route element={<StudentRoute />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />

          <Route path="/student/library" element={<StudentLibrary />} />

          <Route
            path="/student/library/:id"
            element={<StudentDocumentViewer />}
          />

          <Route path="/student/purchases" element={<StudentPurchases />} />

          <Route path="/student/payments" element={<StudentPayments />} />

          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>
      </Route>

      {/* =========================
          Admin Protected
      ========================= */}

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/students" element={<AdminStudents />} />

          <Route path="/admin/documents" element={<AdminDocuments />} />

          <Route path="/admin/payments" element={<AdminPayments />} />

          <Route path="/admin/purchases" element={<AdminPurchases />} />

          <Route path="/admin/activity-logs" element={<AdminActivityLogs />} />

          <Route path="/admin/notices" element={<AdminNotices />} />

          <Route
      path="/admin/events"
      element={<AdminEvents />}
    />
          
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
