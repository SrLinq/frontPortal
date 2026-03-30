/**
 * Application root entry point.
 * Sets up React Router for client-side navigation and
 * renders the global Navbar + page routes.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProjectsDashboard from "./pages/ProjectsDashboard/ProjectsDashboard";
import UserPage from "./pages/User/User";
import FirstPage from "./pages/Home/Home";
import Job from "./pages/Jobs/Jobs";
import Freelancers from "./pages/Freelancers/Freelancers";
import Navbar from "./components/Navbar/Navbar";
import JobPage from "./pages/Jobs/JobDetails";
import PostJob from "./pages/PostJob/PostJob";
import FreelancerPage from "./pages/Freelancers/FreelancerDetails";

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
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/freelancer/:freelancerId" element={<FreelancerPage />} />
      </Routes>
      {/* Global toast notification container — placed after Routes to avoid
          breaking the #root > div:first-of-type CSS selector used by Navbar */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid #333",
          },
          success: { iconTheme: { primary: "#00f2fe", secondary: "#1a1a2e" } },
          error: { iconTheme: { primary: "#f55", secondary: "#1a1a2e" } },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
);
