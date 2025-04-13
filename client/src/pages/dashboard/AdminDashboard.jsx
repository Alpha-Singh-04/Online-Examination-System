
import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Header } from "../../components/adminDashboard/Header"
import { Sidebar } from "../../components/adminDashboard/Sidebar"
import { Overview } from "../../components/adminDashboard/Overview"
import { UsersTab } from "../../components/adminDashboard/Tabs/UsersTab"
import { ExamsTab } from "../../components/adminDashboard/Tabs/ExamsTab"
import { SettingsTab } from "../../components/adminDashboard/Tabs/SettingsTab"

const AdminDashboard = () => {
  console.log('AdminDashboard');

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [users, setUsers] = useState([])
  const [exams, setExams] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  
  useEffect(() => {
    setIsVisible(true);
    if (!user) return;
  
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      console.log("Admin token:", token); // Confirm token exists
  
      if (!token) {
        console.error("No token found.");
        return;
      }
  
      try {
        const usersResponse = await fetch("/api/admin/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const usersData = await usersResponse.json();
        console.log("Users data:", usersData);
        setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
  
        const examsResponse = await fetch("/api/admin/exams", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const examsData = await examsResponse.json();
        console.log("Exams data:", examsData);
        setExams(Array.isArray(examsData) ? examsData : examsData.exams || []);
  
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [user]);

  if (!Array.isArray(users)) {
    console.warn("Users is not an array:", users);
    return <div>Invalid user data</div>;
  }
  

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-violet-900"
          : "bg-gradient-to-br from-blue-50 via-sky-100 to-blue-50"
      }`}
    >
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <Sidebar isDarkMode={isDarkMode} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main
        className={`pt-16 pl-16 md:pl-56 min-h-screen transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-blue-950"}`}>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "exams" && "Exam Management"}
              {activeTab === "settings" && "System Settings"}
            </h2>
            <p className={`mt-1 ${isDarkMode ? "text-white/70" : "text-gray-600"}`}>
              {activeTab === "overview" && "Monitor system performance and key metrics"}
              {activeTab === "users" && "Manage user accounts and permissions"}
              {activeTab === "exams" && "Create and manage examination activities"}
              {activeTab === "settings" && "Configure system parameters and preferences"}
            </p>
          </div>

          {isLoading ? (
            // Loading state with skeletons
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`h-28 rounded-xl animate-pulse ${isDarkMode ? "bg-white/5" : "bg-gray-200"}`}
                ></div>
              ))}
            </div>
          ) : (
            <>
              {activeTab === "overview" && <Overview isDarkMode={isDarkMode} users={users} exams={exams} />}

              {activeTab === "users" && <UsersTab isDarkMode={isDarkMode} users={users} />}

              {activeTab === "exams" && <ExamsTab isDarkMode={isDarkMode} exams={exams} />}

              {activeTab === "settings" && <SettingsTab isDarkMode={isDarkMode} />}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard;

