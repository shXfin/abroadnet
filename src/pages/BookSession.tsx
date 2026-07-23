import { Navigate } from "react-router-dom";

// The free 1-to-1 session isn't booked through a separate contact page:
// taking the assessment IS how you get it (a counselor follows up directly
// from what you submit there). Old links here just go straight to it.
export default function BookSession() {
  return <Navigate to="/#assessment" replace />;
}
