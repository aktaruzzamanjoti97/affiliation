import { auth } from '@/auth';
import { AffiliationPageContent } from '@/components/AffiliationPageContent';
import { Header } from '@/components/Header';
import AuthPage from './auth/login/page';

export default async function Home() {
	const session = await auth();
	console.log('Session:', session)
	return (
		<>
			{session ? (
				<div className='min-h-screen bg-zinc-50 font-sans dark:bg-black flex flex-col'>
					<Header />

					<main className='flex-1 w-full px-6 bg-zinc-50 dark:bg-black py-8'>
						<AffiliationPageContent />
					</main>
				</div>
			) : (
				<AuthPage />
			)}
		</>
	);
}
