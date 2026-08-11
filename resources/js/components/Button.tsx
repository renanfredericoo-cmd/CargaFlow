import { ButtonHTMLAttributes } from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

    children: React.ReactNode;

    variant?:
        | "primary"
        | "secondary"
        | "success"
        | "warning"
        | "danger";

}



export default function Button({

    children,

    variant = "primary",

    className = "",

    ...props

}: ButtonProps) {



    const styles = {

        primary:
            "bg-blue-600 hover:bg-blue-700 text-white",


        secondary:
            "bg-gray-200 hover:bg-gray-300 text-gray-800",


        success:
            "bg-green-600 hover:bg-green-700 text-white",


        warning:
            "bg-orange-500 hover:bg-orange-600 text-white",


        danger:
            "bg-red-600 hover:bg-red-700 text-white",

    };





    return (

        <button

            {...props}

            className={`
                rounded-lg
                px-5
                py-3
                font-semibold
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${styles[variant]}
                ${className}
            `}

        >

            {children}

        </button>

    );

}