'use client';

import { Pagination } from '@/components/Pagination';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { AffiliationUser } from '@/types/api';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

interface DataTableComponentProps {
	data: AffiliationUser[];
	className?: string;
	onView?: (user: AffiliationUser) => void;
	dataType: 'SALES' | 'REGISTRATION';
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

export function DataTable({
	data,
	className,
	dataType,
	pagination,
	onPageChange,
	onPageSizeChange,
	isLoading = false,
}: DataTableComponentProps) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const salesColumns: ColumnDef<AffiliationUser>[] = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'Sales Order ID',
				cell: ({ row }) => (
					<div className='font-mono text-xs'>{row.getValue('id')}</div>
				),
			},

			{
				accessorKey: 'customer_name',
				header: 'Name',
				cell: ({ row }) => (
					<div className='font-medium'>
						{row.getValue('customer_name')}
					</div>
				),
			},
			{
				accessorKey: 'customer_phone',
				header: 'MSISDN',
				cell: ({ row }) => (
					<div className='text-sm'>{row.getValue('customer_phone')}</div>
				),
			},
			{
				accessorKey: 'customer_nid_no',
				header: 'NID',
				cell: ({ row }) => (
					<div className='text-sm'>
						{row.getValue('customer_nid_no') || 'N/A'}
					</div>
				),
			},
			{
				accessorKey: 'customer_joining_date',
				header: 'Joining Date',
				cell: ({ row }) => {
					const date = new Date(row.getValue('customer_joining_date'));
					return (
						<div className='text-sm'>
							{date.toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
							})}
						</div>
					);
				},
			},
			{
				accessorKey: 'partner_reference_id',
				header: 'Partner Reference Id',
				cell: ({ row }) => (
					<div className='text-sm'>
						{row.getValue('partner_reference_id') || 'N/A'}
					</div>
				),
			},
			{
				accessorKey: 'source_affiliation_code',
				header: 'Source Affiliation Code',
				cell: ({ row }) => (
					<div className='text-sm'>
						{(row.getValue('source_affiliation_code'))}
					</div>
				),
			},

			{
				accessorKey: 'purchase_amount',
				header: 'Principal Amount',
				cell: ({ row }) => (
					<div className='text-sm font-medium'>
						৳{parseFloat(row.getValue('purchase_amount')).toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'purchase_quantity',
				header: 'Sale Gold (Gm)',
				cell: ({ row }) => (
					<div className='text-sm'>
						{row.getValue('purchase_quantity')}
					</div>
				),
			},

			{
				accessorKey: 'vat_amount',
				header: 'VAT Amount (On Gold)',
				cell: ({ row }) => (
					<div className='text-sm'>
						৳{parseFloat(row.getValue('vat_amount')).toFixed(2)}
					</div>
				),
			},

			{
				accessorKey: 'amount_before_settlement',
				header: 'Payment Before Settlement Fee',
				cell: ({ row }) => (
					<div className='text-sm'>
						৳
						{parseFloat(row.getValue('amount_before_settlement')).toFixed(
							2
						)}
					</div>
				),
			},
		],
		[]
	);

	const registrationColumns: ColumnDef<AffiliationUser>[] = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'User ID',
				cell: ({ row }) => (
					<div className='font-mono text-xs'>{row.getValue('id')}</div>
				),
			},
			{
				accessorKey: 'name',
				header: 'Name',
				cell: ({ row }) => (
					<div className='font-medium'>{row.getValue('name')}</div>
				),
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				cell: ({ row }) => (
					<div className='text-sm'>{row.getValue('phone')}</div>
				),
			},
			{
				accessorKey: 'affiliation_partner_reference_id',
				header: 'Partner Reference ID',
				cell: ({ row }) => (
					<div className='font-mono text-sm'>
						{row.getValue('affiliation_partner_reference_id')}
					</div>
				),
			},
			{
				accessorKey: 'source_affiliation_code',
				header: 'Source Affiliation Code',
				cell: ({ row }) => (
					<div className='font-mono text-sm'>
						{row.getValue('source_affiliation_code')}
					</div>
				),
			},
		],
		[]
	);

	const columns = dataType === 'SALES' ? salesColumns : registrationColumns;

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
										No results.
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
