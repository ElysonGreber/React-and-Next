import React, { useState, useEffect, JSX } from "react";
import clsx from "clsx";

// Tipos de toasts: 1 = sucesso, 2 = erro, 3 = info, etc
type ToastType = 1 | 2 | 3;

interface ToasterProps {
  type: ToastType;
  title: string;
  message: string;
  onClose?: () => void;
  duration?: number; // tempo em ms antes de fechar automaticamente
}

const icons: Record<ToastType, JSX.Element> = {
  1: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-green-00"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  2: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-red-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  3: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

const typeColors: Record<ToastType, string> = {
  1: "border-green-700 bg-green-100 text-green-700",
  2: "border-red-700 bg-red-100 text-green-700",
  3: "border-blue-700 bg-blue-100 text-green-700",
};

export const Toaster: React.FC<ToasterProps> = ({
  type,
  title,
  message,
  onClose,
  duration = 10000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div 
      className={clsx(
        "fixed bottom-6 left-1/2 z-50 w-96 -translate-x-1/2 rounded-lg  border custom-shadow-2",
        typeColors[type]
      )}
    >

      <div className="flex items-center justify-between rounded-t-lg border-b-2 border-primary px-4 py-2">
        <p className="flex items-center font-bold text-gray-800 ">
          <span className="mr-2">{icons[type]}</span>
          {title}
        </p>
        <button
          type="button"
          className="ml-2 text-gray-600 hover:text-gray-800"
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="break-words rounded-b-lg px-4 py-3 text-sm text-gray-800">{message}</div>
    </div>
  );
};
