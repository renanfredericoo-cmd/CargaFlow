import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
        >

            <rect
                x="2"
                y="2"
                width="36"
                height="36"
                rx="10"
                fill="#2563eb"
            />


            <path
                d="M12 20L17 25L28 14"
                fill="none"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />


            <path
                d="M12 30H28"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
            />

        </svg>
    );
}