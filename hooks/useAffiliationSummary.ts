import { affiliationApi } from '@/lib/api';
import {
	AffiliationSummary,
	AffiliationSummaryParams,
	ApiResponse,
} from '@/types/api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const affiliationKeys = {
	summaries: () => ['summaries'] as const,
	summaryList: (params: AffiliationSummaryParams) =>
		[...affiliationKeys.summaries(), params] as const,
};

export const useAffiliationSummary = (
	params: AffiliationSummaryParams,
	options?: UseQueryOptions<ApiResponse<AffiliationSummary>>
) => {
	const { data: session } = useSession();

	return useQuery({
		queryKey: affiliationKeys.summaryList(params),
		queryFn: async () => {
			if (!session?.accessToken) {
				throw new Error('Authentication required');
			}
			return affiliationApi.getAffiliationSummary(params);
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime)
		retry: 2,
		enabled: !!(
			params.code &&
			params.start_date &&
			params.end_date &&
			params.data_type &&
			session?.accessToken &&
			typeof window !== 'undefined'
		),
		...options,
	});
};
