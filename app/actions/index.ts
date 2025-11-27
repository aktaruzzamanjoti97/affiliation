'use server';

import { signIn, signOut } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function doSignOut() {
	await signOut({ redirectTo: '/auth/login' });
}

export async function login(email: string, password: string) {
	try {
		const response = await signIn('credentials', {
			email,
			password,
			redirect: false,
		});
		revalidatePath('/');
		return response;
	} catch (err) {
		throw err;
	}
}
