'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { AffiliationSummary } from '@/types/api';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Pagination } from './Pagination';

interface SummaryTableProps {
	data: AffiliationSummary[];
	dataType: 'SALES' | 'REGISTRATION';
	className?: string;
	pagination: {
		currentPage: number;
		pageSize: number;
		total: number;
		lastPage: number;
	};
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	isLoading?: boolean;
}

export function SummaryTable({
	data,
	className,
	dataType,
	pagination,
	onPageChange,
	onPageSizeChange,
	isLoading = false,
}: SummaryTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const salesSummaryColumns: ColumnDef<AffiliationSummary>[] = useMemo(
		() => [
			{
				accessorKey: 'created_date',
				header: 'Date',
				cell: ({ row }) => (
					<div className='font-medium'>
						{new Date(row.getValue('created_date')).toLocaleDateString(
							'en-US',
							{
								year: 'numeric',
								month: 'short',
								day: 'numeric',
							}
						)}
					</div>
				),
			},
			{
				accessorKey: 'total_sales',
				header: 'Total Sales',
				cell: ({ row }) => (
					<div className='font-bold text-sm'>
						{row.getValue('total_sales')}
					</div>
				),
			},
			{
				accessorKey: 'total_customers',
				header: 'Total Customers',
				cell: ({ row }) => (
					<div className='font-bold text-sm'>
						{row.getValue('total_customers')}
					</div>
				),
			},
			{
				accessorKey: 'purchase_amount',
				header: 'Purchase Amount',
				cell: ({ row }) => {
					const amount = row.getValue('purchase_amount') as
						| string
						| number
						| null
						| undefined;
					if (amount === null || amount === undefined)
						return <div className='text-sm'>N/A</div>;
					const numAmount =
						typeof amount === 'string' ? parseFloat(amount) : amount;
					return (
						<div className='font-medium text-sm'>
							৳{numAmount.toFixed(2)}
						</div>
					);
				},
			},
		
			{
				accessorKey: 'paid_amount',
				header: 'Paid Amount',
				cell: ({ row }) => {
					const amount = row.getValue('paid_amount') as
						| string
						| number
						| null
						| undefined;
					if (amount === null || amount === undefined)
						return <div className='text-sm'>N/A</div>;
					const numAmount =
						typeof amount === 'string' ? parseFloat(amount) : amount;
					return (
						<div className='font-medium text-sm'>
							৳{numAmount.toFixed(2)}
						</div>
					);
				},
			},
			
			{
				accessorKey: 'vat_amount',
				header: 'VAT Amount',
				cell: ({ row }) => {
					const amount = row.getValue('vat_amount') as
						| string
						| number
						| null
						| undefined;
					if (amount === null || amount === undefined)
						return <div className='text-sm'>N/A</div>;
					const numAmount =
						typeof amount === 'string' ? parseFloat(amount) : amount;
					return (
						<div className='font-medium text-sm'>
							৳{numAmount.toFixed(2)}
						</div>
					);
				},
			},
		
			{
				accessorKey: 'business_receivable_amount',
				header: 'Business Receivable',
				cell: ({ row }) => {
					const amount = row.getValue('business_receivable_amount') as
						| string
						| number
						| null
						| undefined;
					if (amount === null || amount === undefined)
						return <div className='text-sm'>N/A</div>;
					const numAmount =
						typeof amount === 'string' ? parseFloat(amount) : amount;
					return (
						<div className='font-medium text-sm'>
							৳{numAmount.toFixed(2)}
						</div>
					);
				},
			},
		],
		[]
	);

	const registrationSummaryColumns: ColumnDef<AffiliationSummary>[] = useMemo(
		() => [
			{
				accessorKey: 'created_date',
				header: 'Date',
				cell: ({ row }) => (
					<div className='font-medium'>
						{new Date(row.getValue('created_date')).toLocaleDateString(
							'en-US',
							{
								year: 'numeric',
								month: 'short',
								day: 'numeric',
							}
						)}
					</div>
				),
			},
			{
				accessorKey: 'total_users',
				header: 'Total Users',
				cell: ({ row }) => (
					<div className='font-bold text-sm'>
						{row.getValue('total_users')}
					</div>
				),
			},
		],
		[]
	);

	const columns =
		dataType === 'SALES' ? salesSummaryColumns : registrationSummaryColumns;

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
	});

	return (
		<div className={className}>
			<div className='rounded-lg border shadow-sm overflow-hidden'>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow
									key={headerGroup.id}
									className='bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700'
								>
									{headerGroup.headers.map((header) => (
										<TableHead
											key={header.id}
											className='px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider'
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
										className='hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0'
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className='px-4 py-4 text-center text-sm text-gray-900 dark:text-gray-100'
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-32 text-center text-gray-500 dark:text-gray-400'
									>
										No summary data available.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Pagination Controls */}
			<Pagination
				currentPage={pagination.currentPage}
				pageSize={pagination.pageSize}
				total={pagination.total}
				lastPage={pagination.lastPage}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
				isLoading={isLoading}
			/>
		</div>
	);
}
