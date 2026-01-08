import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../modules/auth/Login";
import Signup from "../modules/auth/Signup";

import TripList from "../modules/trips/TripList";
import TripDetails from "../modules/trips/TripDetails";
import CreateTrip from "../modules/trips/CreateTrip";

import PublicItinerary from "../modules/sharing/PublicItinerary";
import ProfileSettings from "../modules/profile/ProfileSettings";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* ---------- PUBLIC ROUTES ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/share/:token" element={<PublicItinerary />} />

      {/* ---------- PROTECTED ROUTES ---------- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TripList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-trip"
        element={
          <ProtectedRoute>
            <CreateTrip />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trips/:tripId"
        element={
          <ProtectedRoute>
            <TripDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        }
      />

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
