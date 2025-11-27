import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
	session: {
		strategy: 'jwt',
		maxAge: 24 * 60 * 60, // 1 Day
	},
	providers: [],
};
