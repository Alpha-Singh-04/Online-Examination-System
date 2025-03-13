import { Search, Filter, Download, PlusCircle, Calendar, Eye, Edit, Trash2 } from "lucide-react"
import { Pagination } from "../Pagination"

export const ExamsTab = ({ isDarkMode, exams }) => {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          className={`relative flex items-center gap-2 rounded-lg px-3 py-2 ${
            isDarkMode ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200"
          }`}
        >
          <Search className={`w-4 h-4 ${isDarkMode ? "text-white/70" : "text-gray-500"}`} />
          <input
            type="text"
            placeholder="Search exams..."
            className={`bg-transparent border-none outline-none text-sm w-48 md:w-64 ${
              isDarkMode ? "text-white placeholder:text-white/50" : "text-gray-800 placeholder:text-gray-500"
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "bg-white/5 border border-white/10 hover:bg-white/10"
                : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Filter className={`w-4 h-4 ${isDarkMode ? "text-white/70" : "text-gray-500"}`} />
          </button>
          <button
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "bg-white/5 border border-white/10 hover:bg-white/10"
                : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Download className={`w-4 h-4 ${isDarkMode ? "text-white/70" : "text-gray-500"}`} />
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDarkMode ? "bg-purple-500 hover:bg-purple-400 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Exam</span>
          </button>
        </div>
      </div>

      {/* Exams Table */}
      <div
        className={`rounded-xl overflow-hidden ${
          isDarkMode ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                <th className={`text-left py-3 px-4 ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>Title</th>
                <th className={`text-left py-3 px-4 ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>Subject</th>
                <th className={`text-left py-3 px-4 ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>Date</th>
                <th className={`text-left py-3 px-4 ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>Status</th>
                <th className={`text-center py-3 px-4 ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>Students</th>
                <th className={`text-right py-3 px-4 ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 ? (
                exams.map((exam, index) => (
                  <tr
                    key={exam._id || index}
                    className={`border-b last:border-b-0 ${isDarkMode ? "border-white/10" : "border-gray-100"} hover:${
                      isDarkMode ? "bg-white/5" : "bg-gray-50"
                    }`}
                  >
                    <td className={`py-3 px-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {exam.title || `Exam ${index + 1}`}
                    </td>
                    <td className={`py-3 px-4 ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>
                      {exam.subject || "Mathematics"}
                    </td>
                    <td className="py-3 px-4">
                      <div className={`flex items-center gap-1 ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>
                        <Calendar className="w-4 h-4" />
                        <span>{exam.date || "2025-03-20"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          (exam.status || (index % 3 === 0 ? "pending" : index % 2 === 0 ? "completed" : "active")) ===
                          "pending"
                            ? isDarkMode
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-yellow-100 text-yellow-800"
                            : (exam.status ||
                                  (index % 3 === 0 ? "pending" : index % 2 === 0 ? "completed" : "active")) ===
                                "completed"
                              ? isDarkMode
                                ? "bg-green-500/20 text-green-300"
                                : "bg-green-100 text-green-800"
                              : isDarkMode
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {exam.status || (index % 3 === 0 ? "Pending" : index % 2 === 0 ? "Completed" : "Active")}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-center ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>
                      {exam.students || Math.floor(Math.random() * 50 + 10)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                          <Eye className={`w-4 h-4 ${isDarkMode ? "text-white/70" : "text-gray-500"}`} />
                        </button>
                        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                          <Edit className={`w-4 h-4 ${isDarkMode ? "text-white/70" : "text-gray-500"}`} />
                        </button>
                        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                          <Trash2 className={`w-4 h-4 ${isDarkMode ? "text-white/70" : "text-gray-500"}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={`py-4 text-center ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>
                    No exams found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          isDarkMode={isDarkMode}
          totalItems={exams.length}
          itemsPerPage={10}
          currentPage={1}
          itemName="exams"
        />
      </div>
    </div>
  )
}

