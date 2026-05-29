import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const spinnerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: "#0F172A",
};

const dotStyle = (delay) => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: "#22C55E",
  display: "inline-block",
  margin: "0 4px",
  animation: "pulse 1.2s ease-in-out infinite",
  animationDelay: `${delay}s`,
});

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, ready } = useAuth();

  if (!ready) {
    return (
      <div style={spinnerStyle}>
        <div style={dotStyle(0)} />
        <div style={dotStyle(0.15)} />
        <div style={dotStyle(0.3)} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
