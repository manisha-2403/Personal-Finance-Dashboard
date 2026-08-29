import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email: email.trim(),
        password,
      });


      // ========================================
      // GO TO DASHBOARD
      // ========================================

      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Login failed:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Invalid email or password.");
        } else if (error.response?.data?.detail) {
          setError(error.response.data.detail);
        } else {
          setError(
            "Unable to login. Please make sure the backend is running."
          );
        }
      } else {
        setError(
          "Unable to login. Please make sure the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* LOGIN CARD */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

          {/* TITLE */}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Personal Finance Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Sign in to manage your finances.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-5 text-sm">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* REGISTER LINK */}

          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}

              <button
                type="button"
                onClick={() =>
                  navigate("/register")
                }
                className="text-blue-600 font-medium hover:underline"
              >
                Create account
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;