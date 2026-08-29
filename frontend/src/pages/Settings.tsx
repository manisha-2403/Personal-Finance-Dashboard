import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getStoredUser,
  logoutUser,
} from "../services/authService";

type User = {
  id: number;
  username: string;
  email: string;
};

function Settings() {
  const navigate = useNavigate();

  const [user, setUser] =
    useState<User | null>(null);

  const [currency, setCurrency] =
    useState("INR");

  const [budgetAlerts, setBudgetAlerts] =
    useState(true);

  const [saved, setSaved] =
    useState(false);

  // ==========================================
  // LOAD SETTINGS
  // ==========================================

  useEffect(() => {
    const storedUser =
      getStoredUser();

    setUser(storedUser);

    const storedCurrency =
      localStorage.getItem(
        "preferred_currency"
      );

    const storedBudgetAlerts =
      localStorage.getItem(
        "budget_alerts"
      );

    if (storedCurrency) {
      setCurrency(storedCurrency);
    }

    if (storedBudgetAlerts !== null) {
      setBudgetAlerts(
        storedBudgetAlerts === "true"
      );
    }
  }, []);

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

  function handleSave() {
    localStorage.setItem(
      "preferred_currency",
      currency
    );

    localStorage.setItem(
      "budget_alerts",
      String(budgetAlerts)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  function handleLogout() {
    logoutUser();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">

      <div className="max-w-4xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your account and finance preferences.
          </p>

        </div>


        {/* ======================================
            ACCOUNT INFORMATION
        ====================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">

          <h2 className="text-xl font-bold text-slate-900 mb-1">
            Account
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Your Personal Finance Dashboard account.
          </p>


          <div className="space-y-5">

            {/* USERNAME */}

            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Username
              </label>

              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                {user?.username || "Not available"}
              </div>

            </div>


            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Email
              </label>

              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                {user?.email || "Not available"}
              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/profile")
            }
            className="mt-6 px-5 py-2.5 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            View Profile
          </button>

        </div>


        {/* ======================================
            FINANCE PREFERENCES
        ====================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">

          <h2 className="text-xl font-bold text-slate-900 mb-1">
            Finance Preferences
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Customize your finance dashboard preferences.
          </p>


          {/* CURRENCY */}

          <div className="mb-6">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Preferred Currency
            </label>

            <select
              value={currency}
              onChange={(e) =>
                setCurrency(
                  e.target.value
                )
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="INR">
                Indian Rupee (₹)
              </option>

              <option value="USD">
                US Dollar ($)
              </option>

              <option value="EUR">
                Euro (€)
              </option>

              <option value="GBP">
                British Pound (£)
              </option>

            </select>

          </div>


          {/* BUDGET ALERTS */}

          <div className="flex items-center justify-between border border-slate-200 rounded-xl p-4 mb-6">

            <div>

              <p className="font-medium text-slate-900">
                Budget Alerts
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Enable warnings when spending approaches your monthly budget.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setBudgetAlerts(
                  !budgetAlerts
                )
              }
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                budgetAlerts
                  ? "bg-blue-600"
                  : "bg-slate-300"
              }`}
            >

              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                  budgetAlerts
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />

            </button>

          </div>


          {/* SAVE */}

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Save Settings
            </button>


            {saved && (
              <span className="text-green-600 font-medium">
                ✓ Settings saved
              </span>
            )}

          </div>

        </div>


        {/* ======================================
            SESSION
        ====================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

          <h2 className="text-xl font-bold text-slate-900 mb-1">
            Session
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Manage your current login session.
          </p>


          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Settings;