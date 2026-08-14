import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Fundo */}
            <rect
                x="2"
                y="2"
                width="36"
                height="36"
                rx="10"
                fill="#2563eb"
            />

            {/* Caminhão */}
            <path
                d="M8 13.5C8 12.67 8.67 12 9.5 12H23C23.83 12 24.5 12.67 24.5 13.5V25H8V13.5Z"
                fill="#ffffff"
            />

            {/* Cabine */}
            <path
                d="M24.5 17H28.2C28.72 17 29.21 17.27 29.5 17.7L32 21.5V25H24.5V17Z"
                fill="#ffffff"
            />

            {/* Janela */}
            <path
                d="M26 18.5H28C28.25 18.5 28.48 18.63 28.62 18.84L30 21H26V18.5Z"
                fill="#2563eb"
            />

            {/* Rodas */}
            <circle
                cx="13"
                cy="26"
                r="3"
                fill="#ffffff"
            />

            <circle
                cx="13"
                cy="26"
                r="1.3"
                fill="#2563eb"
            />

            <circle
                cx="28"
                cy="26"
                r="3"
                fill="#ffffff"
            />

            <circle
                cx="28"
                cy="26"
                r="1.3"
                fill="#2563eb"
            />

            {/* Linha de movimento */}
            <path
                d="M9 29H20"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M9 32H16"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}