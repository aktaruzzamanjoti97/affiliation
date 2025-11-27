import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { CalendarIcon } from 'lucide-react';
import { parseAsString, useQueryStates } from 'nuqs';
import * as React from 'react';
import { type DateRange } from 'react-day-picker';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

import { Button, type ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { APP_TIMEZONE } from '@/utils';

interface DateRangePickerProps
	extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
	defaultDateRange?: DateRange;
	placeholder?: string;
	triggerVariant?: Exclude<ButtonProps['variant'], 'destructive' | 'link'>;
	triggerSize?: Exclude<ButtonProps['size'], 'icon'>;
	triggerClassName?: string;
	shallow?: boolean;
	persistQuery?: boolean;
	onApply?: (from: Date | undefined, to: Date | undefined) => void;
	onReset?: () => void;
	dateResetAllowed?: boolean;
	side?: 'left' | 'right' | 'top' | 'bottom';
	pastAllowed?: boolean;
	futureAllowed?: boolean;
	todayAllowed?: boolean;
	maxDays?: number; // New prop to set a maximum day range
}

export const DateRangePicker = React.forwardRef<
	{ reset: () => void },
	DateRangePickerProps
>(
	(
		{
			defaultDateRange,
			placeholder = 'Pick a date',
			triggerVariant = 'outline',
			triggerSize = 'default',
			triggerClassName,
			shallow = true,
			persistQuery = false,
			className,
			onApply,
			onReset,
			dateResetAllowed = true,
			side = 'left',
			pastAllowed = true,
			futureAllowed = true,
			todayAllowed = true,
			maxDays, // Destructure the new prop
			...props
		},
		ref
	) => {
		const [dateParams, setDateParams] = useQueryStates(
			{
				from: parseAsString.withDefault(
					defaultDateRange?.from?.toISOString() ?? ''
				),
				to: parseAsString.withDefault(
					defaultDateRange?.to?.toISOString() ?? ''
				),
			},
			{
				clearOnDefault: true,
				shallow,
			}
		);

		const [tempSelectedDate, setTempSelectedDate] = React.useState<
			DateRange | undefined
		>({
			from: dateParams.from
				? new Date(dateParams.from)
				: defaultDateRange?.from,
			to: dateParams.to ? new Date(dateParams.to) : defaultDateRange?.to,
		});

		const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

		const [appliedDate, setAppliedDate] = React.useState<
			DateRange | undefined
		>(tempSelectedDate);

		// Calculate disabled dates based on props
		const getDisabledDates = React.useMemo(() => {
			const today = dayjs().tz(APP_TIMEZONE).startOf('day');

			return (date: Date) => {
				const dateInTimezone = dayjs(date).tz(APP_TIMEZONE).startOf('day');

				// Check if it's today
				const isToday = dateInTimezone.isSame(today, 'day');
				if (isToday && !todayAllowed) {
					return true;
				}

				// Check if it's in the past
				const isPast = dateInTimezone.isBefore(today, 'day');
				if (isPast && !pastAllowed) {
					return true;
				}

				// Check if it's in the future
				const isFuture = dateInTimezone.isAfter(today, 'day');
				if (isFuture && !futureAllowed) {
					return true;
				}

				// If maxDays is set, disable dates outside the allowed range from the start date
				if (maxDays && tempSelectedDate?.from && !tempSelectedDate.to) {
					const fromDate = dayjs(tempSelectedDate.from)
						.tz(APP_TIMEZONE)
						.startOf('day');
					const diff = dateInTimezone.diff(fromDate, 'day');

					return diff >= maxDays || diff < 0;
				}

				return false;
			};
		}, [pastAllowed, futureAllowed, todayAllowed, tempSelectedDate, maxDays]);

		const handleApply = () => {
			const from = tempSelectedDate?.from
				? dayjs(tempSelectedDate.from)
						.tz(APP_TIMEZONE)
						.startOf('day')
						.toDate()
				: undefined;

			const to = tempSelectedDate?.to
				? dayjs(tempSelectedDate.to).tz(APP_TIMEZONE).endOf('day').toDate()
				: from
				? dayjs(from).tz(APP_TIMEZONE).endOf('day').toDate()
				: undefined;

			setAppliedDate({ from, to });

			if (persistQuery) {
				void setDateParams({
					from: from
						? dayjs(from).tz(APP_TIMEZONE).format('YYYY-MM-DDTHH:mm:ssZ')
						: '',
					to: to
						? dayjs(to).tz(APP_TIMEZONE).format('YYYY-MM-DDTHH:mm:ssZ')
						: '',
				});
			}

			if (onApply) {
				onApply(from, to);
			}

			setIsPopoverOpen(false);
		};

		const handleReset = () => {
			setTempSelectedDate(undefined);
			setAppliedDate(undefined);

			if (persistQuery) {
				void setDateParams({
					from: '',
					to: '',
				});
			}

			if (onReset) {
				onReset();
			}
		};

		// Expose reset method via ref
		React.useImperativeHandle(ref, () => ({
			reset: handleReset,
		}));

		// New handler to enforce maxDays when a date range is selected
		const handleDateSelect = (range: DateRange | undefined) => {
			if (maxDays && range?.from && range.to) {
				const fromDate = dayjs(range.from).tz(APP_TIMEZONE).startOf('day');
				const toDate = dayjs(range.to).tz(APP_TIMEZONE).startOf('day');

				// If the selected range is greater than or equal to maxDays, adjust it
				if (toDate.diff(fromDate, 'day') >= maxDays) {
					const newTo = fromDate.add(maxDays - 1, 'day').toDate();
					setTempSelectedDate({ from: range.from, to: newTo });

					return;
				}
			}
			setTempSelectedDate(range);
		};

		return (
			<div className='grid gap-2'>
				<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
					<PopoverTrigger asChild>
						<Button
							variant={triggerVariant}
							size={triggerSize}
							className={cn(
								'w-full justify-start gap-2 truncate text-left font-normal',
								!appliedDate?.from && 'text-muted-foreground',
								triggerClassName
							)}
						>
							<CalendarIcon className='size-4' />
							{appliedDate?.from ? (
								appliedDate.to ? (
									<>
										{dayjs
											.utc(appliedDate.from)
											.tz(APP_TIMEZONE)
											.format('MMM D, YYYY')}{' '}
										-{' '}
										{dayjs
											.utc(appliedDate.to)
											.tz(APP_TIMEZONE)
											.format('MMM D, YYYY')}
									</>
								) : (
									dayjs
										.utc(appliedDate.from)
										.tz(APP_TIMEZONE)
										.format('MMM D, YYYY')
								)
							) : (
								<span>{placeholder}</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className={cn('w-auto p-0', className)}
						{...props}
						side={side}
					>
						<Calendar
							initialFocus
							mode='range'
							defaultMonth={appliedDate?.from}
							selected={tempSelectedDate}
							onSelect={handleDateSelect} // Use the new handler
							numberOfMonths={2}
							disabled={getDisabledDates}
						/>
						<div className='flex justify-end space-x-2 p-2'>
							{dateResetAllowed ? (
								<Button
									variant='outline'
									size='sm'
									onClick={handleReset}
								>
									Reset
								</Button>
							) : (
								<></>
							)}
							<Button variant='default' size='sm' onClick={handleApply}>
								Apply
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		);
	}
);

DateRangePicker.displayName = 'DateRangePicker';
