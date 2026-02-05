import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectsDashboard from "./projectDashboard/projectsDashboard";
import UserPage from "./userPage/user";
import MainPage from "./mainPage/mainPage";
import Auth from "./auth/auth";
import FirstPage from "./firstPage/first";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/projects" element={<ProjectsDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
