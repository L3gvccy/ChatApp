export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/api/auth";
export const REGISTER_ROUTE = `${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;

export const PROFILE_ROUTES = "/api/profile";
export const UPDATE_PROFILE_ROUTE = `${PROFILE_ROUTES}/update-profile`;
