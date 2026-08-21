import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  CalendarCheck2,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Plus,
  Wifi,
  WifiOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sun,
  Moon,
  Inbox,
  Bell
} from 'lucide-react';
import { LogoutConfirmModal } from './LogoutConfirmModal';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  onOpenAddStudent: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onOpenAddStudent
}) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { isOnline, students, groups, teachers, notifications } = useData();
  const { isDark, toggleTheme } = useTheme();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirmed = () => {
    logout();
  };

  const visibleNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (isAdmin) return true;
      return (
        n.recipientId === currentUser?.id ||
        n.recipientId === 'GLOBAL' ||
        n.recipientId === 'all_teachers' ||
        n.recipientId === 'all'
      );
    });
  }, [notifications, isAdmin, currentUser]);

  const unreadCount = useMemo(() => {
    return visibleNotifications.filter((n) => !n.read).length;
  }, [visibleNotifications]);

  const pendingTransfers = useMemo(() => {
    return visibleNotifications.filter(
      (n) =>
        (n.type === 'TRANSFER_REQUEST' || n.type === 'transfer_request') &&
        (n.status === 'PENDING' || n.status === 'pending')
    ).length;
  }, [visibleNotifications]);

  const navItems = isAdmin
    ? [
        {
          id: 'admin-dashboard',
          label: 'Dashboard',
          subLabel: 'Overview & Groups',
          icon: LayoutDashboard,
          badge: groups.filter((g) => !g.archived).length.toString()
        },
        {
          id: 'add-student-action',
          label: 'Add Student',
          subLabel: 'Quick Enrollment',
          icon: UserPlus,
          isAction: true
        },
        {
          id: 'admin-students',
          label: 'All Students',
          subLabel: 'Master Register',
          icon: GraduationCap,
          badge: students.filter((s) => s.status !== 'inactive').length.toString()
        },
        {
          id: 'teachers',
          label: 'Teachers Roster',
          subLabel: 'Faculty & Access',
          icon: UserCheck,
          badge: teachers.length.toString()
        },
        {
          id: 'analytics',
          label: 'Center Analytics',
          subLabel: 'Attendance & Trends',
          icon: BarChart3
        },
        {
          id: 'inbox',
          label: 'Inbox & Requests',
          subLabel: pendingTransfers > 0 ? `${pendingTransfers} Pending Requests` : 'Announcements & Alerts',
          icon: Inbox,
          badge: (pendingTransfers > 0 ? pendingTransfers : unreadCount > 0 ? unreadCount : undefined)?.toString()
        }
      ]
    : [
        {
          id: 'teacher-dashboard',
          label: 'Dashboard',
          subLabel: 'My Active Groups',
          icon: BookOpen,
          badge: groups.filter((g) => g.teacherId === currentUser?.id && !g.archived).length.toString()
        },
        {
          id: 'add-student-action',
          label: 'Add Student',
          subLabel: 'Enroll in Class',
          icon: UserPlus,
          isAction: true
        },
        {
          id: 'teacher-students',
          label: 'My Students',
          subLabel: 'Enrolled Roster',
          icon: GraduationCap,
          badge: students.filter((s) => {
            const myGroupIds = new Set(
              groups.filter((g) => g.teacherId === currentUser?.id).map((g) => g.id)
            );
            return myGroupIds.has(s.groupId) && s.status !== 'inactive';
          }).length.toString()
        },
        {
          id: 'teacher-attendance-history',
          label: 'Attendance Log',
          subLabel: 'Session Records',
          icon: CalendarCheck2
        },
        {
          id: 'inbox',
          label: 'Center Inbox',
          subLabel: 'Notices & Statuses',
          icon: Inbox,
          badge: unreadCount > 0 ? unreadCount.toString() : undefined
        }
      ];

  const handleItemClick = (item: (typeof navItems)[0]) => {
    if (item.isAction) {
      onOpenAddStudent();
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <>
      <aside
        id="app-sidebar"
        className={`hidden md:flex flex-col h-full flex-shrink-0 bg-slate-900 dark:bg-slate-950 text-slate-100 border-r border-slate-800 dark:border-slate-850 transition-all duration-300 z-30 select-none shadow-xl ${
          isCollapsed ? 'w-16' : 'w-64 lg:w-72'
        }`}
      >
        {/* Brand & Toggle Header */}
        {isCollapsed ? (
          <div className="h-16 flex items-center justify-center px-2 border-b border-slate-800/80 bg-slate-950/40">
            <button
              id="toggle-sidebar-btn"
              onClick={() => setIsCollapsed(false)}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-white flex items-center justify-center border border-slate-700/60 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-xs group"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-800/80 bg-slate-950/40 gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white truncate">
                    Open World
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-700/50 uppercase tracking-wide shrink-0">
                    {isAdmin ? 'Admin' : 'Teacher'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  Learning Center Platform
                </p>
              </div>
            </div>

            {/* Toggle button to collapse */}
            <button
              id="toggle-sidebar-btn"
              onClick={() => setIsCollapsed(true)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:-translate-y-0.5 active:scale-95 border border-slate-700/60 shrink-0 cursor-pointer shadow-xs ml-1"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Action Button (if expanded) */}
        {!isCollapsed && (
          <div className="px-3.5 pt-4 pb-1">
            <button
              id="sidebar-quick-enroll-btn"
              onClick={onOpenAddStudent}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Student</span>
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              Navigation Menu
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !item.isAction && activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleItemClick(item)}
                title={item.label}
                className={`flex items-center transition-all group cursor-pointer ${
                  isCollapsed
                    ? `w-10 h-10 mx-auto justify-center rounded-xl ${
                        item.isAction
                          ? 'bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900 border border-indigo-800/50'
                          : isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`
                    : `w-full gap-3 px-3 py-2.5 rounded-xl text-left ${
                        item.isAction
                          ? 'text-indigo-300 hover:bg-indigo-950/50 hover:text-indigo-200 border border-indigo-800/40'
                          : isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
                      }`
                }`}
              >
                <div
                  className={`flex items-center justify-center shrink-0 transition-colors ${
                    isCollapsed
                      ? 'w-full h-full'
                      : `w-8 h-8 rounded-lg ${
                          item.isAction
                            ? 'bg-indigo-900/60 text-indigo-300 group-hover:bg-indigo-800 group-hover:text-white'
                            : isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800 text-slate-300 group-hover:text-white group-hover:bg-slate-700'
                        }`
                  }`}
                >
                  <Icon className={isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div>
                      <div className="text-xs truncate leading-tight">
                        {item.label}
                      </div>
                      {item.subLabel && (
                        <div
                          className={`text-[10px] truncate ${
                            isActive ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          {item.subLabel}
                        </div>
                      )}
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 shrink-0 ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle & Cloud Status Footer Area */}
        <div className="px-2.5 py-2.5 border-t border-slate-800/80 bg-slate-950/30 space-y-2">
          {/* Day / Night Mode Toggle Switch */}
          {isCollapsed ? (
            <button
              onClick={toggleTheme}
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 dark:text-indigo-300 border border-slate-700 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-xs"
              title={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          ) : (
            <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-slate-800/60 border border-slate-750">
              <div className="flex items-center gap-2">
                {isDark ? (
                  <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="text-xs font-semibold text-slate-300">
                  {isDark ? 'Night Mode' : 'Day Mode'}
                </span>
              </div>

              {/* Interactive Pill Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isDark ? 'bg-indigo-600' : 'bg-slate-600'
                }`}
                role="switch"
                aria-checked={isDark}
                title="Toggle Theme"
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isDark ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Sync Status Badge */}
          {isCollapsed ? (
            <div
              className="w-10 h-8 mx-auto flex items-center justify-center rounded-lg bg-slate-800/50"
              title={isOnline ? 'Cloud database connected' : 'Offline local cache'}
            >
              {isOnline ? (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <WifiOff className="w-4 h-4 text-amber-400" />
              )}
            </div>
          ) : (
            <div
              className="flex items-center gap-2 text-xs py-1.5 px-2.5 rounded-lg bg-slate-800/50 border border-slate-750 text-slate-400"
              title={isOnline ? 'Cloud database connected' : 'Offline local mode'}
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] text-slate-300 font-medium">
                    Cloud Synced
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] text-amber-300 font-medium">
                    Offline Cache
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* User profile & Log Out Footer - ONLY visible when sidebar is expanded */}
        {!isCollapsed && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/70 animate-in fade-in duration-200">
            {/* User Info card */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl mb-2 bg-slate-900/80 border border-slate-800">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                  isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}
              >
                {currentUser?.firstName && currentUser?.surname
                  ? `${currentUser.firstName.charAt(0)}${currentUser.surname.charAt(0)}`
                  : currentUser?.name
                  ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                  : 'ME'}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate leading-tight">
                  {currentUser?.name || 'Staff User'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {currentUser?.email || (isAdmin ? 'admin@center.com' : 'Instructor')}
                </div>
              </div>
            </div>

            {/* Log Out Button */}
            <button
              id="sidebar-logout-btn"
              onClick={() => setIsLogoutModalOpen(true)}
              title="Log Out of Workspace"
              className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 text-xs font-bold transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </aside>

      {/* Confirmation modal before actual logout */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirmed}
        userName={currentUser?.name}
      />
    </>
  );
};
