import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CrudPage from "./pages/CrudPage";
import Reports from "./pages/Reports";
import "./style.css";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="donors" element={<CrudPage type="donors" />} />
          <Route path="donations" element={<CrudPage type="donations" />} />
          <Route path="volunteers" element={<CrudPage type="volunteers" />} />
          <Route path="events" element={<CrudPage type="events" />} />
          <Route
            path="beneficiaries"
            element={<CrudPage type="beneficiaries" />}
          />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
