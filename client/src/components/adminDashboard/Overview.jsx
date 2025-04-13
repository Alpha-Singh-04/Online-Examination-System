import { Users, BookOpen, CheckCircle, Calendar, ChevronRight } from "lucide-react"
import { StatCard } from "./StatCard"
import { RecentActivity } from "./RecentActivity"

export const Overview = ({ isDarkMode, users, exams}) => {
  // Calculate metrics for dashboard
  const activeUsers = users?.filter((user) => user.status === "active").length || 0
  const pendingExams = exams?.filter((exam) => exam.status === "pending").length || 0
  const completedExams = exams?.filter((exam) => exam.status === "completed").length || 0

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={users.length} icon={<Users />} trend="+12%" isDarkMode={isDarkMode} />
        <StatCard title="Active Exams" value={pendingExams} icon={<BookOpen />} trend="+5%" isDarkMode={isDarkMode} />
        <StatCard
          title="Completed Exams"
          value={completedExams}
          icon={<CheckCircle />}
          trend="+18%"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Recent Activity Card */}
      <RecentActivity isDarkMode={isDarkMode} />

      {/* Upcoming Exams Card */}
      <UpcomingExams isDarkMode={isDarkMode} exams={exams} />
    </div>
  )
}

const UpcomingExams = ({ isDarkMode, exams }) => {
  return (
    <div
      className={`rounded-xl p-6 ${
        isDarkMode ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-blue-950"}`}>Upcoming Exams</h3>
        <button
          className={`text-sm flex items-center gap-1 ${
            isDarkMode ? "text-purple-300 hover:text-purple-400" : "text-blue-600 hover:text-blue-700"
          }`}
        >
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className={`w-full ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>
          <thead>
            <tr className={`border-b ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
              <th className="text-left py-3 px-2">Title</th>
              <th className="text-left py-3 px-2">Subject</th>
              <th className="text-left py-3 px-2">Date</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-right py-3 px-2">Students</th>
            </tr>
          </thead>
          <tbody>
            {exams?.slice(0, 3).map((exam, index) => (
              <tr
                key={exam._id || index}
                className={`border-b ${isDarkMode ? "border-white/10" : "border-gray-100"} hover:${
                  isDarkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-2">{exam?.title || `Exam ${index + 1}`}</td>
                <td className="py-3 px-2">{exam.subject || "General"}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{exam.date || "2025-03-20"}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      exam.status === "pending"
                        ? isDarkMode
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-yellow-100 text-yellow-800"
                        : exam.status === "completed"
                          ? isDarkMode
                            ? "bg-green-500/20 text-green-300"
                            : "bg-green-100 text-green-800"
                          : isDarkMode
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {exam.status || "Pending"}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">{exam.students || Math.floor(Math.random() * 50 + 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

