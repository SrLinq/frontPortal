import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectsDashboard from "./projectDashboard/projectsDashboard";
import UserPage from "./userPage/user";
import FirstPage from "./firstPage/first";
import Job from "./mainPage/jobs";
import Freelancers from "./mainPage/freelancers";
import Navbar from "./navbar/navbar";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/" element={<FirstPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/projects" element={<ProjectsDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
