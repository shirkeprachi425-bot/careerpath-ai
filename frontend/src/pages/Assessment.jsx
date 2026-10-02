import { useEffect, useState } from "react";
import "./Assessment.css";

function Assessment({ userId, career = "Career Assessment", onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // LOAD QUESTIONS FROM BACKEND
  // ==============================

  const loadQuestions = async () => {
    if (!userId) {
      setError("User information not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:5000/api/assessment/questions/${userId}`,
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to load assessment questions.",
        );
      }

      console.log("ASSESSMENT QUESTIONS:", data);
      console.log("ATTEMPT NUMBER:", data.attemptNumber);

      setQuestions(data.questions);
    } catch (error) {
      console.error("ASSESSMENT QUESTIONS ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD QUESTIONS WHEN PAGE OPENS
  // ==============================

  useEffect(() => {
    loadQuestions();
  }, [userId]);

  // ==============================
  // NEXT QUESTION
  // ==============================

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer first.");
      return;
    }

    const currentQuestionData = questions[currentQuestion];

    const answerObject = {
      questionId: currentQuestionData.id,
      answer: selectedAnswer,
    };

    const updatedAnswers = [...answers, answerObject];

    setAnswers(updatedAnswers);
    setSelectedAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((current) => current + 1);
    } else {
      submitAssessment(updatedAnswers);
    }
  };

  // ==============================
  // SUBMIT ASSESSMENT
  // ==============================

  const submitAssessment = async (finalAnswers) => {
    if (!userId) {
      setError("User information not found. Please login again.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      console.log("SUBMITTING ASSESSMENT:", {
        userId,
        answers: finalAnswers,
      });

      const response = await fetch(
        "http://127.0.0.1:5000/api/assessment/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            answers: finalAnswers,
          }),
        },
      );

      const data = await response.json();

      console.log("ASSESSMENT SUBMIT RESPONSE:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to submit assessment.",
        );
      }

      // Backend is the source of truth
      setResult(data.result);
      setSubmitted(true);

      // Local cache for convenience
      localStorage.setItem(
        "assessmentResult",
        JSON.stringify({
          career,
          ...data.result,
        }),
      );
    } catch (error) {
      console.error("ASSESSMENT SUBMIT ERROR:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==============================
  // GO TO DASHBOARD
  // ==============================

  const handleDashboard = () => {
    if (onComplete) {
      onComplete(result);
    }
  };

  // ==============================
  // RETAKE ASSESSMENT
  // ==============================

  const restartTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers([]);
    setSubmitted(false);
    setResult(null);
    setError("");
    setLoading(true);

    loadQuestions();
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="assessment-page">
        <div className="assessment-card">
          <div className="success-message">
            <h1>Loading Assessment...</h1>
            <p>Please wait while we load your questions.</p>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error && questions.length === 0) {
    return (
      <div className="assessment-page">
        <div className="assessment-card">
          <div className="success-message">
            <h1>Something went wrong</h1>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // NO QUESTIONS
  // ==============================

  if (questions.length === 0) {
    return (
      <div className="assessment-page">
        <div className="assessment-card">
          <div className="success-message">
            <h1>No Questions Found</h1>
            <p>The assessment currently has no questions.</p>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // RESULT DATA
  // ==============================

  const percentage = result?.percentage ?? 0;
  const score = result?.score ?? 0;

  // ==============================
  // MAIN UI
  // ==============================

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
                Answer the questions to understand your current knowledge
                and identify areas for improvement.
              </p>
            </div>

            {/* QUESTION NUMBER */}

            <div className="question-progress">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>

              <strong>
                {Math.round(
                  ((currentQuestion + 1) / questions.length) * 100,
                )}
                %
              </strong>
            </div>

            {/* PROGRESS BAR */}

            <div className="progress-bar">
              <div
                style={{
                  width: `${
                    ((currentQuestion + 1) / questions.length) * 100
                  }%`,
                }}
              />
            </div>

            {/* QUESTION */}

            <div className="question-box">
              <h2>{questions[currentQuestion].question}</h2>

              <div className="options">
                {questions[currentQuestion].options.map(
                  (option, index) => (
                    <label
                      key={option}
                      className={`option ${
                        selectedAnswer === option ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={(e) =>
                          setSelectedAnswer(e.target.value)
                        }
                      />

                      <span className="option-number">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="option-text">
                        {option}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <p style={{ color: "red" }}>
                {error}
              </p>
            )}

            {/* NEXT / SUBMIT BUTTON */}

            <button
              type="button"
              className="assessment-next-btn"
              onClick={handleNext}
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : currentQuestion === questions.length - 1
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
              Target Career: <strong>{career}</strong>
            </p>

            {/* SCORE */}

            <div className="score-box">
              <div className="score-circle">
                <strong>{percentage}%</strong>
                <span>Score</span>
              </div>

              <div className="score-details">
                <h2>
                  {score} / {result?.total}
                </h2>

                <p>Correct Answers</p>
              </div>
            </div>

            {/* RESULT MESSAGE */}

            {percentage >= 80 ? (
              <div className="result-message excellent">
                <h2>Excellent Foundation! 🌟</h2>

                <p>
                  You have a strong foundation. You can focus on
                  advanced concepts and real-world projects.
                </p>
              </div>
            ) : percentage >= 50 ? (
              <div className="result-message good">
                <h2>Good Start! 👍</h2>

                <p>
                  You already have some knowledge. Your learning
                  journey can focus on the skills that need
                  improvement.
                </p>
              </div>
            ) : (
              <div className="result-message improve">
                <h2>Let's Build Your Skills 💪</h2>

                <p>
                  Your personalized learning journey can help you
                  build the required skills step by step.
                </p>
              </div>
            )}

            {/* NEXT STEP */}

            <div className="next-step">
              <span>🚀</span>

              <div>
                <h3>What's Next?</h3>

                <p>
                  Your assessment result will be used to understand
                  your current level and guide your next career
                  learning steps.
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