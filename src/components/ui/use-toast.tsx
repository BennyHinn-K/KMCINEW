import { useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

const toastVariantStyles: Record<Toast['type'], string> = {
  success: 'bg-success text-success-foreground',
  error: 'bg-destructive text-destructive-foreground',
  info: 'bg-primary text-primary-foreground',
};

const ToastIcon = ({ type }: { type: Toast['type'] }) => {
  const IconComponent = type === 'success' ? CheckCircle : type === 'error' ? XCircle : Info;
  return <IconComponent className="w-5 h-5 shrink-0" />;
};

export const ToastContainer = ({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast?: (id: number) => void;
}) => {
  return (
    <div className="fixed bottom-md right-md z-[100] flex flex-col space-y-sm w-auto max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            "relative animate-fade-up rounded-xl shadow-4 border border-border backdrop-blur-md",
            toastVariantStyles[toast.type]
          )}
        >
          <div className="flex items-start gap-sm px-md py-md">
            <div className="pt-2xs">
              <ToastIcon type={toast.type} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-relaxed break-words">
                {toast.message}
              </p>
            </div>
            {removeToast && (
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className={cn(
                  "shrink-0 p-2xs rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "hover:bg-ink/10 active:bg-ink/20"
                )}
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
