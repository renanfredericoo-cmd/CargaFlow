import { ReactNode } from 'react';

interface ModalProps {
    show: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
}

export default function Modal({
    show,
    title,
    children,
    onClose,
}: ModalProps) {

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">

                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        ✕
                    </button>
                </div>

                <div>
                    {children}
                </div>

            </div>

        </div>
    );
}