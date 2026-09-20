import { useState } from "react";
import "./Assessment.css";

function Assessment() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="assessment-page">
      <div className="assessment-card">

        <h1>Career Assessment 🎯</h1>

        <p>
          Tell us about yourself and discover career paths
          that match your interests and skills.
        </p>

        {submitted ? (
          <div className="success-message">
            <h2>Assessment Submitted! 🎉</h2>
            <p>
              Your information has been recorded.
              Career recommendations will appear here soon.
            </p>

            <button onClick={() => setSubmitted(false)}>
              Edit Answers
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <label>Education</label>
            <select required>
              <option value="">Select your education</option>
              <option>10th</option>
              <option>12th</option>
              <option>Diploma</option>
              <option>Undergraduate</option>
              <option>Postgraduate</option>
            </select>

            <label>What are your interests?</label>
            <input
              type="text"
              placeholder="Example: Coding, Design, Business"
              required
            />

            <label>What are your skills?</label>
            <input
              type="text"
              placeholder="Example: JavaScript, Communication"
              required
            />

            <label>Which field interests you?</label>
            <select required>
              <option value="">Select a field</option>
              <option>Technology</option>
              <option>Business</option>
              <option>Design</option>
              <option>Healthcare</option>
              <option>Engineering</option>
              <option>Arts & Media</option>
              <option>Other</option>
            </select>

            <label>What is your career goal?</label>
            <textarea
              placeholder="Tell us about your career goal..."
              rows="4"
              required
            ></textarea>

            <button type="submit">
              Get Career Recommendations 🚀
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

export default Assessment;