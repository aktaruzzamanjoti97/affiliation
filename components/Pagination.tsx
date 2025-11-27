import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface PaginationProps {
	currentPage: number;
	pageSize: number;
	total: number;
	lastPage: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	isLoading?: boolean;
	className?: string;
}

export function Pagination({
	currentPage,
	pageSize,
	total,
	lastPage,
	onPageChange,
	onPageSizeChange,
	isLoading = false,
	className = '',
}: PaginationProps) {
	return (
		<div className={`flex items-center justify-between space-x-2 py-6 px-2 ${className}`}>
			<div className='flex items-center space-x-3'>
				<span className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
					Rows per page
				</span>
				<Select
					value={`${pageSize}`}
					onValueChange={(value) => {
						onPageSizeChange(Number(value));
					}}
				>
					<SelectTrigger className='h-9 w-[70px] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500'>
						<SelectValue placeholder={pageSize} />
					</SelectTrigger>
					<SelectContent side='top'>
						{[10, 20, 30, 50, 100].map((size) => (
							<SelectItem key={size} value={`${size}`}>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<span className='text-sm text-gray-500 dark:text-gray-400'>
					{total} total items
				</span>
			</div>
			<div className='flex items-center space-x-3'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage <= 1 || isLoading}
					className='h-9 px-4 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
				>
					Previous
				</Button>
				<div className='flex items-center space-x-1'>
					<span className='text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md'>
						Page {currentPage} of {lastPage}
					</span>
				</div>
				<Button
					variant='outline'
					size='sm'
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= lastPage || isLoading}
					className='h-9 px-4 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
				>
					Next
				</Button>
			</div>
		</div>
	);
}