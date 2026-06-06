import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import MainLayout from "./layouts/MainLayout/MainLayout";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Sobre from "./pages/Sobre/Sobre";
import IoT from "./pages/IoT/IoT";
import Glossario from "./pages/Glossario/Glossario";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import NotFound from "./pages/NotFound/NotFound";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/glossario" element={<Glossario />} />
              <Route path="/iot" element={<IoT />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
