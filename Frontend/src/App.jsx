import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CheckEmail from "./pages/auth/CheckEmail";
import VerifyEmail from "./pages/auth/VerifyEmail";

import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Pricing from "./pages/dashboard/Pricing";
import PurchaseHistory from "./pages/dashboard/PurchaseHistory";
import Settings from "./pages/dashboard/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Users from "./pages/dashboard/Users";
import UserDetails from "./pages/dashboard/UserDetails";
import Lms from "./pages/dashboard/Lms";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/verify-email" element={<VerifyEmail/>} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}

  

      {/* <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/purchase-history" element={<PurchaseHistory />} />
      <Route path="/settings" element={<Settings />} /> */}

      <Route element={<ProtectedRoute />}>

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/pricing" element={<Pricing />} />

        <Route
          path="/purchase-history"
          element={<PurchaseHistory />}
        />

        <Route path="/settings" element={<Settings />} />

      </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<Users />}
          />

          <Route
              path="/admin/users/:userId"
              element={<UserDetails/>}
          />
          <Route
              path="/admin/dashboard/lms"
              element={<Lms/>}
          />

        </Route>

    </Routes>



  );
}

export default App;
