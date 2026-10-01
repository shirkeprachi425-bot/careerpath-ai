import { useState } from "react";
import "./Assessment.css";

const questions = [
  {
    question:
      "Which Excel feature is mainly used to summarize large amounts of data?",
    options: ["Pivot Table", "Paint", "WordArt", "Page Border"],
    answer: "Pivot Table",
  },
  {
    question:
      "Which SQL command is used to retrieve data from a table?",
    options: ["GET", "SELECT", "FETCHALL", "OPEN"],
    answer: "SELECT",
  },
  {
    question: "What does the average (mean) represent?",
    options: [
      "The middle value",
      "The most frequent value",
      "The sum divided by the number of values",
      "The largest value",
    ],
    answer: "The sum divided by the number of values",
  },
  {
    question:
      "Which tool is commonly used to create interactive data dashboards?",
    options: ["Power BI", "Notepad", "Paint", "Calculator"],
    answer: "Power BI",
  },
  {
    question:
      "Which Python library is commonly used for data analysis?",
    options: ["Pandas", "Turtle", "Tkinter", "Pygame"],
    answer: "Pandas",
  },
];

function Assessment({ career = "Data Analyst", onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer first.");
      return;
    }

    const updatedAnswers = [...answers, selectedAnswer];

    setAnswers(updatedAnswers);
    setSelectedAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((current) => current + 1);
    } else {
      calculateScore(updatedAnswers);
    }
  };

  const calculateScore = (finalAnswers) => {
    let total = 0;

    finalAnswers.forEach((answer, index) => {
      if (answer === questions[index].answer) {
        total++;
      }
    });

    const percentage = Math.round(
      (total / questions.length) * 100
    );

    setScore(total);
    setSubmitted(true);

    const result = {
      career,
      score: total,
      total: questions.length,
      percentage,
    };

    localStorage.setItem(
      "assessmentResult",
      JSON.stringify(result)
    );
  };

  const handleDashboard = () => {
    const result = {
      score,
      total: questions.length,
      percentage,
    };

    if (onComplete) {
      onComplete(result);
    }
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers([]);
    setSubmitted(false);
    setScore(0);
  };

  const percentage = Math.round(
    (score / questions.length) * 100
  );

  return (
    <div className="assessment-page">
      <div className="assessment-card">

        {!submitted ? (
          <>
            {/* HEADER */}

            <div className="assessment-header">
              <span className="assessment-badge">
                🎯 CAREER ASSESSMENT
              </span>

              <h1>{career} Skill Assessment</h1>

              <p>
                Answer the questions to understand your
                current knowledge and identify areas for
                improvement.
              </p>
            </div>

            {/* QUESTION NUMBER */}

            <div className="question-progress">
              <span>
                Question {currentQuestion + 1} of{" "}
                {questions.length}
              </span>

              <strong>
                {Math.round(
                  ((currentQuestion + 1) /
                    questions.length) *
                    100
                )}
                %
              </strong>
            </div>

            {/* PROGRESS BAR */}

            <div className="progress-bar">
              <div
                style={{
                  width: `${
                    ((currentQuestion + 1) /
                      questions.length) *
                    100
                  }%`,
                }}
              />
            </div>

            {/* QUESTION */}

            <div className="question-box">
              <h2>
                {questions[currentQuestion].question}
              </h2>

              <div className="options">
                {questions[currentQuestion].options.map(
                  (option, index) => (
                    <label
                      key={option}
                      className={`option ${
                        selectedAnswer === option
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={
                          selectedAnswer === option
                        }
                        onChange={(e) =>
                          setSelectedAnswer(
                            e.target.value
                          )
                        }
                      />

                      <span className="option-number">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="option-text">
                        {option}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* NEXT BUTTON */}

            <button
              type="button"
              className="assessment-next-btn"
              onClick={handleNext}
            >
              {currentQuestion ===
              questions.length - 1
                ? "Submit Assessment 🚀"
                : "Next Question →"}
            </button>
          </>
        ) : (
          /* RESULT */

          <div className="success-message">

            <span className="assessment-badge">
              🎉 ASSESSMENT COMPLETE
            </span>

            <h1>Your Assessment Result</h1>

            <p>
              Target Career:{" "}
              <strong>{career}</strong>
            </p>

            {/* SCORE */}

            <div className="score-box">
              <div className="score-circle">
                <strong>{percentage}%</strong>
                <span>Score</span>
              </div>

              <div className="score-details">
                <h2>
                  {score} / {questions.length}
                </h2>

                <p>
                  Correct Answers
                </p>
              </div>
            </div>

            {/* RESULT MESSAGE */}

            {percentage >= 80 ? (
              <div className="result-message excellent">
                <h2>Excellent Foundation! 🌟</h2>

                <p>
                  You have a strong foundation. You can
                  focus on advanced concepts and
                  real-world projects.
                </p>
              </div>
            ) : percentage >= 50 ? (
              <div className="result-message good">
                <h2>Good Start! 👍</h2>

                <p>
                  You already have some knowledge. Your
                  learning journey can focus on the
                  skills that need improvement.
                </p>
              </div>
            ) : (
              <div className="result-message improve">
                <h2>Let's Build Your Skills 💪</h2>

                <p>
                  Your personalized learning journey can
                  help you build the required skills
                  step by step.
                </p>
              </div>
            )}

            {/* NEXT STEP */}

            <div className="next-step">
              <span>🚀</span>

              <div>
                <h3>What's Next?</h3>

                <p>
                  Your assessment result will be used to
                  understand your current level and guide
                  your next career learning steps.
                </p>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="assessment-actions">

              <button
                type="button"
                className="assessment-next-btn"
                onClick={handleDashboard}
              >
                Go to Dashboard →
              </button>

              <button
                type="button"
                className="guest-btn"
                onClick={restartTest}
              >
                Retake Assessment 🔄
              </button>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Assessment;