import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-4 flex items-start justify-between gap-3 text-rose-300">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-[#ef4444]">Action Failed</h4>
          <p className="text-xs text-rose-200/80 mt-0.5">{message || 'Something went wrong while communicating with the server.'}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#ef4444]/20 hover:bg-[#ef4444]/30 text-rose-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}
