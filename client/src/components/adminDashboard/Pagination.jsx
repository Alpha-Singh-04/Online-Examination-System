export const Pagination = ({ isDarkMode, totalItems, itemsPerPage, currentPage, itemName }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 border-t ${isDarkMode ? "border-white/10" : "border-gray-100"}`}
    >
      <p className={`text-sm ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>
        Showing 1-{Math.min(itemsPerPage, totalItems)} of {totalItems} {itemName}
      </p>
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded-md ${
            isDarkMode ? "bg-white/5 text-white/70 hover:bg-white/10" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Previous
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            isDarkMode ? "bg-purple-500 text-white hover:bg-purple-400" : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          1
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            isDarkMode ? "bg-white/5 text-white/70 hover:bg-white/10" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          2
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            isDarkMode ? "bg-white/5 text-white/70 hover:bg-white/10" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  )
}

