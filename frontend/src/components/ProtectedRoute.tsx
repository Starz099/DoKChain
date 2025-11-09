import { Navigate } from "react-router-dom";
import { useRole } from "@/context/role";

interface ProtectedRouteProps {
  allow: "user" | "institution";
  children: React.ReactElement;
  fallback?: string; // path to redirect if not allowed
}

const ProtectedRoute = ({
  allow,
  children,
  fallback = "/",
}: ProtectedRouteProps) => {
  const { role } = useRole();
  if (!role) return <Navigate to={fallback} replace />;
  if (role !== allow) return <Navigate to={fallback} replace />;
  return children;
};

export default ProtectedRoute;
