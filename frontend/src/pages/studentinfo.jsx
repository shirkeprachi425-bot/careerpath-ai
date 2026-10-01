import "./StudentInfo.css";

function StudentInfo({ onContinue }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <div className="student-info-page">
      <div className="student-info-card">

        <div className="student-info-header">
          <div className="student-info-icon">👤</div>

          <h1>Tell Us About Yourself</h1>

          <p>
            Share a few details about yourself so we can
            personalize your career journey.
          </p>
        </div>

        <form
          className="student-info-form"
          onSubmit={handleSubmit}
        >

          <div className="student-field">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="student-field">
            <label>Education</label>
            <select required>
              <option value="">Select education</option>
              <option>10th</option>
              <option>12th</option>
              <option>Diploma</option>
              <option>Graduation</option>
              <option>Post Graduation</option>
            </select>
          </div>

          <div className="student-field full">
            <label>Current Skills</label>
            <input
              type="text"
              placeholder="Example: Python, HTML, SQL"
              required
            />
          </div>

          <div className="student-field">
            <label>Experience</label>
            <select required>
              <option value="">Select experience</option>
              <option>Fresher</option>
              <option>Less than 1 year</option>
              <option>1–3 years</option>
              <option>3+ years</option>
            </select>
          </div>

          <div className="student-field">
            <label>Daily Learning Time</label>
            <select required>
              <option value="">Select time</option>
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
              <option>3+ hours</option>
            </select>
          </div>

          <div className="student-field full">
            <label>Interests</label>
            <input
              type="text"
              placeholder="Example: AI, Web Development, Business"
              required
            />
          </div>

          <button
            type="submit"
            className="student-submit"
          >
            Continue to Assessment →
          </button>

        </form>

      </div>
    </div>
  );
}

export default StudentInfo;