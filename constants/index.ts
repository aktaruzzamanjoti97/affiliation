export const PAGE_SIZE_OPTIONS = [3, 5, 10, 20, 30] as const;
export const DEFAULT_PAGE_SIZE = 5;
export const DEFAULT_PAGE_INDEX = 0;

export const HEADER_COLOR = '#081939';
export const LOGO_WIDTH = 120;
export const LOGO_HEIGHT = 80;

export const STATUS_COLORS = {
	Active: 'bg-green-100 text-green-800',
	Inactive: 'bg-red-100 text-red-800',
	Pending: 'bg-yellow-100 text-yellow-800',
	Default: 'bg-gray-100 text-gray-800',
} as const;

export const CURRENCY_FORMAT = {
	style: 'currency',
	currency: 'USD',
} as const;

export const LOCALE = 'en-US';