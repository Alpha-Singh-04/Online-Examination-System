import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import api from '../../../../server/config/axios';
import { loginSuccess, loginFailure } from '../../redux/features/authSlice';

const FormInput = ({ label, type, register, required, pattern, minLength, errors, icon }) => (
  <div className="relative">
    <label htmlFor={label} className="sr-only">{label}</label>
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      {...register(label, { required, pattern, minLength })}
      type={type}
      className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      placeholder={label.charAt(0).toUpperCase() + label.slice(1)}
      aria-label={label}
    />
    {errors[label] && <p className="text-red-500 text-xs mt-1">{errors[label].message}</p>}
  </div>
);

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError(""); // Clear any previous errors
    try {
      const response = await api.post('/auth/login', data);
  
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }
  
      const { token, role } = response.data;
  
      // Store token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role); // Store the role
  
      // Dispatch Redux login success
      dispatch(loginSuccess(response.data));
  
      console.log("User Role:", role); // Debugging
  
      // Redirect based on role
      if (role === "admin") {
        navigate("/home", { replace: true });
      } else if (role === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else if (role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else {
        throw new Error("Invalid role received from server");
      }
  
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.response?.data?.message || "Login failed");
      dispatch(loginFailure(error.response?.data?.message || "Login failed"));
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md space-y-4">
            <FormInput
              label="email"
              type="email"
              register={register}
              required="Email is required"
              pattern={{
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }}
              errors={errors}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>}
            />
            <FormInput
              label="password"
              type="password"
              register={register}
              required="Password is required"
              minLength={{
                value: 6,
                message: "Password must be at least 6 characters"
              }}
              errors={errors}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>}
            />
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <select
                {...register("role", { required: "Role is required" })}
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;