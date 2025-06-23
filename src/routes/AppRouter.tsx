import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import LoginHome from "../pages/LoginHome";
import Welcome from "../pages/Welcome";
import Calendar from "../pages/Calendar";
import Friends from "../pages/Friends";
import Settings from "../pages/Settings";
import Timer from "../pages/Timer";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginhome" element={<LoginHome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;