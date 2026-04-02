export const userEndpoints = {
  register: "/users/register",
  login: "/users/login",
  me: "/users/me",
  UPDATE_USER: (id: string) => `/users/${id}`,
  forgotPassword: "/users/forgot-password",
};