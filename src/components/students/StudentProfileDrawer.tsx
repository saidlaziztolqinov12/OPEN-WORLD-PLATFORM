import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Student } from '../../types';
import { useData } from '../../context/DataContext';
import { X, User, Phone, Calendar, BookOpen, Clock, Award, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

interface StudentProfileDrawerProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  student,
  isOpen,
  onClose
}) => {
  const { groups, teachers, attendanceRecords, groupActivityLogs } = useData();

  if (!isOpen || !student) return null;

  const currentGroup = student.groupId ? groups.find((g) => g.id === student.groupId) : null;
  const currentGroupTeacher = currentGroup
    ? teachers.find((t) => t.id === currentGroup.teacherId)
    : null;

  const previousGroup = student.previousGroupId
    ? groups.find((g) => g.id === student.previousGroupId)
    : null;
  const previousGroupTeacher = previousGroup
    ? teachers.find((t) => t.id === previousGroup.teacherId)
    : null;

  // Gather group logs involving this student
  const studentName = `${student.firstName} ${student.surname}`;
  const studentLogs = groupActivityLogs.filter(
    (log) => log.description.toLowerCase().includes(student.firstName.toLowerCase()) &&
             log.description.toLowerCase().includes(student.surname.toLowerCase())
  );

  // Calculate attendance for current group
  const currentGroupRecords = student.groupId
    ? attendanceRecords.filter((r) => r.groupId === student.groupId)
    : [];

  let currentPresent = 0;
  let currentAbsent = 0;
  currentGroupRecords.forEach((rec) => {
    const status = rec.statusMap[student.id];
    if (status === 'present') currentPresent++;
    else if (status === 'absent') currentAbsent++;
  });
  const currentTotal = currentPresent + currentAbsent;
  const currentRate = currentTotal > 0 ? Math.round((currentPresent / currentTotal) * 100) : 0;

  // Calculate attendance for previous group if exists
  const pastGroupRecords = student.previousGroupId
    ? attendanceRecords.filter((r) => r.groupId === student.previousGroupId)
    : [];

  let pastPresent = 0;
  let pastAbsent = 0;
  pastGroupRecords.forEach((rec) => {
    const status = rec.statusMap[student.id];
    if (status === 'present') pastPresent++;
    else if (status === 'absent') pastAbsent++;
  });
  const pastTotal = pastPresent + pastAbsent;
  const pastRate = pastTotal > 0 ? Math.round((pastPresent / pastTotal) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <AnimatePresence>
        <motion.div
          initial={{ x: '100%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-indigo-600/25">
                {student.firstName.charAt(0)}{student.surname.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {student.firstName} {student.surname}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                    ID: #{student.studentId || student.id.slice(-5)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                      student.status === 'inactive'
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                    }`}
                  >
                    {student.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" />
                  Parent Phone
                </div>
                <div className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                  {student.parentPhone}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  Birthdate
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {student.birthDate || 'Not specified'}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  Current Group
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {currentGroup ? currentGroup.name : 'Unassigned'}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Enrolled Date
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {student.enrolledDate}
                </div>
              </div>
            </div>

            {/* Notes if any */}
            {student.notes && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold block mb-1">Student Notes:</span>
                {student.notes}
              </div>
            )}

            {/* Current Group Attendance & Performance */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Current Group Attendance Summary
              </h3>
              {currentGroup ? (
                <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {currentGroup.name}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Instructor: <span className="font-bold">{currentGroupTeacher?.name || 'Assigned Staff'}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                        {currentRate}%
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Attendance</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/60 text-xs font-semibold">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Present: {currentPresent} sessions</span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                      <XCircle className="w-4 h-4" />
                      <span>Absent: {currentAbsent} sessions</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-500 italic text-center">
                  Student is currently not enrolled in any active group.
                </div>
              )}
            </div>

            {/* Historical Record Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Historical Record & Past Groups
                </h3>
              </div>

              {previousGroup ? (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                          Past Cohort
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                          {previousGroup.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Instructor: <span className="font-bold">{previousGroupTeacher?.name || 'Staff'}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-slate-800 dark:text-slate-200">
                          {pastRate}%
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Past Attendance</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Present: {pastPresent}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Absent: {pastAbsent}</span>
                      </div>
                    </div>

                    {student.transferDate && (
                      <p className="text-[11px] text-slate-400 italic">
                        Transferred / Updated on: {new Date(student.transferDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-500 italic text-center">
                  No previous group transfers recorded in history.
                </div>
              )}

              {/* Activity Timeline / History Logs */}
              {studentLogs.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Enrollment & Transfer Activity Log
                  </span>
                  <div className="space-y-2">
                    {studentLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {log.actionType.replace(/_/g, ' ')}
                          </span>
                          <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          {log.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
