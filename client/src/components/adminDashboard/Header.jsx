"use client"

import { useState } from "react"
import { Bell, Search, Moon, Sun } from "lucide-react"

export const Header = ({ isDarkMode, toggleDarkMode }) => {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, message: "New user registration", time: "10 minutes ago", isRead: false },
    { id: 2, message: "Exam results published", time: "2 hours ago", isRead: false },
    { id: 3, message: "System update completed", time: "1 day ago", isRead: true },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 ${
        isDarkMode ? "bg-gray-900/80" : "bg-white/80"
      } backdrop-blur-lg border-b ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-blue-950"}`}>Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div
            className={`hidden md:flex items-center gap-2 rounded-full px-3 py-1.5 ${
              isDarkMode ? "bg-white/10" : "bg-gray-100"
            }`}
          >
            <Search className={`w-4 h-4 ${isDarkMode ? "text-white/70" : "text-gray-500"}`} />
            <input
              type="text"
              placeholder="Search..."
              className={`bg-transparent border-none outline-none text-sm w-48 ${
                isDarkMode ? "text-white placeholder:text-white/50" : "text-gray-800 placeholder:text-gray-500"
              }`}
            />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className={`w-5 h-5 text-white`} /> : <Moon className={`w-5 h-5 text-gray-700`} />}
          </button>

          {/* Notifications */}
          <NotificationsDropdown
            isDarkMode={isDarkMode}
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />

          {/* Profile */}
          <div
            className={`h-8 w-8 rounded-full bg-gradient-to-r ${
              isDarkMode ? "from-purple-500 to-blue-500" : "from-blue-500 to-sky-500"
            } flex items-center justify-center`}
          >
            <span className="text-white text-sm font-medium">A</span>
          </div>
        </div>
      </div>
    </header>
  )
}

const NotificationsDropdown = ({ isDarkMode, notifications, showNotifications, setShowNotifications }) => {
  return (
    <div className="relative">
      <button
        className={`relative p-2 rounded-full ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className={`w-5 h-5 ${isDarkMode ? "text-white" : "text-gray-700"}`} />
        {notifications.filter((n) => !n.isRead).length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {showNotifications && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg ${
            isDarkMode ? "bg-gray-800 border border-white/10" : "bg-white border border-gray-200"
          }`}
        >
          <div className={`p-3 border-b ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
            <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b last:border-0 ${
                  isDarkMode ? "border-white/10 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"
                } ${notification.isRead ? "" : isDarkMode ? "bg-white/5" : "bg-blue-50"}`}
              >
                <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {notification.message}
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? "text-white/70" : "text-gray-500"}`}>{notification.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

