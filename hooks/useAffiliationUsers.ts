import { affiliationApi } from '@/lib/api';
import {
	AffiliationUser,
	AffiliationUsersParams,
	ApiResponse,
} from '@/types/api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const affiliationKeys = {
	users: () => ['users'] as const,
	userList: (params: AffiliationUsersParams) =>
		[...affiliationKeys.users(), params] as const,
};

export const useAffiliationUsers = (
	params: AffiliationUsersParams,
	options?: UseQueryOptions<ApiResponse<AffiliationUser>>
) => {
	return useQuery({
		queryKey: affiliationKeys.userList(params),
		queryFn: () => affiliationApi.getAffiliationUsers(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime)
		retry: 2,
		enabled: !!(
			params.code &&
			params.start_date &&
			params.end_date &&
			params.data_type
		),
		...options,
	});
};
