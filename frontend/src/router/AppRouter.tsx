import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardPage } from "../pages/DashboardPage";
import { FlashcardsPage } from "../pages/FlashcardsPage";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { QuizPage } from "../pages/QuizPage";
import { useAuthStore } from "../store/authStore";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

        <Route
            path="/dashboard"
            element={
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
            }
        />

        <Route path="/quiz" element={
            <ProtectedRoute>
            <QuizPage />
            </ProtectedRoute>
        } />

        <Route
            path="/flashcards"
            element={
                <ProtectedRoute>
                <FlashcardsPage />
                </ProtectedRoute>
            }
            />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}