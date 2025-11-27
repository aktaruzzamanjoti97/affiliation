
export interface SalesData {
	id: string;
	customer_id: string;
	purchase_amount: string;
	purchase_quantity: string;
	vat_percentage: string;
	vat_amount: string;
	amount_with_vat: string;
	service_charge_percentage: string;
	service_charge_amount: string;
	subtotal_amount: string;
	total_discounted_amount: string;
	service_charge_amount_after_discount: string;
	paid_amount: string;
	amount_before_settlement: string;
	buy_type: string;
	pgw_transaction_id: string | null;
	pgw_settlement_fee_percentage: string;
	pgw_settlement_fee_amount: string;
	vat_percentage_on_service_charge: string;
	vat_amount_on_service_charge: string;
	collectable_service_charge_amount: string;
	business_receivable_amount: string;
	offer_id: string | null;
	residue_amount: string | null;
	payer_no: string | null;
	market_price: string;
	pay_channel: string;
	payment_gateway: string;
	user_transaction_ref: string;
	checkpoint: string;
	transacted_at: string;
	updated_at: string;
	pgw_tracking_id: string;
	status: string;
	customer_name: string;
	customer_joining_date: string;
	customer_phone: string;
	customer_nid_no: string | null;
}

export interface RegistrationData {
	id: string;
	name: string;
	phone: string;
	affiliation_partner_reference_id: string;
	source_affiliation_code: string;
}

export interface SalesDataSummary {
	created_date: string;
	total_sales: number;
	total_customers: number;
	purchase_amount: string;
	service_charge_amount: string;
	paid_amount: string;
	auto_pay_extra_amount: string | null;
	vat_amount: string;
	pgw_settlement_fee_amount: string;
	business_receivable_amount: string;
}

export interface RegistrationDataSummary {
	created_date: string;
	total_users: number;
}

export type AffiliationUser = SalesData | RegistrationData;
export type AffiliationSummary = SalesDataSummary | RegistrationDataSummary;

export interface ApiResponse<T> {
	success: boolean;
	data: T[];
	message: string;
	code: number;
	meta_info: {
		total: number;
		current_page: number;
		next_page: number | null;
		prev_page: number | null;
		last_page: number;
		extra: unknown;
	};
}

export interface AffiliationUsersParams {
	code: string;
	start_date: string;
	end_date: string;
	data_type: string;
	page: number;
	page_size: number;
	order_by_fields: string;
	ordering: 'asc' | 'desc';
}

export interface AffiliationSummaryParams {
	code: string;
	start_date: string;
	end_date: string;
	data_type: string;
	page: number;
	page_size: number;
}
