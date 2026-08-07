import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    className?: string;
}

export default function Input({
    label,
    error,
    className = '',
    ...props
}: InputProps) {
    return (
        <div className={`mb-4 ${className}`}>
            <label className="mb-2 block text-sm font-medium">
                {label}
            </label>

            <input
                {...props}
                className="w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 dark:bg-neutral-900 dark:border-neutral-700"
            />

            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}