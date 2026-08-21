import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  GraduationCap,
  LayoutDashboard,
  UserCheck,
  BarChart3,
  CalendarCheck2,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Plus,
  WifiOff,
  Sun,
  Moon,
  Inbox
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
          icon: LayoutDashboard,
          badge: groups.filter((g) => !g.archived).length.toString()
        },
        {
          id: 'add-student-action',
          label: 'Add Student',
          icon: UserPlus,
          isAction: true
        },
        {
          id: 'admin-students',
          label: 'All Students',
          icon: GraduationCap,
          badge: students.filter((s) => s.status !== 'inactive').length.toString()
        },
        {
          id: 'teachers',
          label: 'Teachers Roster',
          icon: UserCheck,
          badge: teachers.length.toString()
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3
        },
        {
          id: 'inbox',
          label: 'Inbox',
          icon: Inbox,
          badge: (pendingTransfers > 0 ? pendingTransfers : unreadCount > 0 ? unreadCount : undefined)?.toString()
        }
      ]
    : [
        {
          id: 'teacher-dashboard',
          label: 'Dashboard',
          icon: BookOpen,
          badge: groups.filter((g) => g.teacherId === currentUser?.id && !g.archived).length.toString()
        },
        {
          id: 'add-student-action',
          label: 'Add Student',
          icon: UserPlus,
          isAction: true
        },
        {
          id: 'teacher-students',
          label: 'My Students',
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
          icon: CalendarCheck2
        },
        {
          id: 'inbox',
          label: 'Inbox',
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
        className={`hidden md:flex flex-col h-full flex-shrink-0 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-200 z-30 select-none ${
          isCollapsed ? 'w-16' : 'w-52 lg:w-56'
        }`}
      >
        {/* Brand & Toggle Header */}
        {isCollapsed ? (
          <div className="h-14 flex items-center justify-center px-2 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              id="toggle-sidebar-btn"
              onClick={() => setIsCollapsed(false)}
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="h-14 flex items-center justify-between px-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1 truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs tracking-tight text-slate-900 dark:text-white truncate">
                    Open World
                  </span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase shrink-0">
                    {isAdmin ? 'Admin' : 'Teacher'}
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle button to collapse */}
            <button
              id="toggle-sidebar-btn"
              onClick={() => setIsCollapsed(true)}
              className="w-6 h-6 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Action Button (if expanded) */}
        {!isCollapsed && (
          <div className="px-2.5 pt-3 pb-1">
            <button
              id="sidebar-quick-enroll-btn"
              onClick={onOpenAddStudent}
              className="w-full py-2 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-2.5 space-y-1">
          {!isCollapsed && (
            <div className="px-2 pt-1 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Menu
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
                className={`flex items-center transition-colors cursor-pointer ${
                  isCollapsed
                    ? `w-9 h-9 mx-auto justify-center rounded-lg ${
                        item.isAction
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200/60 dark:border-indigo-800/40'
                          : isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`
                    : `w-full gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs ${
                        item.isAction
                          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-medium border border-indigo-200/50 dark:border-indigo-900/40'
                          : isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white font-normal'
                      }`
                }`}
              >
                <div
                  className={`flex items-center justify-center shrink-0 ${
                    isCollapsed
                      ? 'w-full h-full'
                      : `w-5 h-5 ${
                          item.isAction
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : isActive
                            ? 'text-white'
                            : 'text-slate-400 dark:text-slate-500'
                        }`
                  }`}
                >
                  <Icon className={isCollapsed ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className="truncate">{item.label}</span>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ml-1 shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
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
        <div className="px-2 py-2 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1.5">
          {/* Day / Night Mode Toggle Switch */}
          {isCollapsed ? (
            <button
              onClick={toggleTheme}
              className="w-8 h-8 mx-auto flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            </button>
          ) : (
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-1.5">
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {isDark ? 'Night Mode' : 'Day Mode'}
                </span>
              </div>

              {/* Interactive Pill Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isDark ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={isDark}
                title="Toggle Theme"
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                    isDark ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Sync Status Badge */}
          {isCollapsed ? (
            <div
              className="w-8 h-6 mx-auto flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800"
              title={isOnline ? 'Cloud database connected' : 'Offline local cache'}
            >
              {isOnline ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ) : (
                <WifiOff className="w-3 h-3 text-amber-500" />
              )}
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 text-xs py-1 px-2 rounded-md text-slate-500 dark:text-slate-400"
              title={isOnline ? 'Cloud database connected' : 'Offline local mode'}
            >
              {isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Cloud Synced
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] text-amber-600 dark:text-amber-400">
                    Offline Cache
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* User profile & Log Out Footer - ONLY visible when sidebar is expanded */}
        {!isCollapsed && (
          <div className="p-2 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            {/* User Info card */}
            <div className="flex items-center gap-2 p-1.5 rounded-lg mb-1.5 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] text-white shrink-0 ${
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
                <div className="text-xs font-semibold text-slate-800 dark:text-white truncate leading-tight">
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
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
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
