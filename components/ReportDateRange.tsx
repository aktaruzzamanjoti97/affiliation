import { formatRequestDateWithTimezone } from '@/utils';
import React from 'react';
import { DateRangePicker } from './DateRangePicker';

interface ReportDateRangeProps {
	onDateChange: (from: string | null, to: string | null) => void;
	maxDays?: number;
	initialDates?: { from?: Date; to?: Date };
}

export const ReportDateRange = React.forwardRef<
	{ reset: () => void },
	ReportDateRangeProps
>((props, ref) => {
	return (
		<DateRangePicker
			triggerSize='default'
			triggerClassName='w-full'
			align='end'
			shallow={false}
			ref={ref}
			persistQuery={false}
			maxDays={props.maxDays}
			defaultDateRange={{
				from: props.initialDates?.from,
				to: props.initialDates?.to,
			}}
			onApply={(from, to) => {
				if (from && to) {
					props.onDateChange(
						formatRequestDateWithTimezone(from),
						formatRequestDateWithTimezone(to)
					);
				}
			}}
			onReset={() => {
				props.onDateChange(null, null);
			}}
			dateResetAllowed={false}
		/>
	);
});

ReportDateRange.displayName = 'ReportDateRange';
