import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#12111f] flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="font-serif-logo text-7xl font-bold text-[#8b85ff] mb-2">
          404
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-sm text-[#9490b8] mb-6">
          The requested page could not be located in the Vedha staff portal.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8b85ff] hover:bg-[#7b75f5] text-white text-sm font-medium transition-all shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
