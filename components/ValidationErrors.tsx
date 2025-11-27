interface ValidationErrorsProps {
	errors: string[];
	className?: string;
}

export function ValidationErrors({ errors, className }: ValidationErrorsProps) {
	if (!errors || errors.length === 0) {
		return null;
	}

	return (
		<div className={`text-sm text-red-600 mt-2 ${className}`}>
			<ul className="list-disc list-inside">
				{errors.map((error, index) => (
					<li key={index}>{error}</li>
				))}
			</ul>
		</div>
	);
}