import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",

  headers: {
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Get authentication token
|--------------------------------------------------------------------------
|
| We use access_token as the main key.
|
| The extra checks are kept temporarily so an older login session
| does not break the application if the previous code stored the
| token under "token".
|
*/

function getStoredToken(): string | null {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    return accessToken;
  }

  const token = localStorage.getItem("token");

  if (token) {
    return token;
  }

  return null;
}

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
|
| Automatically sends:
|
| Authorization: Bearer <JWT>
|
| with every protected API request.
|
*/

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
|
| If backend returns 401, the token is invalid/expired.
| Remove the old token and send the user back to login.
|
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");

      /*
       * Do not redirect repeatedly if already on login page.
       */
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;