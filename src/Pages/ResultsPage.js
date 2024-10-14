import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ResultsPage = ({ quizData, submittedAnswers }) => {
  const totalQuestions = quizData.quiz.length;
  let correctAnswersCount = 0;
  let wrongAnswersCount = 0;
  const wrongQuestionsByType = {};

  quizData.quiz.forEach((question, index) => {
    const userAnswer = submittedAnswers[index];
    const correctAnswer = question.answer;

    let isCorrect = false;

    if (question.type === "multiple") {
      if (
        Array.isArray(userAnswer) &&
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((val) => correctAnswer.includes(val))
      ) {
        isCorrect = true;
      }
    } else {
      if (
        userAnswer !== undefined &&
        userAnswer.toString().toLowerCase().trim() ===
          correctAnswer.toString().toLowerCase().trim()
      ) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      correctAnswersCount++;
    } else {
      wrongAnswersCount++;
      if (wrongQuestionsByType[question.type]) {
        wrongQuestionsByType[question.type]++;
      } else {
        wrongQuestionsByType[question.type] = 1;
      }
    }
  });

  const percentageCorrect = (correctAnswersCount / totalQuestions) * 100;

  const pieData = {
    labels: ["Correct", "Wrong"],
    datasets: [
      {
        data: [correctAnswersCount, wrongAnswersCount],
        backgroundColor: ["#28a745", "#dc3545"],
        hoverBackgroundColor: ["#218838", "#c82333"],
      },
    ],
  };

  const wrongTypesData = {
    labels: Object.keys(wrongQuestionsByType),
    datasets: [
      {
        data: Object.values(wrongQuestionsByType),
        backgroundColor: ["#ffc107", "#17a2b8", "#6f42c1", "#fd7e14"],
        hoverBackgroundColor: ["#e0a800", "#138496", "#5a3d9a", "#e36b0a"],
      },
    ],
  };

  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div
        className="card shadow p-3 p-md-5"
        style={{ maxWidth: "800px", width: "100%" }}
      >
        <h2 className="mb-4 text-center">Quiz Results</h2>

        {/* Progress Bar */}
        <div className="progress mb-4">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${percentageCorrect}%` }}
            aria-valuenow={percentageCorrect}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {percentageCorrect.toFixed(0)}% Correct
          </div>
        </div>

        {wrongAnswersCount === 0 ? (
          // Congratulatory Message and Animation
          <div className="text-center">
            <h3 className="mb-4 text-success">
              Congratulations! Perfect Score!
            </h3>
            <div className="mb-4">
              <i
                className="fas fa-trophy animate__animated animate__bounceIn"
                style={{ fontSize: "4rem", color: "#ffc107" }}
              ></i>
            </div>
          </div>
        ) : (
          // Display Charts
          <div>
            <div className="row mb-4">
              {/* First Chart */}
              <div className="col-md-6">
                <h5 className="text-center">Correct vs Wrong Answers</h5>
                <Pie data={pieData} />
              </div>
              {/* Second Chart */}
              <div className="col-md-6">
                <h5 className="text-center">Wrong Answers by Question Type</h5>
                <Pie data={wrongTypesData} />
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <a href="/" className="btn btn-primary">
            Create Quiz
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
