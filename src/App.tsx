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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginhome" element={<LoginHome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="stats" element={<Stats/>}/>
        <Route path="theme" element={<Theme/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
