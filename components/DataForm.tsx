'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { HEADER_COLOR } from '@/constants';
import { useFormState } from '@/hooks/useFormState';
import { FormSchema } from '@/schemas/formSchema';
import { useCallback, useState } from 'react';
import { ReportDateRange } from './ReportDateRange';

interface DataFormProps {
	onSubmit?: (data: FormSchema) => void;
	className?: string;
	defaultValues?: Partial<FormSchema>;
}

export function DataForm({
	onSubmit,
	className,
	defaultValues,
}: DataFormProps) {
	const { form, isSubmitting, setIsSubmitting } = useFormState({
		defaultValues,
	});

	const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
		from: defaultValues?.fromDate,
		to: defaultValues?.toDate,
	});

	const handleDateChange = useCallback(
		(from: string | null, to: string | null) => {
			const newDateRange = {
				from: from ? new Date(from) : undefined,
				to: to ? new Date(to) : undefined,
			};
			setDateRange(newDateRange);

			// Update form values
			form.setValue('fromDate', newDateRange.from);
			form.setValue('toDate', newDateRange.to);
		},
		[form]
	);

	const handleSubmit = async (data: FormSchema) => {
		// Ensure date values from the date range are included
		const formData = {
			...data,
			fromDate: dateRange.from,
			toDate: dateRange.to,
		};

		setIsSubmitting(true);
		try {
			await onSubmit?.(formData);
			console.log('Form submitted:', formData);
		} catch (error) {
			console.error('Form submission error:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
					<FormField
						control={form.control}
						name='inputValue'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
									Code
								</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter your data here...'
										className='w-full'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div>
						<FormLabel className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
							Date Range (Only 3 Months Applicable)
						</FormLabel>
						<ReportDateRange
							onDateChange={handleDateChange}
							maxDays={90}
							initialDates={{
								from: defaultValues?.fromDate,
								to: defaultValues?.toDate,
							}}
						/>
						{(form.formState.errors.fromDate ||
							form.formState.errors.toDate) && (
							<p className='text-sm text-red-500 mt-1'>
								{form.formState.errors.fromDate?.message ||
									form.formState.errors.toDate?.message}
							</p>
						)}
					</div>

					<FormField
						control={form.control}
						name='type'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
									Type
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className='w-full'>
											<SelectValue placeholder='Select type' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value='SALES'>Sales</SelectItem>
										<SelectItem value='REGISTRATION'>
											Registration
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button
					type='submit'
					className='w-full'
					style={{ backgroundColor: HEADER_COLOR }}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Submitting...' : 'Submit'}
				</Button>
			</form>
		</Form>
	);
}
