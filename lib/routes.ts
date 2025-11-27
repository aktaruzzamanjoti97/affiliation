export const LOGIN = '/auth/login/';
export const ROOT = '/';

// Routes that should be accessible without authentication
export const PUBLIC_ROUTES = ['/auth/login/'];

// Sub-routes within public routes that should be protected
export const PROTECTED_SUB_ROUTES = ['/'];
