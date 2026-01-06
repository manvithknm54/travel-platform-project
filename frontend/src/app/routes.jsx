import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../modules/auth/Login";
import Signup from "../modules/auth/Signup";
import Dashboard from "../modules/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import PublicItinerary from "../modules/sharing/PublicItinerary";
import TripList from "../modules/trips/TripList";
import TripDetails from "../modules/trips/TripDetails";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Public shared itinerary */}
      <Route path="/share/:token" element={<PublicItinerary />} />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* My Trips */}
      <Route
        path="/my-trips"
        element={
          <ProtectedRoute>
            <TripList />
          </ProtectedRoute>
        }
      />

      {/* ✅ Trip Details (MOST IMPORTANT) */}
      <Route
        path="/trips/:tripId"
        element={
          <ProtectedRoute>
            <TripDetails />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
