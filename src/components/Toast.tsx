import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ show, message }) => {
  if (!show) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none border border-emerald-400">
      <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[2.5]" />
      <span>{message}</span>
    </div>
  );
};
