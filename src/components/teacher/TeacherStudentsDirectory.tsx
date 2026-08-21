import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { StudentModal } from '../students/StudentModal';
import {
  Users,
  Search,
  Plus,
  ArrowUpDown,
  BookOpen,
  Calendar,
  Phone,
  FileText
} from 'lucide-react';

interface TeacherStudentsDirectoryProps {
  onSelectGroup: (groupId: string) => void;
}

export const TeacherStudentsDirectory: React.FC<TeacherStudentsDirectoryProps> = ({
  onSelectGroup: _onSelectGroup
}) => {
  const { currentUser } = useAuth();
  const { students, groups } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('oldest');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  // Floating hover card state
  const [hoveredStudent, setHoveredStudent] = useState<{
    student: Student;
    rect: DOMRect;
  } | null>(null);

  // Scoped strictly to the active teacher's groups
  const myGroups = useMemo(() => {
    return groups.filter((g) => g.teacherId === currentUser?.id);
  }, [groups, currentUser]);

  const myGroupIds = useMemo(() => {
    return new Set(myGroups.map((g) => g.id));
  }, [myGroups]);

  // Filter and sort students belonging only to this teacher
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => myGroupIds.has(s.groupId))
      .filter((s) => {
        const fullName = `${s.firstName} ${s.surname}`.toLowerCase();
        const matchesSearch = !searchQuery.trim() || fullName.includes(searchQuery.trim().toLowerCase());
        const matchesGroup = selectedGroupFilter === 'all' || s.groupId === selectedGroupFilter;
        return matchesSearch && matchesGroup;
      })
      .sort((a, b) => {
        const dateA = new Date(a.enrolledDate || 0).getTime();
        const dateB = new Date(b.enrolledDate || 0).getTime();
        return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
      });
  }, [students, myGroupIds, searchQuery, selectedGroupFilter, sortOrder]);

  const totalMyStudents = useMemo(() => {
    return students.filter((s) => myGroupIds.has(s.groupId)).length;
  }, [students, myGroupIds]);

  const handleAddNew = () => {
    setStudentToEdit(null);
    setIsStudentModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border-none shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full w-fit mb-1.5 border border-indigo-200/60 dark:border-indigo-800/60">
            <Users className="w-3.5 h-3.5" />
            <span>Assigned Roster</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Students
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete list of students enrolled in your groups
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNew}
            disabled={myGroups.length === 0}
            className="px-4 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll in Class</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border-none shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-xs sm:text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter and Sort controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Group Filter */}
          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-semibold text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 outline-none flex-1 sm:flex-none"
          >
            <option value="all">My Groups ({totalMyStudents})</option>
            {myGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Sort order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'oldest' ? 'newest' : 'oldest')}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all hover:-translate-y-0.5 active:scale-95 shrink-0 cursor-pointer"
            title="Toggle chronological sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">
              {sortOrder === 'oldest' ? 'Added: Oldest First' : 'Added: Newest First'}
            </span>
          </button>
        </div>
      </div>

      {/* Directory Table / Minimalist Flat List */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border-none overflow-hidden shadow-xs transition-colors">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
            </span>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
            {searchQuery
              ? `No students found matching "${searchQuery}".`
              : 'No students enrolled in your groups yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-100 dark:border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3 w-16">#</th>
                  <th className="px-5 py-3">Student Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredStudents.map((student, idx) => {
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: Math.min(idx * 0.015, 0.25) }}
                      onClick={() => {
                        setStudentToEdit(student);
                        setIsStudentModalOpen(true);
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredStudent({ student, rect });
                      }}
                      onMouseLeave={() => setHoveredStudent(null)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3 text-slate-400 dark:text-slate-500 font-mono text-xs w-16">
                        {idx + 1}
                      </td>

                      {/* Student Name */}
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                            {student.firstName.charAt(0)}
                            {student.surname.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                              <span>{student.firstName} {student.surname}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Hover Tooltip Card */}
      <AnimatePresence>
        {hoveredStudent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: Math.max(16, Math.min(window.innerHeight - 240, hoveredStudent.rect.top - 8)),
              left: Math.min(window.innerWidth - 320, hoveredStudent.rect.left + Math.min(hoveredStudent.rect.width * 0.35, 300)),
              zIndex: 60,
              pointerEvents: 'none'
            }}
            className="w-72 bg-slate-900/95 dark:bg-slate-950/95 text-white p-4 rounded-md shadow-2xl border border-slate-700/80 dark:border-slate-800 backdrop-blur-md space-y-2.5 text-xs select-none"
          >
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
              <div className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {hoveredStudent.student.firstName.charAt(0)}
                {hoveredStudent.student.surname.charAt(0)}
              </div>
              <div className="font-bold text-sm text-white truncate">
                {hoveredStudent.student.firstName} {hoveredStudent.student.surname}
              </div>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                  <BookOpen className="w-3 h-3 text-indigo-400" />
                  <span>Group:</span>
                </span>
                <span className="font-semibold text-slate-100 truncate text-right">
                  {groups.find((g) => g.id === hoveredStudent.student.groupId)?.name || 'My Group'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  <span>Birthdate:</span>
                </span>
                <span className="font-semibold text-slate-100">
                  {hoveredStudent.student.birthDate
                    ? new Date(hoveredStudent.student.birthDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'Not specified'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                  <Phone className="w-3 h-3 text-indigo-400" />
                  <span>Phone:</span>
                </span>
                <span className="font-semibold font-mono text-indigo-300">
                  {hoveredStudent.student.parentPhone || '—'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span>Teacher Note:</span>
                </span>
                <p className="text-slate-300 italic text-[11px] leading-relaxed line-clamp-3">
                  {hoveredStudent.student.notes ? hoveredStudent.student.notes : 'None'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Enrollment / Edit Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setStudentToEdit(null);
        }}
        groupId={myGroups[0]?.id || ''}
        studentToEdit={studentToEdit}
      />
    </div>
  );
};
