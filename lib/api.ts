import {
	AffiliationSummary,
	AffiliationSummaryParams,
	AffiliationUser,
	AffiliationUsersParams,
	ApiResponse,
} from '@/types/api';
import axios from 'axios';
import { parseAsInteger, parseAsString } from 'nuqs';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://affiliation-api.gktechbd.com/api/v1";

// Helper function to get auth token from client-side
const getAuthToken = async (): Promise<string | null> => {
	try {
		const response = await fetch('/api/auth/session');
		if (response.ok) {
			const session = await response.json();
			return session?.accessToken || null;
		}
		return null;
	} catch (error) {
		console.error('Error getting auth token:', error);
		return null;
	}
};

// Type-safe builders for API parameters using nuqs-style validation
const buildAffiliationUsersQuery = (params: AffiliationUsersParams): string => {
	const searchParams = new URLSearchParams();

	// Use the same parsers and defaults as the UI components
	const codeParser = parseAsString.withDefault('');
	const startDateParser = parseAsString.withDefault('');
	const endDateParser = parseAsString.withDefault('');
	const dataTypeParser = parseAsString.withDefault('');
	const pageParser = parseAsInteger.withDefault(1);
	const pageSizeParser = parseAsInteger.withDefault(10);
	const orderByParser = parseAsString.withDefault('created_at');
	const orderingParser = parseAsString.withDefault('desc');

	// Parse and validate values using the same parsers as the UI
	const code = codeParser.parse(params.code);
	const startDate = startDateParser.parse(params.start_date);
	const endDate = endDateParser.parse(params.end_date);
	const dataType = dataTypeParser.parse(params.data_type);
	const page = pageParser.parse(params.page.toString());
	const pageSize = pageSizeParser.parse(params.page_size.toString());
	const orderBy = orderByParser.parse(params.order_by_fields);
	const ordering = orderingParser.parse(params.ordering);

	if (code) searchParams.append('code', code);
	if (startDate) searchParams.append('start_date', startDate);
	if (endDate) searchParams.append('end_date', endDate);
	if (dataType) searchParams.append('data_type', dataType);
	if (page) searchParams.append('page', page.toString());
	if (pageSize) searchParams.append('page_size', pageSize.toString());
	if (orderBy) searchParams.append('order_by_fields', orderBy);
	if (ordering) searchParams.append('ordering', ordering);

	return searchParams.toString();
};

const buildAffiliationSummaryQuery = (params: AffiliationSummaryParams): string => {
	const searchParams = new URLSearchParams();

	// Use the same parsers and defaults as the UI components
	const codeParser = parseAsString.withDefault('');
	const startDateParser = parseAsString.withDefault('');
	const endDateParser = parseAsString.withDefault('');
	const dataTypeParser = parseAsString.withDefault('');
	const pageParser = parseAsInteger.withDefault(1);
	const pageSizeParser = parseAsInteger.withDefault(10);

	// Parse and validate values using the same parsers as the UI
	const code = codeParser.parse(params.code);
	const startDate = startDateParser.parse(params.start_date);
	const endDate = endDateParser.parse(params.end_date);
	const dataType = dataTypeParser.parse(params.data_type);
	const page = pageParser.parse(params.page.toString());
	const pageSize = pageSizeParser.parse(params.page_size.toString());

	if (code) searchParams.append('code', code);
	if (startDate) searchParams.append('start_date', startDate);
	if (endDate) searchParams.append('end_date', endDate);
	if (dataType) searchParams.append('data_type', dataType);
	if (page) searchParams.append('page', page.toString());
	if (pageSize) searchParams.append('page_size', pageSize.toString());

	return searchParams.toString();
};

export const apiClient = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	async (request) => {
		const token = await getAuthToken();
		if (token) {
			request.headers.Authorization = `Bearer ${token}`;
		}
		return request;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			window.location.href = '/auth/login';
		}
		return Promise.reject(error);
	}
);

export const affiliationApi = {
	getAffiliationUsers: async (
		params: AffiliationUsersParams
	): Promise<ApiResponse<AffiliationUser>> => {
		const queryString = buildAffiliationUsersQuery(params);
		const url = `/reports/?${queryString}`;

		// Use POST as the API expects, but send params in the body
		const response = await apiClient.post(url, params);
		return response.data;
	},
	getAffiliationSummary: async (
		params: AffiliationSummaryParams
	): Promise<ApiResponse<AffiliationSummary>> => {
		const queryString = buildAffiliationSummaryQuery(params);
		const url = `/reports/summaries/?${queryString}`;

		// Use POST as the API expects, but send params in the body
		const response = await apiClient.post(url, params);
		return response.data;
	},
};
