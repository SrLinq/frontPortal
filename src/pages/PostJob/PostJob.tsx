import React, { useState } from "react";
import "./PostJob.css";

function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "fixed", // or hourly
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate job posting
    console.log("Job posted:", formData);
    alert("Job posted successfully!");
    setFormData({ title: "", description: "", price: "", type: "fixed" });
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
    </div>
  );
}

export default PostJob;
