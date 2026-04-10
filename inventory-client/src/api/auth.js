import api from "./axios";

// LOGIN
export const loginApi = (credentials) =>
  api.post("/auth/login", credentials).then((r) => r.data);

// LOGOUT
export const logoutApi = () =>
  api.post("/auth/logout").then((r) => r.data);

// GET LOGGED IN USER
export const getMeApi = () =>
  api.get("/auth/me").then((r) => r.data);