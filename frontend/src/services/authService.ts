import api from "./api";

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;

  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}


// ==========================================================
// LOGIN
// ==========================================================

export async function loginUser(
  data: LoginData
): Promise<LoginResponse> {

  const response = await api.post<LoginResponse>(
    "/auth/login",
    {
      email: data.email,
      password: data.password,
    }
  );

  const result = response.data;


  // Save JWT token

  localStorage.setItem(
    "access_token",
    result.access_token
  );


  // Save logged-in user

  localStorage.setItem(
    "user",
    JSON.stringify(result.user)
  );


  return result;
}


// ==========================================================
// REGISTER
// ==========================================================

export async function registerUser(
  data: RegisterData
) {

  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
}


// ==========================================================
// LOGOUT
// ==========================================================

export function logoutUser(): void {

  localStorage.removeItem(
    "access_token"
  );

  localStorage.removeItem(
    "user"
  );
}


// ==========================================================
// CHECK LOGIN STATUS
// ==========================================================

export function isLoggedIn(): boolean {

  const token =
    localStorage.getItem("access_token");

  return Boolean(token);
}


// ==========================================================
// GET STORED USER
// ==========================================================

export function getStoredUser() {

  const user =
    localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {

    return JSON.parse(user);

  } catch {

    return null;
  }
}


// ==========================================================
// GET ACCESS TOKEN
// ==========================================================

export function getAccessToken(): string | null {

  return localStorage.getItem(
    "access_token"
  );
}