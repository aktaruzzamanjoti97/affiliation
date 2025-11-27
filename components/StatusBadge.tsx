import { cn } from '@/lib/utils';

interface StatusBadgeProps {
	status: string;
	className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
	const getStatusStyles = (status: string) => {
		switch (status) {
			case 'Active':
				return 'bg-green-100 text-green-800';
			case 'Inactive':
				return 'bg-red-100 text-red-800';
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div
			className={cn(
				'text-xs font-medium px-2 py-1 rounded-full inline-block',
				getStatusStyles(status),
				className
			)}
		>
			{status}
		</div>
	);
}