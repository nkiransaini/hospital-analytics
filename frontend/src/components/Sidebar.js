'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart2, 
  Users, 
  User, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || '';

  const isReadmission = pathname.toLowerCase().includes('readmission');
  
  // Set the correct module path
  const modulePrefix = isReadmission ? '/Readmission' : '/Admission';
  const workspaceTitle = isReadmission ? 'READMISSION WORKSPACE' : 'ADMISSION WORKSPACE';
  const analyticsTitle = isReadmission ? 'Readmission Analytics' : 'Admission Diagnostics';

  // FIX: If in Readmission, route to /Readmission (or /Readmission/Analytics if that folder exists)
  // If in Admission, route back to home '/' where the analytics dashboard lives
  const analyticsHref = isReadmission 
    ? '/Readmission' // or '/Readmission/Analytics' if you created that subfolder
    : '/';          // Points to the home page (Hospital Admission Analytics)

  const isProfileActive = pathname.includes('PatientProfile');
  const isListActive = pathname.includes('PatientList') && !isProfileActive;
  const isAnalyticsActive = pathname === '/' || pathname.endsWith('/Analytics') || pathname === '/Readmission';

  return (
    <>
      <aside
        className={`fixed top-16 left-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col h-[calc(100vh-4rem)] shadow-sm ${
          isOpen ? 'w-60' : 'w-16'
        }`}
      >
        <div className={`h-full flex flex-col ${isOpen ? 'p-5' : 'p-2 pt-4'}`}>
          
          <div className="h-8 flex items-center mb-4 overflow-hidden">
            {isOpen ? (
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                {workspaceTitle}
              </span>
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500 mx-auto" title={workspaceTitle} />
            )}
          </div>

          <nav className="space-y-2 flex-1">
            {/* Top Analytics Button */}
            <Link
              href={analyticsHref}
              title={!isOpen ? analyticsTitle : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                !isOpen ? 'justify-center px-0' : ''
              } ${
                isAnalyticsActive
                  ? 'bg-sky-50 text-sky-700 font-bold border border-sky-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BarChart2 size={18} className={`shrink-0 ${isAnalyticsActive ? 'text-sky-600' : 'text-slate-400'}`} />
              {isOpen && <span className="whitespace-nowrap">{analyticsTitle}</span>}
            </Link>

            {/* Member List Button */}
            <Link
              href={`${modulePrefix}/PatientList`}
              title={!isOpen ? 'Member List' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                !isOpen ? 'justify-center px-0' : ''
              } ${
                isListActive
                  ? 'bg-sky-50 text-sky-700 font-bold border border-sky-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users size={18} className={`shrink-0 ${isListActive ? 'text-sky-600' : 'text-slate-400'}`} />
              {isOpen && <span className="whitespace-nowrap">Member List</span>}
            </Link>

            {/* Member Profile Button */}
            <Link
              href={`${modulePrefix}/PatientList/PatientProfile`}
              title={!isOpen ? 'Member Profile' : undefined}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                !isOpen ? 'justify-center px-0' : ''
              } ${
                isProfileActive
                  ? 'bg-sky-50 text-sky-700 border border-sky-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`flex items-center gap-3 ${!isOpen ? 'justify-center' : ''}`}>
                <User size={18} className={`shrink-0 ${isProfileActive ? 'text-sky-600' : 'text-slate-400'}`} />
                {isOpen && <span className="whitespace-nowrap">Member Profile</span>}
              </div>
              {isOpen && <ChevronRight size={14} className="text-sky-400" />}
            </Link>
          </nav>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? 'Collapse' : 'Expand'}
          className="absolute -right-3 top-10 h-7 w-6 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-r-md shadow-sm flex items-center justify-center cursor-pointer transition-colors z-50"
        >
          {isOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
        </button>
      </aside>

      <div
        className={`shrink-0 transition-all duration-300 ease-in-out pointer-events-none ${
          isOpen ? 'w-60' : 'w-16'
        }`}
      />
    </>
  );
}