import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({
    children,
    variant = 'primary',
    ...props
}: ButtonProps) {

    const styles = {
        primary:
            'bg-blue-600 hover:bg-blue-700 text-white',
        secondary:
            'bg-gray-200 hover:bg-gray-300 text-gray-800',
        danger:
            'bg-red-600 hover:bg-red-700 text-white',
    };

    return (
        <button
            {...props}
            className={`rounded-lg px-5 py-3 font-semibold transition ${styles[variant]}`}
        >
            {children}
        </button>
    );
}