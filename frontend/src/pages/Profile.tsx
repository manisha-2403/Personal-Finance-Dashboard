import { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get("/auth/me");

        setUser(response.data.user);
      } catch (error: unknown) {
        console.error("Failed to load profile:", error);

        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.detail ||
              "Failed to load profile."
          );
        } else {
          setError("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <p className="text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="text-slate-500 mt-2">
            View your account information.
          </p>
        </div>


        {/* PROFILE CARD */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

          {/* AVATAR */}

          <div className="flex items-center gap-5 mb-8">

            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
              {user?.username
                ? user.username.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {user?.username}
              </h2>

              <p className="text-slate-500">
                Personal Finance Dashboard User
              </p>
            </div>

          </div>


          {/* USER INFORMATION */}

          <div className="space-y-5">

            {/* USERNAME */}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Username
              </label>

              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900">
                {user?.username}
              </div>
            </div>


            {/* EMAIL */}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Email
              </label>

              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900">
                {user?.email}
              </div>
            </div>


            {/* USER ID */}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                User ID
              </label>

              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900">
                {user?.id}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;