import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { formSchema, FormSchema } from '@/schemas/formSchema';

interface UseFormStateReturn {
	form: ReturnType<typeof useForm<FormSchema>>;
	isSubmitting: boolean;
	setIsSubmitting: (submitting: boolean) => void;
	resetForm: () => void;
	getFormData: () => FormSchema;
}

interface UseFormStateProps {
	defaultValues?: Partial<FormSchema>;
}

export function useFormState({ defaultValues }: UseFormStateProps = {}): UseFormStateReturn {
	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			inputValue: defaultValues?.inputValue || '',
			fromDate: defaultValues?.fromDate || undefined,
			toDate: defaultValues?.toDate || undefined,
			summary: defaultValues?.summary || false,
			type: defaultValues?.type || 'SALES',
		},
		mode: 'onChange',
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const resetForm = () => {
		form.reset();
		setIsSubmitting(false);
	};

	const getFormData = () => form.getValues();

	return {
		form,
		isSubmitting,
		setIsSubmitting,
		resetForm,
		getFormData,
	};
}