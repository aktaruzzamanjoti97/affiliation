'use client';

import { DataForm } from '@/components/DataForm';
import { DataTable } from '@/components/DataTable';
import { SummaryTable } from '@/components/SummaryTable';
import { useAffiliationSummary } from '@/hooks/useAffiliationSummary';
import { useAffiliationUsers } from '@/hooks/useAffiliationUsers';
import { FormSchema } from '@/schemas/formSchema';
import * as Tabs from '@radix-ui/react-tabs';
import {
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	useQueryStates,
} from 'nuqs';
import { useCallback } from 'react';

// Helper function to for error
const getErrorMessage = (
	error: unknown
): { message: string; statusCode?: number } => {
	if (error && typeof error === 'object') {
		if ('response' in error) {
			const axiosError = error as {
				response?: {
					status?: number;
					statusText?: string;
					data?: {
						message?: string;
						code?: number;
					};
				};
			};
			const status = axiosError.response?.status;
			const data = axiosError.response?.data;

			if (data?.message && data?.code) {
				return {
					message: data.message,
					statusCode: data.code,
				};
			}

			if (status) {
				switch (status) {
					case 400:
						return {
							message: 'Bad request: Please check your input parameters',
							statusCode: status,
						};
					case 401:
						return {
							message: 'Unauthorized: Authentication required',
							statusCode: status,
						};
					case 403:
						return {
							message:
								'Forbidden: You do not have permission to access this resource',
							statusCode: status,
						};
					case 404:
						return {
							message: 'Not found: The requested resource was not found',
							statusCode: status,
						};
					case 422:
						return {
							message: 'Validation error: The provided data is invalid',
							statusCode: status,
						};
					case 500:
						return {
							message: 'Internal server error: Please try again later',
							statusCode: status,
						};
					case 502:
						return {
							message: 'Bad gateway: Server is temporarily unavailable',
							statusCode: status,
						};
					case 503:
						return {
							message:
								'Service unavailable: Server is overloaded or down for maintenance',
							statusCode: status,
						};
					default:
						return {
							message: `HTTP Error ${status}: ${
								axiosError.response?.statusText || 'Unknown error'
							}`,
							statusCode: status,
						};
				}
			}
		}

		if ('message' in error) {
			return {
				message: (error as Error).message,
			};
		}
	}

	return {
		message: 'An unexpected error occurred',
	};
};

export function AffiliationPageContent() {
	const [queryState, setQueryState] = useQueryStates({
		code: parseAsString.withDefault(''),
		start_date: parseAsString.withDefault(''),
		end_date: parseAsString.withDefault(''),
		data_type: parseAsString.withDefault(''),
		summary: parseAsBoolean.withDefault(false),
		page: parseAsInteger.withDefault(1),
		page_size: parseAsInteger.withDefault(10),
	});

	const { code, start_date, end_date, data_type, summary, page, page_size } =
		queryState;

	const hasSubmitted = !!(code || start_date || end_date || data_type);
	const currentPage = page;
	const pageSize = page_size;

	const getFormDefaultValues = () => {
		return {
			inputValue: code,
			fromDate: start_date ? new Date(start_date) : undefined,
			toDate: end_date ? new Date(end_date) : undefined,
			summary,
			type: (data_type as 'SALES' | 'REGISTRATION') || 'SALES',
		};
	};

	const updateURL = useCallback(
		(params: Partial<typeof queryState>) => {
			setQueryState(params);
		},
		[setQueryState]
	);

	const apiParams =
		hasSubmitted && !summary
			? {
					code: code || '',
					start_date: start_date || '',
					end_date: end_date || '',
					data_type: data_type || '',
					page: currentPage,
					page_size: pageSize,
					order_by_fields: 'created_at',
					ordering: 'desc' as const,
			  }
			: {
					code: '',
					start_date: '',
					end_date: '',
					data_type: '',
					page: 1,
					page_size: 10,
					order_by_fields: 'created_at',
					ordering: 'desc' as const,
			  };

	const { data, isLoading, error } = useAffiliationUsers(apiParams);

	const {
		data: summaryData,
		isLoading: summaryLoading,
		error: summaryError,
	} = useAffiliationSummary(
		hasSubmitted && summary
			? {
					code: code || '',
					start_date: start_date || '',
					end_date: end_date || '',
					data_type: data_type || '',
					page: currentPage,
					page_size: pageSize,
			  }
			: {
					code: '',
					start_date: '',
					end_date: '',
					data_type: '',
					page: currentPage,
					page_size: pageSize,
			  }
	);

	const handleFormSubmit = async (form: FormSchema) => {
		const formatDateToLocal = (date: Date): string => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		};

		const urlParams = {
			code: form.inputValue,
			start_date: form.fromDate ? formatDateToLocal(form.fromDate) : '',
			end_date: form.toDate ? formatDateToLocal(form.toDate) : '',
			data_type: form.type,
			summary: form.summary,
			page: 1,
		};

		updateURL(urlParams);
	};

	const handlePageChange = (newPage: number) => {
		updateURL({
			page: newPage,
		});
	};

	const handlePageSizeChange = (newPageSize: number) => {
		updateURL({
			page: 1,
			page_size: newPageSize,
		});
	};

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Form Section */}
			<DataForm
				onSubmit={handleFormSubmit}
				className='w-full mx-auto bg-white rounded-lg shadow-lg p-8 dark:bg-gray-800'
				defaultValues={getFormDefaultValues()}
			/>

			{/* Table Section */}
			{hasSubmitted && (
				<div className='bg-white rounded-lg shadow-lg dark:bg-gray-800'>
					<Tabs.Root
						value={summary ? 'summary' : 'without-summary'}
						onValueChange={(value) => {
							const newShowSummary = value === 'summary';
							updateURL({
								summary: newShowSummary,
							});
						}}
						className='w-full'
					>
						<Tabs.List className='flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg'>
							<Tabs.Trigger
								value='without-summary'
								className='flex-1 flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800'
							>
								<svg
									className='w-4 h-4 mr-2'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
									/>
								</svg>
								Without Summary
							</Tabs.Trigger>
							<Tabs.Trigger
								value='summary'
								className='flex-1 flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800'
							>
								<svg
									className='w-4 h-4 mr-2'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m14-6V6a2 2 0 00-2-2H7a2 2 0 00-2 2v6'
									/>
								</svg>
								Summary
							</Tabs.Trigger>
						</Tabs.List>

						{/* Error Messages */}
						{(error || summaryError) && (
							<div className='p-4 border-b border-gray-200 dark:border-gray-700'>
								{error && (
									<div className='mb-2 p-3 bg-red-50 border border-red-200 rounded-md'>
										<p className='text-red-600 font-semibold text-sm'>
											{getErrorMessage(error).statusCode && (
												<span>
													Error {getErrorMessage(error).statusCode}
													:{' '}
												</span>
											)}
											{getErrorMessage(error).message}
										</p>
									</div>
								)}
								{summaryError && (
									<div className='p-3 bg-red-50 border border-red-200 rounded-md'>
										<p className='text-red-600 font-semibold text-sm'>
											<span>Summary Error: </span>
											{getErrorMessage(summaryError).statusCode && (
												<span>
													Status{' '}
													{
														getErrorMessage(summaryError)
															.statusCode
													}
													:{' '}
												</span>
											)}
											{getErrorMessage(summaryError).message}
										</p>
									</div>
								)}
							</div>
						)}

						<Tabs.Content
							value='without-summary'
							className='p-6 focus:outline-none'
						>
							<div className='mb-4'>
								<h3 className='text-xl font-bold text-gray-900 dark:text-white flex items-center'>
									<svg
										className='w-5 h-5 mr-2 text-blue-500'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
										/>
									</svg>
									Detailed Affiliation Reports
								</h3>
								<p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
									Complete list of all individual affiliation records
									with full details
								</p>
							</div>

							{data?.data ? (
								<DataTable
									data={data.data}
									dataType={data_type as 'SALES' | 'REGISTRATION'}
									pagination={{
										currentPage: data.meta_info?.current_page || 1,
										pageSize: pageSize,
										total: data.meta_info?.total || 0,
										lastPage: data.meta_info?.last_page || 1,
									}}
									onPageChange={handlePageChange}
									onPageSizeChange={handlePageSizeChange}
									isLoading={isLoading}
								/>
							) : (
								<div className='flex flex-col justify-center items-center h-32 text-center'>
									<svg
										className='w-12 h-12 text-gray-300 dark:text-gray-600 mb-3'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
										/>
									</svg>
									<p className='text-gray-500 dark:text-gray-400'>
										{isLoading
											? 'Loading detailed reports...'
											: 'No affiliation reports found for the given criteria'}
									</p>
								</div>
							)}
						</Tabs.Content>

						<Tabs.Content
							value='summary'
							className='p-6 focus:outline-none'
						>
							<div className='mb-4'>
								<h3 className='text-xl font-bold text-gray-900 dark:text-white flex items-center'>
									<svg
										className='w-5 h-5 mr-2 text-blue-500'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m14-6V6a2 2 0 00-2-2H7a2 2 0 00-2 2v6'
										/>
									</svg>
									Affiliation Summary Report
								</h3>
								<p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
									Aggregated summary statistics and insights from
									affiliation data
								</p>
							</div>

							{summaryData?.data ? (
								<SummaryTable
									data={summaryData.data}
									dataType={data_type as 'SALES' | 'REGISTRATION'}
									pagination={{
										currentPage:
											summaryData.meta_info?.current_page || 1,
										pageSize: pageSize,
										total: summaryData.meta_info?.total || 0,
										lastPage: summaryData.meta_info?.last_page || 1,
									}}
									onPageChange={handlePageChange}
									onPageSizeChange={handlePageSizeChange}
									isLoading={summaryLoading}
									className='bg-white rounded-lg p-6 dark:bg-gray-800'
								/>
							) : (
								<div className='flex flex-col justify-center items-center h-32 text-center'>
									<svg
										className='w-12 h-12 text-gray-300 dark:text-gray-600 mb-3'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
										/>
									</svg>
									<p className='text-gray-500 dark:text-gray-400'>
										{summaryLoading
											? 'Loading summary data...'
											: 'No summary data found for the given criteria'}
									</p>
								</div>
							)}
						</Tabs.Content>
					</Tabs.Root>
				</div>
			)}
		</div>
	);
}
