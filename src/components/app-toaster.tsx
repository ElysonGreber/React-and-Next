"use client"
import { useState, ReactNode } from "react";
import { Toaster } from "./ui/toast";

interface ToastOptions {
  type: 1 | 2 | 3;
  title: string;
  message: string;
  duration?: number;
}

export function useToaster() {
  const [toast, setToast] = useState<ReactNode | null>(null);

  const showToast = (options: ToastOptions) => {
    setToast(
      <Toaster
        {...options}
        onClose={() => setToast(null)}
      />
    );
  };

  return { showToast, toast };
}
