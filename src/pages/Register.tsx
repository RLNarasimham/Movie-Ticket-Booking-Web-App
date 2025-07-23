import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import { sendEmailVerification } from "firebase/auth";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
      });
      await sendEmailVerification(userCredential.user);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Film className="h-10 w-10 text-green-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                Success!
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Account Created
            </h2>
            <p className="text-gray-600 mb-4">
              We've sent a verification email to{" "}
              <strong>{formData.email}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Please check your email and click the verification link before
              signing in. Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8">
          <div className="text-center dark:text-white">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Film className="h-10 w-10 text-red-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
              SHOWTIMEGO
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Join us to book your favorite movies
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-300">Already have an account? </span>
              <Link
                to="/login"
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
