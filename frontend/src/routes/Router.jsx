import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import FleetList from "../pages/FleetList.jsx";
import FleetDetail from "../pages/FleetDetail.jsx";
import BookJet from "../pages/BookJet.jsx";
import MyTrips from "../pages/MyTrips.jsx";
import TripDetail from "../pages/TripDetail.jsx";
import Profile from "../pages/Profile.jsx";
import AdminFleet from "../pages/AdminFleet.jsx";
import AdminBookings from "../pages/AdminBookings.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/fleet" element={<FleetList />} />
      <Route path="/fleet/:id" element={<FleetDetail />} />
      <Route path="/book/:id" element={<BookJet />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<MyTrips />} />
        <Route path="/trips/:id" element={<TripDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/fleet" element={<AdminFleet />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
      </Route>

      <Route path="*" element={<div className="container-xl" style={{ padding: "48px 0" }}>Not Found</div>} />
    </Routes>
  );
}
