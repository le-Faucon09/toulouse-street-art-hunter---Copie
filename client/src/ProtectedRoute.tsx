import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}


export default function ProtectedRoute({ children }: ProtectedRouteProps) {
const token = localStorage.getItem("token");

//Si l'utilisateur n'est pas connecté → redirection
if (!token) {
    return <Navigate to="/connexion" replace />
}
// Sinon, il peut accéder à la page
return children;
}