// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
        setTimeout(() => {
      setUser(firebaseUser);
      setLoading(false);
      if (!firebaseUser) {
        navigate("/loginhome");
      }
    }, 1000);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
        <div className="flex space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
        </div>
    );
  }

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;