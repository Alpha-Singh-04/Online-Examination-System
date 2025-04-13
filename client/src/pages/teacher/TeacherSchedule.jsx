import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Search, Plus, Edit2, Trash2, Filter, Loader } from 'lucide-react';
import ExamScheduleModal from '../../components/ExamScheduleModal';
import { getScheduledExams, scheduleExam, updateScheduledExam, deleteScheduledExam } from '../../services/examService';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';

const TeacherSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getScheduledExams();
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch exams. Please try again later.');
      toast.error(err.message || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = () => {
    setExamToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditExam = (exam) => {
    setExamToEdit(exam);
    setIsModalOpen(true);
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;

    try {
      setActionLoading(true);
      await deleteScheduledExam(examId);
      toast.success('Exam deleted successfully');
      await fetchExams();
    } catch (error) {
      toast.error(error.message || 'Failed to delete exam');
    } finally {
      setActionLoading(false);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      setActionLoading(true);
      if (examToEdit) {
        await updateScheduledExam(examToEdit._id, formData);
        toast.success('Exam updated successfully');
      } else {
        await scheduleExam(formData);
        toast.success('Exam scheduled successfully');
      }
      setIsModalOpen(false);
      await fetchExams();
    } catch (error) {
      toast.error(error.message || 'Failed to save exam');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = (exam.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (exam.subject?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesSubject = !filterSubject || exam.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(exams.map(exam => exam.subject).filter(Boolean))];

  const tileContent = ({ date }) => {
    const examOnDate = exams.find(exam => 
      exam.scheduledDate && new Date(exam.scheduledDate).toDateString() === date.toDateString()
    );
    return examOnDate ? (
      <div className="h-2 w-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
    ) : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchExams}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exam Schedule</h1>
        <button
          onClick={handleCreateExam}
          disabled={actionLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {actionLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          Create New Exam
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            className="w-full bg-white rounded-lg shadow p-4"
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredExams.map(exam => (
                <div
                  key={exam._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{exam.title}</h3>
                      <p className="text-gray-600">{exam.subject}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          Date: {new Date(exam.scheduledDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          Time: {exam.startTime} - {exam.endTime}
                        </p>
                        <p className="text-sm">
                          Duration: {exam.duration} minutes
                        </p>
                        <p className="text-sm">
                          Students: {exam.totalStudents || 0}
                        </p>
                        {exam.instructions && (
                          <p className="text-sm text-gray-600">
                            Instructions: {exam.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditExam(exam)}
                        disabled={actionLoading}
                        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                      >
                        <Edit2 className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam._id)}
                        disabled={actionLoading}
                        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredExams.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No exams found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ExamScheduleModal
        isOpen={isModalOpen}
        onClose={() => !actionLoading && setIsModalOpen(false)}
        examToEdit={examToEdit}
        onSubmit={handleModalSubmit}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default TeacherSchedule;