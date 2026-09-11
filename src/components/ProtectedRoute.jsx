import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
