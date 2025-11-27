'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format, setMonth, setYear } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface DatePickerProps {
	label: string;
	value?: Date;
	onChange: (date: Date | undefined) => void;
	placeholder?: string;
	id?: string;
	className?: string;
}

export function DatePicker({
	label,
	value,
	onChange,
	placeholder = 'Pick a date',
	id,
	className,
}: DatePickerProps) {
	const [currentMonth, setCurrentMonth] = useState(value || new Date());
	const [isOpen, setIsOpen] = useState(false);

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const years = Array.from(
		{ length: 100 },
		(_, i) => new Date().getFullYear() - 50 + i
	);

	const handleMonthChange = (month: string) => {
		const monthIndex = months.indexOf(month);
		const newDate = setMonth(currentMonth, monthIndex);
		setCurrentMonth(newDate);
	};

	const handleYearChange = (year: string) => {
		const newDate = setYear(currentMonth, parseInt(year));
		setCurrentMonth(newDate);
	};

	return (
		<div className={className}>
			<Label
				htmlFor={id}
				className='block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300'
			>
				{label}
			</Label>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						className={cn(
							'w-full justify-start text-left font-normal',
							!value && 'text-muted-foreground'
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{value ? format(value, 'PPP') : placeholder}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<div className='p-3 space-y-3'>
						{/* Month and Year Selectors */}
						<div className='flex gap-2 items-center'>
							<Select
								value={months[currentMonth.getMonth()]}
								onValueChange={handleMonthChange}
							>
								<SelectTrigger className='flex-1'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{months.map((month) => (
										<SelectItem key={month} value={month}>
											{month}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={currentMonth.getFullYear().toString()}
								onValueChange={handleYearChange}
							>
								<SelectTrigger className='flex-1'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{years.map((year) => (
										<SelectItem key={year} value={year.toString()}>
											{year}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Calendar */}
						<Calendar
							mode='single'
							selected={value}
							onSelect={(date) => {
								onChange(date);
								if (date) {
									setCurrentMonth(date);
								}
								setIsOpen(false);
							}}
							month={currentMonth}
							onMonthChange={setCurrentMonth}
							initialFocus
						/>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
