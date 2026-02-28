import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectsDashboard from "./pages/ProjectsDashboard/ProjectsDashboard";
import UserPage from "./pages/User/User";
import FirstPage from "./pages/Home/Home";
import Job from "./pages/Jobs/Jobs";
import Freelancers from "./pages/Freelancers/Freelancers";
import Navbar from "./components/Navbar/Navbar";
import JobPage from "./pages/Jobs/JobDetails";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/" element={<FirstPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/job/:jobId" element={<JobPage />} />
        <Route path="/projects" element={<ProjectsDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
