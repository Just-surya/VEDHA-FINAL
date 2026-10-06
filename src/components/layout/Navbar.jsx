import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  UserCircle 
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#8b85ff]/20 text-[#8b85ff] border border-[#8b85ff]/35 shadow-sm shadow-indigo-950/20'
        : 'text-[#9490b8] hover:text-white hover:bg-[#1c1b30]'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#8b85ff]/20 text-[#8b85ff] border border-[#8b85ff]/35'
        : 'text-[#9490b8] hover:text-white hover:bg-[#1c1b30]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#12111f]/95 backdrop-blur-md border-b border-[#282646]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Wordmark */}
          <div className="flex items-center gap-4 sm:gap-6">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b85ff] to-[#635bf2] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-950/40 group-hover:scale-105 transition-transform">
                V
              </div>
              <span className="font-serif-logo text-2xl font-bold tracking-tight text-white group-hover:text-slate-100 transition-colors">
                Vedha
              </span>
            </NavLink>

            {/* Subtitle separator */}
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-[#282646]">
              <span className="text-xs font-semibold text-[#8b85ff] bg-[#8b85ff]/10 px-2.5 py-0.5 rounded-full border border-[#8b85ff]/20">
                Term 2
              </span>
              <span className="text-xs text-[#9490b8] font-medium tracking-wide">
                Student Management Dashboard
              </span>
            </div>
          </div>

          {/* Center/Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/students" className={navLinkClass}>
              <Users className="w-4 h-4" />
              <span>Students</span>
            </NavLink>
          </nav>

          {/* Right: Staff profile & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-right">
              <div className="w-8 h-8 rounded-full bg-[#1c1b30] border border-[#282646] flex items-center justify-center text-[#8b85ff]">
                <UserCircle className="w-5 h-5" />
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-xs font-semibold text-slate-200 leading-tight">
                  {user?.name || 'Staff Member'}
                </span>
                <span className="block text-[11px] text-[#9490b8]">
                  {user?.role || 'Academic Staff'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#1c1b30] hover:bg-[#282646] border border-[#282646] transition-all cursor-pointer hover:border-slate-600"
              title="Sign out of staff account"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign out</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-[#1c1b30] border border-[#282646]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#282646] bg-[#12111f] px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top duration-150">
          <div className="px-3 py-2 text-xs text-[#9490b8]">
            Student Management Dashboard — Term 2
          </div>

          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/students"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              <Users className="w-4 h-4" />
              <span>Students</span>
            </NavLink>
          </div>

          <div className="pt-3 border-t border-[#282646] flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1c1b30] border border-[#282646] flex items-center justify-center text-[#8b85ff]">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">{user?.name || 'Staff'}</p>
                <p className="text-[10px] text-[#9490b8]">{user?.role || 'Staff'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
