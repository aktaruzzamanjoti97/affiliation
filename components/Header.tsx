'use client';

import { doSignOut } from '@/app/actions';
import { HEADER_COLOR, LOGO_HEIGHT, LOGO_WIDTH } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
	const router = useRouter();

	const handleSignOut = () => {
		doSignOut();
		router.push('/auth/login');
	};

	return (
		<header
			className={`w-full shadow-lg`}
			style={{ backgroundColor: HEADER_COLOR }}
		>
			<div className='container mx-auto px-6 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<Link href='/' className='cursor-pointer'>
							<Image
								src='/gkLogo.png'
								alt='GK Logo'
								width={LOGO_WIDTH}
								height={LOGO_HEIGHT}
								priority
								className='h-auto w-45 hover:opacity-80 transition-opacity'
							/>
						</Link>
					</div>
					<button
						className='group relative px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300 active:scale-95'
						onClick={handleSignOut}
					>
						<span className='flex items-center space-x-2'>
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
								/>
							</svg>
							<span>Sign Out</span>
						</span>
					</button>
				</div>
			</div>
		</header>
	);
}
