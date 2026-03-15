import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostJob.css";
import { useAuthStore } from "../../store/authStore";
import { get, post } from "../../api/api";
import JobPost from "../../components/JobPost/JobPost";

function PostJob() {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated || role !== "business") {
    window.location.href = "/";
  }
  const [myJobs, setMyJobs] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "fixed", // or hourly
  });
  useEffect(() => {
    const async = async () => {
      const data = await get<any>("/job/my-jobs");
      setMyJobs(data);
    };
    async();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      budget: Number(formData.price),
      type: formData.type,
    };
    const res = await post("/job", payload);
    if (res) {
      alert("Job posted successfully!");
      setFormData({ title: "", description: "", price: "", type: "fixed" });
      navigate("/jobs");
    } else {
      alert("Failed to post job");
    }
  };

  return (
    <div className="post-job-container">
      <div className="post-job-header">
        <h1>Post a New Job</h1>
        <p>Find the best freelancers for your business projects</p>
      </div>

      <div className="post-job-form-wrapper">
        <form className="post-job-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Build a React Application"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="type">Project Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>
            <div className="form-group half-width">
              <label htmlFor="price">Budget ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="e.g. 500"
                value={formData.price}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the requirements for the job in detail..."
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-job-btn">
            Publish Job Posting
          </button>
        </form>
      </div>
      <div>
        {myJobs.map((job: any) => (
          <JobPost
            key={job._id}
            pathTo={`/job/${job._id}`}
            path={job.path}
            title={job.title}
            description={job.description}
            price={job.budget}
          />
        ))}
      </div>
    </div>
  );
}

export default PostJob;
