import { jwtDecode, JwtPayload } from 'jwt-decode';
import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

interface Token {
	accessToken?: string;
	refreshToken?: string;
	userId?: string;
	accessTokenExpires?: number;
	error?: string;
}

// Extend the built-in session types
declare module 'next-auth' {
	interface Session {
		accessToken?: string;
		refreshToken?: string;
		user: {
			id: string;
			email?: string;
			name?: string;
		} & DefaultSession['user'];
	}

	interface User {
		access_token: string;
		refresh_token: string;
		user_id: string;
		email?: string;
		name?: string;
	}
}

// async function refreshAccessToken(token: Token) {
// 	console.log('Refreshing access token', token);
// 	try {
// 		console.log('Beaarer token', `Bearer ${token.refreshToken}`);

// 		const response = await fetch(
// 			`${process.env.API_BASE_URL}/auth/refresh`,
// 			{
// 				headers: {
// 					Authorization: `Bearer ${token.refreshToken}`,
// 				},
// 			}
// 		);

// 		console.log(response);

// 		const tokens = await response.json();

// 		console.log(tokens);

// 		if (!response.ok) {
// 			throw tokens;
// 		}

// 		/*const refreshedTokens = {
//         "access_token": "acess-token",
//         "expires_in": 2,
//         "refresh_token": "refresh-token"
//       }*/

// 		//return token;

// 		return {
// 			...token,
// 			accessToken: tokens.access_token || tokens.accessToken,
// 			refreshToken: (tokens.refresh_token || tokens.refreshToken) ?? token.refreshToken, // Fall back to old refresh token
// 		};
// 	} catch (error) {
// 		console.log(error);

// 		return {
// 			...token,
// 			error: 'RefreshAccessTokenError',
// 		};
// 	}
// }

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials) => {
				if (!credentials) return null;

				try {
					const res = await fetch(
						`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/`,
						{
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								email: credentials.email,
								password: credentials.password,
							}),
						}
					);
					const data = await res.json();

					if (!res.ok) return null;

					console.log('API Response from auth:', data);

					const responseData = data.data || data;

					return {
						access_token:
							responseData.access_token || responseData.accessToken,
						refresh_token:
							responseData.refresh_token || responseData.refreshToken,
						user_id:
							responseData.user_id ||
							responseData.userId ||
							responseData.id,
						email: responseData.email || credentials.email,
					};
				} catch (error) {
					console.error(error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (token.accessToken && typeof token.accessToken === 'string') {
				const decodedToken = jwtDecode<JwtPayload>(token.accessToken);
				console.log(decodedToken);
				token.accessTokenExpires = decodedToken.exp
					? decodedToken.exp * 1000
					: undefined;
			}
			if (user) {
				token.accessToken = user.access_token;
				token.refreshToken = user.refresh_token;
				token.userId = user.user_id;
			}
			// Return previous token if the access token has not expired yet
			const expiresAt = token.accessTokenExpires as number;
			console.log(
				'**** Access token expires on *****',
				expiresAt,
				new Date(expiresAt)
			);
			if (Date.now() < expiresAt) {
				console.log('**** returning previous token ******');
				return token;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.accessToken = token.accessToken as string;
				session.refreshToken = token.refreshToken as string;
				session.user.id = token.userId as string;
			}
			return session;
		},
	},
});
