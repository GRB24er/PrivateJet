import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { isAuthed, bootstrapping } = useAuth();
  const loc = useLocation();

  if (bootstrapping) return <div className="container-xl" style={{ padding: 24 }}>Loading…</div>;
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: loc }} />;

  return <Outlet />;
}
