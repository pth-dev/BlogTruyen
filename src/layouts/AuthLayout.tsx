import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import AuthBG from "../assets/img/AuthBG.png";

interface AuthLayoutProps {
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  requireAuth = false,
  redirectTo = "/",
}) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user is authenticated but trying to access auth pages (login/register)
  if (
    !requireAuth &&
    isAuthenticated &&
    (location.pathname === "/auth/login" ||
      location.pathname === "/auth/register")
  ) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative z-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Right side - Background image */}
      <div className="hidden lg:block flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${AuthBG})`,
          }}
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
    </div>
  );
};
