import React from "react"

export const StatCard = ({ title, value, icon, trend, isDarkMode }) => {
  return (
    <div
      className={`rounded-xl p-6 ${
        isDarkMode ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>{title}</p>
          <h4 className={`text-2xl font-bold mt-1 ${isDarkMode ? "text-white" : "text-blue-950"}`}>
            {value.toLocaleString()}
          </h4>
        </div>
        <div className={`p-3 rounded-lg ${isDarkMode ? "bg-purple-500/20" : "bg-blue-100"}`}>
          {React.cloneElement(icon, {
            className: `w-6 h-6 ${isDarkMode ? "text-purple-300" : "text-blue-600"}`,
          })}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <span className={`text-sm font-medium ${trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
          {trend}
        </span>
        <span className={`text-sm ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>since last month</span>
      </div>
    </div>
  )
}

