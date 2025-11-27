import 'next-auth';

declare module 'next-auth' {
	interface Session {
		accessToken?: string;
		refreshToken?: string;
	}

	interface User {
		access_token: string;
		refresh_token: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string;
		refreshToken?: string;
	}
}
