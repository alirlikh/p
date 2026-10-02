'use client';

import { Toaster as SonnerToaster } from 'sonner';

export const Toaster = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-gray-800 group-[.toaster]:text-gray-100 group-[.toaster]:border-gray-700 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-gray-400',
          actionButton: 'group-[.toast]:bg-purple-300 group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-gray-700 group-[.toast]:text-gray-300',
        },
      }}
    />
  );
};
