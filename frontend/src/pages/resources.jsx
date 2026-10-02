import "./resources.css";

function Resources() {
  const resources = [
    {
      icon: "💻",
      type: "COURSE",
      title: "Web Development",
      description:
        "Learn HTML, CSS and JavaScript from beginner to advanced level.",
      button: "Start Learning",
    },
    {
      icon: "🐍",
      type: "COURSE",
      title: "Python Programming",
      description:
        "Build your programming foundation and learn Python step by step.",
      button: "Start Learning",
    },
    {
      icon: "🤖",
      type: "AI & ML",
      title: "Artificial Intelligence",
      description:
        "Explore AI, Machine Learning and practical projects.",
      button: "Explore AI",
    },
    {
      icon: "🗄️",
      type: "DATABASE",
      title: "SQL & Databases",
      description:
        "Learn SQL queries, databases and data management concepts.",
      button: "Learn SQL",
    },
    {
      icon: "🎨",
      type: "PRACTICE",
      title: "UI/UX Design",
      description:
        "Improve your design skills and create attractive user interfaces.",
      button: "Practice Design",
    },
    {
      icon: "🚀",
      type: "PROJECT",
      title: "Project Ideas",
      description:
        "Build real-world projects to improve your skills and portfolio.",
      button: "View Projects",
    },
  ];

  return (
    <div className="resources-page">

      {/* HEADER */}
      <section className="resources-header">
        <span className="resources-label">
          LEARNING HUB
        </span>

        <h1>
          Learn. Practice. <span>Grow.</span>
        </h1>

        <p>
          Explore carefully selected resources to build the
          skills required for your target career.
        </p>
      </section>

      {/* SEARCH */}
      <div className="resource-search">
        <span>🔍</span>

        <input
          type="text"
          placeholder="Search courses, skills or resources..."
        />
      </div>

      {/* RESOURCE CARDS */}
      <section className="resources-grid">

        {resources.map((resource, index) => (
          <div
            className="resource-box"
            key={index}
          >

            <div className="resource-icon">
              {resource.icon}
            </div>

            <span className="resource-type">
              {resource.type}
            </span>

            <h2>
              {resource.title}
            </h2>

            <p>
              {resource.description}
            </p>

            <button
              onClick={() =>
                alert(`${resource.title} resources coming soon!`)
              }
            >
              {resource.button}
              <span> →</span>
            </button>

          </div>
        ))}

      </section>

      {/* BOTTOM CTA */}
      <section className="resources-cta">

        <div className="cta-icon">
          🎯
        </div>

        <div>
          <h2>
            Not sure what to learn?
          </h2>

          <p>
            Complete your career assessment and discover
            the skills you should focus on.
          </p>
        </div>

        <button
          onClick={() =>
            alert("Career Assessment coming soon!")
          }
        >
          Take Career Test →
        </button>

      </section>

    </div>
  );
}

export default Resources;