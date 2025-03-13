import { Users, BookOpen, CheckCircle } from "lucide-react"

export const RecentActivity = ({ isDarkMode }) => {
  return (
    <div
      className={`rounded-xl p-6 ${
        isDarkMode ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200"
      }`}
    >
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-blue-950"}`}>Recent Activity</h3>
      <div className={`space-y-4 ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>
        <ActivityItem
          icon={<Users className={`w-4 h-4 ${isDarkMode ? "text-purple-300" : "text-blue-600"}`} />}
          title="New user registered"
          description="John Smith joined as Student"
          time="10 minutes ago"
          isDarkMode={isDarkMode}
        />

        <ActivityItem
          icon={<BookOpen className={`w-4 h-4 ${isDarkMode ? "text-purple-300" : "text-blue-600"}`} />}
          title="New exam created"
          description="Mathematics Final Exam"
          time="2 hours ago"
          isDarkMode={isDarkMode}
        />

        <ActivityItem
          icon={<CheckCircle className={`w-4 h-4 ${isDarkMode ? "text-purple-300" : "text-blue-600"}`} />}
          title="Exam results published"
          description="Chemistry Mid-term Exam"
          time="1 day ago"
          isDarkMode={isDarkMode}
          isLast={true}
        />
      </div>
    </div>
  )
}

const ActivityItem = ({ icon, title, description, time, isDarkMode, isLast = false }) => {
  return (
    <div
      className={`flex items-start gap-3 ${
        !isLast ? `pb-4 border-b ${isDarkMode ? "border-white/10" : "border-gray-100"}` : ""
      }`}
    >
      <div className={`mt-1 p-2 rounded-lg ${isDarkMode ? "bg-purple-500/20" : "bg-blue-100"}`}>{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className={`text-sm ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>{description}</p>
        <p className={`text-xs mt-1 ${isDarkMode ? "text-white/50" : "text-gray-400"}`}>{time}</p>
      </div>
    </div>
  )
}

