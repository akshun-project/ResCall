 import { useUser, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { getData } from "../utils/storage";

export default function ProtectedRoute({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  // 🔒 Not logged in
  if (!user) {
    return <RedirectToSignIn />;
  }

  // 📊 Check resume data
  const data = getData(`aiData_${user.id}`);

  // 🚨 No resume → force resume page
  if (!data) {
    return <Navigate to="/resume" replace />;
  }

  return children;
}