'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserSquare2, BarChart3, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname() || '';
  const currentPath = pathname.toLowerCase();

  // Active module evaluate karo
  const isAdmission = currentPath.startsWith('/admission');
  const isReadmission = currentPath.startsWith('/readmission');

  // Agar dono me se koi bhi path active nahi hai to sidebar hide kar do
  if (!isAdmission && !isReadmission) {
    return null;
  }

  // Active module base path & workspace title
  const basePath = isAdmission ? '/Admission' : '/Readmission';
  const workspaceTitle = isAdmission ? 'Admission Workspace' : 'Readmission Workspace';

  // Submenu configuration (Dynamic route URLs based on module)
  const menuItems = [
    {
      title: isAdmission ? "Admission Analytics" : "Readmission Analytics",
      href: `${basePath}`,
      icon: BarChart3
    },
    {
      title: "Member List",
      href: `${basePath}/PatientList`,
      icon: Users
    },
    {
      title: "Member Profile",
      href: `${basePath}/PatientList/PatientProfile`,
      icon: UserSquare2
    }
  ];

  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] w-64 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col space-y-2 shadow-sm overflow-y-auto">
      <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        {workspaceTitle}
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href.toLowerCase();

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-sm'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-sky-600' : 'text-slate-400'} />
                <span>{item.title}</span>
              </div>
              {isActive && <ChevronRight size={16} className="text-sky-600" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}