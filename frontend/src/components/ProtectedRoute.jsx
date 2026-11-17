import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children }) {
  return localStorage.getItem("ngoUser") ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
}
