import React, { useState, useEffect } from 'react';
import { scheduleExam, updateScheduledExam } from '../services/examService';
import { toast } from 'react-toastify';

const ExamScheduleModal = ({ isOpen, onClose, examToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    duration: 60,
    scheduledDate: '',
    startTime: '',
    endTime: '',
    instructions: '',
    totalStudents: 0
  });

  useEffect(() => {
    if (examToEdit) {
      setFormData({
        title: examToEdit.title,
        subject: examToEdit.subject,
        duration: examToEdit.duration,
        scheduledDate: examToEdit.scheduledDate,
        startTime: examToEdit.startTime,
        endTime: examToEdit.endTime,
        instructions: examToEdit.instructions,
        totalStudents: examToEdit.totalStudents
      });
    }
  }, [examToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.subject || !formData.duration || !formData.scheduledDate || !formData.startTime || !formData.endTime) {
        throw new Error('Please fill all required fields');
      }

      const scheduledDate = new Date(formData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scheduledDate < today) {
        throw new Error('Cannot schedule exam in the past');
      }

      if (examToEdit) {
        await updateScheduledExam(examToEdit._id, formData);
        toast.success('Exam schedule updated successfully!');
      } else {
        await scheduleExam(formData);
        toast.success('Exam scheduled successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to schedule exam');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {examToEdit ? 'Update Exam Schedule' : 'Schedule New Exam'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject*</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)*</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Scheduled Date*</label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time*</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Time*</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  min={formData.startTime}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total Students</label>
              <input
                type="number"
                name="totalStudents"
                value={formData.totalStudents}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {examToEdit ? 'Update Schedule' : 'Schedule Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamScheduleModal; 