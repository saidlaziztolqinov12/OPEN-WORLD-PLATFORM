import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { User, Group } from '../../types';
import { TeacherModal } from './TeacherModal';
import {
  Users,
  Plus,
  Mail,
  Phone,
  Edit2,
  CalendarCheck2,
  ArrowRight
} from 'lucide-react';

interface TeacherManagementProps {
  onSelectGroup: (groupId: string) => void;
}

export const TeacherManagement: React.FC<TeacherManagementProps> = ({ onSelectGroup }) => {
  const { teachers, groups, students, attendanceRecords } = useData();
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<User | null>(null);

  const currentMonthStr = new Date().toISOString().substring(0, 7);

  return (
    <div className="space-y-6 pb-20 md:pb-12 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full w-fit mb-1.5 border border-indigo-200 dark:border-indigo-800">
            <Users className="w-3.5 h-3.5" />
            <span>Faculty Roster</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Teacher Accounts & Workload
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage teacher profiles, inspect assigned cohorts, and monitor active sessions
          </p>
        </div>

        <button
          onClick={() => {
            setTeacherToEdit(null);
            setIsTeacherModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers.map((teacher) => {
          const assignedGroups = groups.filter((g) => g.teacherId === teacher.id && !g.archived);
          const assignedGroupIds = new Set(assignedGroups.map((g) => g.id));
          const teacherStudents = students.filter(
            (s) => assignedGroupIds.has(s.groupId) && s.status !== 'inactive'
          );

          // Monthly lessons done across all groups of this teacher
          const teacherLessonsThisMonth = attendanceRecords.filter(
            (r) => assignedGroupIds.has(r.groupId) && r.date.startsWith(currentMonthStr)
          ).length;

          return (
            <div
              key={teacher.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-xs"
                    >
                      {teacher.firstName && teacher.surname
                        ? `${teacher.firstName.charAt(0)}${teacher.surname.charAt(0)}`
                        : teacher.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{teacher.name}</h3>
                        {teacher.title && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {teacher.title}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{teacher.subject || 'Instructor'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTeacherToEdit(teacher);
                      setIsTeacherModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit Teacher"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Contact info */}
                <div className="space-y-2 bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="font-medium truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{teacher.phone}</span>
                  </div>
                </div>

                {/* Stats summary */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-base font-black text-slate-900 dark:text-white">{assignedGroups.length}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Cohorts</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-base font-black text-slate-900 dark:text-white">{teacherStudents.length}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Students</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-base font-black text-slate-900 dark:text-white">
                      {teacherLessonsThisMonth}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Sessions Logged</div>
                  </div>
                </div>

                {/* Assigned Groups list */}
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Assigned Cohorts ({assignedGroups.length})
                  </div>
                  {assignedGroups.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No groups assigned to this instructor.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {assignedGroups.map((g) => (
                        <div
                          key={g.id}
                          onClick={() => onSelectGroup(g.id)}
                          className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{g.name}</span>
                            <span className="text-slate-500 dark:text-slate-400 ml-1.5 font-normal">({g.schedule})</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teacher Modal */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => {
          setIsTeacherModalOpen(false);
          setTeacherToEdit(null);
        }}
        teacherToEdit={teacherToEdit}
      />
    </div>
  );
};
