import { useState } from "react";
import "./ProjectsDashboard.css";

// Interface for mock project data
interface Project {
  id: number;
  title: string;
  type: string;
  status: "active" | "completed" | "draft";
  budget: number;
  proposals: number;
  postedAt: string;
}

function ProjectsDashboard() {
  // Mock data for business's projects
  const [projects] = useState<Project[]>([
    {
      id: 1,
      title: "E-commerce Website Re-design",
      type: "Fixed Price",
      status: "active",
      budget: 1500,
      proposals: 12,
      postedAt: "2 days ago",
    },
    {
      id: 2,
      title: "Mobile App MVP for Delivery Service",
      type: "Hourly",
      status: "active",
      budget: 3500,
      proposals: 5,
      postedAt: "1 week ago",
    },
    {
      id: 3,
      title: "Python Web Scraper Builder",
      type: "Fixed Price",
      status: "completed",
      budget: 800,
      proposals: 23,
      postedAt: "1 month ago",
    },
  ]);

  return (
    <div className="projects-dashboard-container">
      <div className="projects-header">
        <div>
          <h1>My Projects</h1>
          <p>Manage your posted jobs and review proposals</p>
        </div>
        <button
          className="create-project-btn"
          onClick={() => window.location.assign("/post-job")}
        >
          + Post a New Job
        </button>
      </div>

      <div className="projects-stats-row">
        <div className="stat-card">
          <h3>Active Projects</h3>
          <span className="stat-value">2</span>
        </div>
        <div className="stat-card">
          <h3>Total Proposals</h3>
          <span className="stat-value">17</span>
        </div>
        <div className="stat-card">
          <h3>Completed Jobs</h3>
          <span className="stat-value">1</span>
        </div>
      </div>

      <div className="projects-list-section">
        <div className="projects-controls">
          <input type="text" placeholder="Search projects..." className="search-input" />
          <select className="filter-select">
            <option value="all">All Projects</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-header">
                <div>
                  <span className={`status-badge ${project.status}`}>{project.status}</span>
                  <span className="project-type">{project.type}</span>
                </div>
                <div className="project-budget">${project.budget}</div>
              </div>
              
              <h2 className="project-title">{project.title}</h2>
              
              <div className="project-card-footer">
                <span className="proposals-count">
                  <strong>{project.proposals}</strong> Proposals
                </span>
                <span className="posted-time">Posted {project.postedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsDashboard;
