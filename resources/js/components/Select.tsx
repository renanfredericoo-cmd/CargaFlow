import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    children: React.ReactNode;
}

export default function Select({
    label,
    error,
    children,
    ...props
}: SelectProps) {
    return (
        <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
                {label}
            </label>

            <select
                {...props}
                className="w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 dark:bg-neutral-900"
            >
                {children}
            </select>

            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}