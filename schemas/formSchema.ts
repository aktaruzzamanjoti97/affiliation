import { z } from 'zod';

export const formSchema = z
	.object({
		inputValue: z
			.string()
			.min(1, 'Input value is required')
			.max(100, 'Input value cannot exceed 100 characters'),
		fromDate: z
			.date()
			.optional()
			.refine((date) => !date || date <= new Date(), {
				message: 'From date cannot be in the future',
			}),
		toDate: z
			.date()
			.optional()
			.refine((date) => !date || date <= new Date(), {
				message: 'To date cannot be in the future',
			}),
		summary: z.boolean(),
		type: z
			.enum(['SALES', 'REGISTRATION'])
			.refine((val) => val !== undefined, {
				message: 'Please select a type',
			}),
	})
	.refine(
		(data) => {
			if (data.fromDate && data.toDate) {
				return data.fromDate <= data.toDate;
			}
			return true;
		},
		{
			message: 'From date cannot be after to date',
			path: ['fromDate'],
		}
	)
	.refine(
		(data) => {
			if (data.fromDate && data.toDate) {
				const monthsDiff =
					(data.toDate.getFullYear() - data.fromDate.getFullYear()) * 12 +
					(data.toDate.getMonth() - data.fromDate.getMonth());
				return monthsDiff <= 3;
			}
			return true;
		},
		{
			message: 'Date range cannot exceed 3 months',
			path: ['toDate'],
		}
	);

export type FormSchema = z.infer<typeof formSchema>;
