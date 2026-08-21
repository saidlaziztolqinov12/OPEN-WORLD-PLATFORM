/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherManagement } from './components/admin/TeacherManagement';
import { GlobalAnalytics } from './components/admin/GlobalAnalytics';
import { AllStudentsDirectory } from './components/admin/AllStudentsDirectory';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherAttendanceLog } from './components/teacher/TeacherAttendanceLog';
import { TeacherStudentsDirectory } from './components/teacher/TeacherStudentsDirectory';
import { GroupDetailView } from './components/groups/GroupDetailView';
import { StudentModal } from './components/students/StudentModal';
import { InboxView } from './components/notifications/InboxView';
import { GraduationCap, Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import { LogoutConfirmModal } from './components/common/LogoutConfirmModal';

const MainApp: React.FC = () => {
  const { currentUser, isAdmin, isTeacher, logout } = useAuth();
  const { groups } = useData();
  const { isDark, toggleTheme } = useTheme();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>(
    isAdmin ? 'admin-dashboard' : 'teacher-dashboard'
  );

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Group detail drilldown state
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Global Add Student modal state (triggered from sidebar)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState<boolean>(false);

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobileLogoutModalOpen, setIsMobileLogoutModalOpen] = useState<boolean>(false);

  // Sync default tab when user changes role
  useEffect(() => {
    if (isAdmin && !['admin-dashboard', 'admin-students', 'teachers', 'analytics', 'inbox'].includes(activeTab)) {
      setActiveTab('admin-dashboard');
    } else if (isTeacher && !['teacher-dashboard', 'teacher-students', 'teacher-attendance-history', 'inbox'].includes(activeTab)) {
      setActiveTab('teacher-dashboard');
    }
  }, [isAdmin, isTeacher, activeTab]);

  if (!currentUser) {
    return <AuthScreen />;
  }

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleBackFromGroup = () => {
    setSelectedGroupId(null);
  };

  const handleSidebarTabSelect = (tab: string) => {
    setSelectedGroupId(null);
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleOpenAddStudent = () => {
    setIsAddStudentModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  // Find a default group for new student enrollment if available
  const defaultGroupId = isAdmin
    ? (groups.find((g) => !g.archived)?.id || '')
    : (groups.find((g) => g.teacherId === currentUser?.id && !g.archived)?.id || groups[0]?.id || '');

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-200">
      {/* Collapsible Left-Hand Sidebar (Desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSidebarTabSelect}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenAddStudent={handleOpenAddStudent}
      />

      {/* Mobile Top Header (Small screens only) */}
      <div className="md:hidden sticky top-0 z-30 bg-slate-900 dark:bg-slate-950 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white">Open World</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 uppercase">
                {isAdmin ? 'Admin' : 'Teacher'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Night / Day Mode Toggle Button */}
          <button
            id="mobile-theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle night/day mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-300" />
            )}
          </button>

          {/* Three Lines Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer flex items-center justify-center transition-all active:scale-95"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-slate-900 text-white rounded-t-3xl border-t border-slate-800 p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.firstName && currentUser.surname
                    ? `${currentUser.firstName.charAt(0)}${currentUser.surname.charAt(0)}`
                    : currentUser.name
                    ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'ME'}
                </div>
                <div>
                  <div className="text-sm font-bold">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-2">
              <button
                onClick={handleOpenAddStudent}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <span>+ Enroll New Student</span>
              </button>

              {isAdmin ? (
                <>
                  <button
                    onClick={() => handleSidebarTabSelect('admin-dashboard')}
                    className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold ${
                      activeTab === 'admin-dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Dashboard (Overview & Groups)
                  </button>
                  <button
                    onClick={() => handleSidebarTabSelect('admin-students')}
                    className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold ${
                      activeTab === 'admin-students' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    All Students Directory
                  </button>
                  <button
                    onClick={() => handleSidebarTabSelect('teachers')}
                    className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold ${
                      activeTab === 'teachers' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Teachers Roster
                  </button>
                  <button
                    onClick={() => handleSidebarTabSelect('analytics')}
                    className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold ${
                      activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Center Analytics
                  </button>
                  <button
                    onClick={() => handleSidebarTabSelect('inbox')}
                    className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold ${
                      activeTab === 'inbox' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Inbox & Transfer Requests
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSidebarTabSelect('teacher-dashboard')}
                    className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold ${
                      activeTab === 'teacher-dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Dashboard (My Groups)
                  </button>
                  <button
                    onClick={() => handleSidebarTabSelect('teacher-students')}
                    className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold ${
                      activeTab === 'teacher-students' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    My Students Roster
                  </button>
                  <button
                    onClick={() => handleSidebarTabSelect('teacher-attendance-history')}
                    className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold ${
                      activeTab === 'teacher-attendance-history' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Attendance Log
                  </button>
                  <button
                    onClick={() => handleSidebarTabSelect('inbox')}
                    className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold ${
                      activeTab === 'inbox' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Center Inbox
                  </button>
                </>
              )}
            </div>

            {/* Mobile Logout Button */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileLogoutModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-950/50 text-rose-300 border border-rose-800/40 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto min-w-0 w-full overflow-x-hidden flex flex-col px-3 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
        {selectedGroupId ? (
          <GroupDetailView
            groupId={selectedGroupId}
            onBack={handleBackFromGroup}
          />
        ) : (
          <>
            {/* Admin Views */}
            {isAdmin && (
              <>
                {activeTab === 'admin-dashboard' && (
                  <AdminDashboard
                    onSelectGroup={handleSelectGroup}
                    onNavigateTeachers={() => setActiveTab('teachers')}
                    onNavigateAnalytics={() => setActiveTab('analytics')}
                    onNavigateStudents={() => setActiveTab('admin-students')}
                  />
                )}
                {activeTab === 'admin-students' && (
                  <AllStudentsDirectory onSelectGroup={handleSelectGroup} />
                )}
                {activeTab === 'teachers' && (
                  <TeacherManagement onSelectGroup={handleSelectGroup} />
                )}
                {activeTab === 'analytics' && (
                  <GlobalAnalytics onSelectGroup={handleSelectGroup} />
                )}
                {activeTab === 'inbox' && (
                  <InboxView onSelectGroup={handleSelectGroup} />
                )}
              </>
            )}

            {/* Teacher Views */}
            {isTeacher && (
              <>
                {activeTab === 'teacher-dashboard' && (
                  <TeacherDashboard
                    onSelectGroup={handleSelectGroup}
                    onNavigateStudents={() => setActiveTab('teacher-students')}
                  />
                )}
                {activeTab === 'teacher-students' && (
                  <TeacherStudentsDirectory onSelectGroup={handleSelectGroup} />
                )}
                {activeTab === 'teacher-attendance-history' && (
                  <TeacherAttendanceLog onSelectGroup={handleSelectGroup} />
                )}
                {activeTab === 'inbox' && (
                  <InboxView onSelectGroup={handleSelectGroup} />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar for quick access */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedGroupId(null);
          setActiveTab(tab);
        }}
      />

      {/* Quick Add Student Modal */}
      <StudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        groupId={defaultGroupId}
        onSuccess={() => {
          setIsAddStudentModalOpen(false);
        }}
      />

      {/* Mobile Logout Confirm Modal */}
      <LogoutConfirmModal
        isOpen={isMobileLogoutModalOpen}
        onClose={() => setIsMobileLogoutModalOpen(false)}
        onConfirm={logout}
        userName={currentUser?.name}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainApp />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
