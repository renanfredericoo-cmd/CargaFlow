import { ReactNode } from 'react';

interface ModalProps {
    show: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
    maxWidth?: string;
}

export default function Modal({
    show,
    title,
    children,
    onClose,
    maxWidth = "max-w-3xl",
}: ModalProps) {

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div
                className={`w-full ${maxWidth} rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900`}
            >

                <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-xl font-bold">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 transition hover:text-red-600"
                    >
                        ✕
                    </button>

                </div>

                {children}

            </div>

        </div>
    );
}