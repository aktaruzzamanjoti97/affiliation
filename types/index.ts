export interface DataTable {
	id: number;
	name: string;
	email: string;
	department: string;
	status: string;
	date: string;
	revenue: number;
}

export type SortOption = 'id' | 'name' | 'email' | 'department' | 'status' | 'date' | 'revenue';