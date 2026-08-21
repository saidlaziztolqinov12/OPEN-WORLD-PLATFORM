import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  CalendarCheck2,
  BookOpen,
  GraduationCap,
  LogOut,
  UserCheck,
  Inbox
} from 'lucide-react';
import { LogoutConfirmModal } from './LogoutConfirmModal';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const { isAdmin, currentUser, logout } = useAuth();
  const { notifications } = useData();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const visibleNotifications = notifications.filter((n) => {
    if (isAdmin) return true;
    return (
      n.recipientId === currentUser?.id ||
      n.recipientId === 'GLOBAL' ||
      n.recipientId === 'all_teachers' ||
      n.recipientId === 'all'
    );
  });

  const unreadCount = visibleNotifications.filter((n) => !n.read).length;

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 safe-area-pb text-slate-600 dark:text-slate-300 shadow-lg">
        <div className="flex items-center justify-around">
          {isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                  activeTab === 'admin-dashboard'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('admin-students')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                  activeTab === 'admin-students'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Students</span>
              </button>

              <button
                onClick={() => setActiveTab('teachers')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                  activeTab === 'teachers'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Teachers</span>
              </button>

              <button
                onClick={() => setActiveTab('inbox')}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                  activeTab === 'inbox'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Inbox className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500" />
                )}
                <span className="text-[10px] mt-0.5">Inbox</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('teacher-dashboard')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                  activeTab === 'teacher-dashboard'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">My Groups</span>
              </button>

              <button
                onClick={() => setActiveTab('teacher-students')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                  activeTab === 'teacher-students'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Students</span>
              </button>

              <button
                onClick={() => setActiveTab('teacher-attendance-history')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                  activeTab === 'teacher-attendance-history'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <CalendarCheck2 className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Log</span>
              </button>

              <button
                onClick={() => setActiveTab('inbox')}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                  activeTab === 'inbox'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Inbox className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500" />
                )}
                <span className="text-[10px] mt-0.5">Inbox</span>
              </button>
            </>
          )}

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Log Out</span>
          </button>
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        userName={currentUser?.name}
      />
    </>
  );
};
