'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { login } from '../actions';

const loginFormSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Please enter a valid email address'),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(6, 'Password must be at least 6 characters')
		.max(128, 'Password must be less than 128 characters'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
	className?: string;
}

export function AuthClientPage({ className }: LoginFormProps) {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
	}>({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | undefined>();

	const validateField = (
		field: keyof LoginFormData,
		value: string
	): string | undefined => {
		try {
			const fieldSchema = loginFormSchema.shape[field];
			fieldSchema.parse(value);
			return undefined;
		} catch (err) {
			if (err instanceof z.ZodError) {
				return err.issues[0]?.message;
			}
			return 'Validation error';
		}
	};

	const validateForm = (): boolean => {
		try {
			loginFormSchema.parse(formData);
			setErrors({});
			return true;
		} catch (err) {
			if (err instanceof z.ZodError) {
				const newErrors: typeof errors = {};
				err.issues.forEach((issue) => {
					if (issue.path.length > 0) {
						const field = issue.path[0] as keyof LoginFormData;
						newErrors[field] = issue.message;
					}
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		setError(undefined);

		try {
			const result = await login(formData.email, formData.password);
			if (!!result.error) {
				console.error(result.error);
				setError(result.error.message);
			} else {
				router.push('/');
			}
		} catch (e) {
			console.error(e);
			setError('Check your Credentials');
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (field: keyof LoginFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		if (value.trim() === '') {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		} else {
			const fieldError = validateField(field, value);
			setErrors((prev) => ({ ...prev, [field]: fieldError }));
		}
	};

	return (
		<div
			className={cn(
				'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8',
				className
			)}
		>
			<div className='max-w-md w-full space-y-8'>
				{/* Logo/Brand Section */}
				<div className='text-center mb-8'>
					<div className='mx-auto w-32 h-20 relative flex items-center justify-center'>
						<Image
							src='/gkLogo.png'
							alt='GK Logo'
							fill
							className='object-contain drop-shadow-lg'
							priority
						/>
					</div>
					<h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
						Welcome Back
					</h2>
					<p className='text-sm text-gray-600 dark:text-gray-400'>
						Sign in to your Gold Kinen Affiliation account
					</p>
				</div>

				{/* Login Form */}
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Email Input */}
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
						>
							Email Address
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<svg
									className='w-5 h-5 text-gray-400'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
									/>
								</svg>
							</div>
							<input
								id='email'
								type='email'
								value={formData.email}
								onChange={(e) =>
									handleInputChange('email', e.target.value)
								}
								className={cn(
									'w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg',
									'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
									'placeholder-gray-500 dark:placeholder-gray-400',
									'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
									'transition-all duration-200',
									errors.email && 'border-red-500 focus:ring-red-500'
								)}
								placeholder='Enter your email address'
								disabled={isLoading}
							/>
						</div>
						{errors.email && (
							<p className='mt-2 text-sm text-red-600 dark:text-red-400 flex items-center'>
								<svg
									className='w-4 h-4 mr-1 shrink-0'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
								{errors.email}
							</p>
						)}
					</div>

					{/* Password Input */}
					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
						>
							Password
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<svg
									className='w-5 h-5 text-gray-400'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
									/>
								</svg>
							</div>
							<input
								id='password'
								type='password'
								value={formData.password}
								onChange={(e) =>
									handleInputChange('password', e.target.value)
								}
								className={cn(
									'w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg',
									'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
									'placeholder-gray-500 dark:placeholder-gray-400',
									'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
									'transition-all duration-200',
									errors.password &&
										'border-red-500 focus:ring-red-500'
								)}
								placeholder='Min 6 characters'
								disabled={isLoading}
							/>
							{formData.password && (
								<button
									type='button'
									onClick={() => {
										const input = document.getElementById(
											'password'
										) as HTMLInputElement;
										if (input.type === 'password') {
											input.type = 'text';
										} else {
											input.type = 'password';
										}
									}}
									className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
								>
									<svg
										className='w-5 h-5'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
										/>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
										/>
									</svg>
								</button>
							)}
						</div>
						{errors.password && (
							<p className='mt-2 text-sm text-red-600 dark:text-red-400 flex items-center'>
								<svg
									className='w-4 h-4 mr-1 shrink-0'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
								{errors.password}
							</p>
						)}
					</div>

					{/* Error Message */}
					{error && (
						<div className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
							<p className='text-sm text-red-600 dark:text-red-400 flex items-center'>
								<svg
									className='w-4 h-4 mr-2 shrink-0'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
								{error}
							</p>
						</div>
					)}

					{/* Submit Button */}
					<Button
						type='submit'
						disabled={isLoading}
						className='w-full py-3 px-4 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
					>
						{isLoading ? (
							<div className='flex items-center justify-center'>
								<svg
									className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
									/>
								</svg>
								Signing in...
							</div>
						) : (
							'Sign In'
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}
