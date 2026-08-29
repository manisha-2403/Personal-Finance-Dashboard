import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Budgets from "../pages/Budgets";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Reports from "../pages/Reports";

import MainLayout from "../components/layout/MainLayout";

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==========================================
            PUBLIC ROUTES
        ========================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==========================================
            PROTECTED APPLICATION
        ========================================== */}

        <Route
          element={<ProtectedRoute />}
        >

          <Route
            element={<MainLayout />}
          >

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/budgets"
              element={<Budgets />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />
            <Route
  path="/reports"
  element={<Reports />}
/>

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>

        </Route>


        {/* ==========================================
            DEFAULT ROUTE
        ========================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* ==========================================
            UNKNOWN ROUTES
        ========================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;