export const SettingsTab = ({ isDarkMode }) => {
  return (
    <div className="space-y-6">
      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div
          className={`rounded-xl p-6 ${
            isDarkMode ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200"
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-blue-950"}`}>
            General Settings
          </h3>
          <div className="space-y-4">
            <div className={`flex flex-col gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <label htmlFor="site-name" className="text-sm font-medium">
                Site Name
              </label>
              <input
                type="text"
                id="site-name"
                defaultValue="Education Portal"
                className={`rounded-lg px-3 py-2 ${
                  isDarkMode
                    ? "bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:border-purple-500"
                    : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                } outline-none`}
              />
            </div>

            <div className={`flex flex-col gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <label htmlFor="timezone" className="text-sm font-medium">
                Timezone
              </label>
              <select
                id="timezone"
                className={`rounded-lg px-3 py-2 ${
                  isDarkMode
                    ? "bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:border-purple-500"
                    : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                } outline-none`}
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="GMT">GMT (Greenwich Mean Time)</option>
              </select>
            </div>

            <ToggleSetting label="Enable Notifications" defaultChecked={true} isDarkMode={isDarkMode} />

            <ToggleSetting label="Maintenance Mode" defaultChecked={false} isDarkMode={isDarkMode} />
          </div>

          <div className="mt-6">
            <button
              className={`px-4 py-2 rounded-lg ${
                isDarkMode ? "bg-purple-500 hover:bg-purple-400 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Email Settings */}
        <div
          className={`rounded-xl p-6 ${
            isDarkMode ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200"
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-blue-950"}`}>
            Email Settings
          </h3>
          <div className="space-y-4">
            <div className={`flex flex-col gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <label htmlFor="smtp-host" className="text-sm font-medium">
                SMTP Host
              </label>
              <input
                type="text"
                id="smtp-host"
                defaultValue="smtp.example.com"
                className={`rounded-lg px-3 py-2 ${
                  isDarkMode
                    ? "bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:border-purple-500"
                    : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                } outline-none`}
              />
            </div>

            <div className={`flex flex-col gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <label htmlFor="smtp-port" className="text-sm font-medium">
                SMTP Port
              </label>
              <input
                type="text"
                id="smtp-port"
                defaultValue="587"
                className={`rounded-lg px-3 py-2 ${
                  isDarkMode
                    ? "bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:border-purple-500"
                    : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                } outline-none`}
              />
            </div>

            <div className={`flex flex-col gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <label htmlFor="email-sender" className="text-sm font-medium">
                Sender Email
              </label>
              <input
                type="email"
                id="email-sender"
                defaultValue="noreply@example.com"
                className={`rounded-lg px-3 py-2 ${
                  isDarkMode
                    ? "bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:border-purple-500"
                    : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                } outline-none`}
              />
            </div>

            <ToggleSetting label="Email Notifications" defaultChecked={true} isDarkMode={isDarkMode} />
          </div>

          <div className="mt-6">
            <button
              className={`px-4 py-2 rounded-lg ${
                isDarkMode ? "bg-purple-500 hover:bg-purple-400 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div
        className={`rounded-xl p-6 ${
          isDarkMode ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200"
        }`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-blue-950"}`}>
          Security Settings
        </h3>
        <div className="space-y-4">
          <SecuritySetting
            label="Two-Factor Authentication"
            description="Require 2FA for all admin accounts"
            defaultChecked={false}
            isDarkMode={isDarkMode}
          />

          <div className={`flex items-center justify-between ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <div>
              <span className="font-medium">Session Timeout</span>
              <p className={`text-sm mt-1 ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>
                Automatically log out after inactivity
              </p>
            </div>
            <select
              className={`rounded-lg px-3 py-2 ${
                isDarkMode
                  ? "bg-white/5 border border-white/10 text-white focus:border-purple-500"
                  : "bg-white border border-gray-200 text-gray-900 focus:border-blue-500"
              } outline-none`}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <SecuritySetting
            label="Password Policy"
            description="Enforce strong password requirements"
            defaultChecked={true}
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="mt-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              isDarkMode ? "bg-purple-500 hover:bg-purple-400 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

const ToggleSetting = ({ label, defaultChecked, isDarkMode }) => {
  return (
    <div className={`flex items-center justify-between ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <span className="text-sm font-medium">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div
          className={`w-11 h-6 rounded-full peer ${
            isDarkMode ? "bg-white/10 peer-checked:bg-purple-500" : "bg-gray-200 peer-checked:bg-blue-600"
          } peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 ${
            isDarkMode
              ? "peer-focus:ring-purple-400 peer-focus:ring-offset-gray-900"
              : "peer-focus:ring-blue-300 peer-focus:ring-offset-white"
          } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}
        ></div>
      </label>
    </div>
  )
}

const SecuritySetting = ({ label, description, defaultChecked, isDarkMode }) => {
  return (
    <div className={`flex items-center justify-between ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div>
        <span className="font-medium">{label}</span>
        <p className={`text-sm mt-1 ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div
          className={`w-11 h-6 rounded-full peer ${
            isDarkMode ? "bg-white/10 peer-checked:bg-purple-500" : "bg-gray-200 peer-checked:bg-blue-600"
          } peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 ${
            isDarkMode
              ? "peer-focus:ring-purple-400 peer-focus:ring-offset-gray-900"
              : "peer-focus:ring-blue-300 peer-focus:ring-offset-white"
          } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}
        ></div>
      </label>
    </div>
  )
}

