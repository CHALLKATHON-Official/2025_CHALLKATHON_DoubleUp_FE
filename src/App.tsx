// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginHome from "./pages/LoginHome";
import Welcome from "./pages/Welcome";
import Calendar from "./pages/Calendar";
import Friends from "./pages/Friends";
import Settings from "./pages/Settings";
import TimerPage from "./pages/TimerPage";
import NotFound from "./pages/NotFound";
import Stats from "./pages/Stats";
import Theme from "./pages/Theme";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginhome" element={<LoginHome />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* 로그인한 사용자만 접근 가능 */}
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/timer" element={<ProtectedRoute><TimerPage /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
        <Route path="/theme" element={<ProtectedRoute><Theme /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;