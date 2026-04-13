'use client';

import { ReactNode } from 'react';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-foreground-500 hover:text-foreground-700"
                >
                    ✕
                </button>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}