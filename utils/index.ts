import dayjs from 'dayjs';

export const APP_TIMEZONE = 'Asia/Dhaka';

export const formatRequestDateWithTimezone = (
	date: Date | string | number | null | undefined,
	format: string = 'YYYY-MM-DDTHH:mm:ssZ',
	tz: string = APP_TIMEZONE
): string | null => {
	if (date === null || date === undefined) return null;

	return dayjs(date).tz(tz).format(format);
};
