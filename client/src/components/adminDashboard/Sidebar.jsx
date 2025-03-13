"use client"
import { Users, BookOpen, PieChart, Settings } from "lucide-react"

export const Sidebar = ({ isDarkMode, activeTab, setActiveTab }) => {
  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 w-16 md:w-56 z-20 flex flex-col ${
        isDarkMode ? "bg-gray-900/50 border-r border-white/10" : "bg-white/80 border-r border-gray-200"
      } backdrop-blur-lg`}
    >
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          <NavItem
            title="Overview"
            icon={<PieChart className="w-5 h-5" />}
            isActive={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            isDarkMode={isDarkMode}
          />
          <NavItem
            title="Users"
            icon={<Users className="w-5 h-5" />}
            isActive={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            isDarkMode={isDarkMode}
          />
          <NavItem
            title="Exams"
            icon={<BookOpen className="w-5 h-5" />}
            isActive={activeTab === "exams"}
            onClick={() => setActiveTab("exams")}
            isDarkMode={isDarkMode}
          />
          <NavItem
            title="Settings"
            icon={<Settings className="w-5 h-5" />}
            isActive={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            isDarkMode={isDarkMode}
          />
        </ul>
      </nav>
    </aside>
  )
}

const NavItem = ({ title, icon, isActive, onClick, isDarkMode }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg ${
          isActive
            ? isDarkMode
              ? "bg-white/10 text-white"
              : "bg-blue-50 text-blue-700"
            : isDarkMode
              ? "text-white/70 hover:bg-white/5"
              : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {icon}
        <span className="hidden md:inline">{title}</span>
      </button>
    </li>
  )
}

