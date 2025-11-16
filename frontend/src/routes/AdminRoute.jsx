// frontend/src/routes/AdminRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute() {
  const { isAuthed, user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return null;
  if (!isAuthed) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
