import React, { useState, useEffect, useCallback } from "react";
import { useExam } from "../context/ExamContext";
import { fetchExamQuestions, Question } from "../services/questionApi";
import { submitExamResponse } from "../services/api";
import { toast } from "sonner";

const ExamPage = () => {
  const { studentInfo, setExamResult, setCurrentPage } = useExam();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [tabSwitched, setTabSwitched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Fetch questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      const data = await fetchExamQuestions();
      setQuestions(data);
      setLoading(false);
    };
    loadQuestions();
  }, []);

  // Submit exam function
  const submitExam = useCallback(async (wasAutoSubmit = false) => {
    if (isSubmitting || questions.length === 0) return;
    setIsSubmitting(true);

    // Calculate score
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const result = {
      score,
      totalQuestions,
      wasTabSwitched: tabSwitched || wasAutoSubmit,
    };

    // Submit to API
    if (studentInfo) {
      await submitExamResponse({
        rollNumber: studentInfo.rollNumber,
        name: studentInfo.name,
        department: studentInfo.department,
        section: studentInfo.section,
        score,
        totalQuestions,
        wasTabSwitched: tabSwitched || wasAutoSubmit,
      });
    }

    setExamResult(result);
    setCurrentPage("result");
  }, [isSubmitting, selectedAnswers, tabSwitched, totalQuestions, studentInfo, setExamResult, setCurrentPage, questions]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error("Time's up! Submitting your exam...");
      submitExam(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitExam]);

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitched(true);
        toast.error("Tab switch detected! Your exam has been auto-submitted.");
        submitExam(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [submitExam]);

  // Prevent copy/paste
  useEffect(() => {
    const preventCopy = (e: Event) => {
      e.preventDefault();
      toast.warning("Copying is not allowed during the exam!");
    };

    const preventContextMenu = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const unanswered = totalQuestions - Object.keys(selectedAnswers).length;
    if (unanswered > 0) {
      const confirmed = window.confirm(
        `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirmed) return;
    }
    submitExam();
  };

  const isTimeLow = timeLeft <= 60;

  if (loading) {
    return (
      <div className="min-h-screen gradient-sunset flex items-center justify-center">
        <div className="text-white text-xl">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-sunset flex flex-col no-select">
      {/* Header */}
      <header className="w-full p-4 bg-card shadow-card">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Welcome,</p>
            <p className="font-semibold text-foreground">{studentInfo?.name}</p>
          </div>
          
          {/* Timer */}
          <div className={`px-6 py-3 rounded-xl font-bold text-xl transition-all duration-300 ${
            isTimeLow 
              ? "bg-destructive text-destructive-foreground animate-pulse-glow" 
              : "gradient-primary text-primary-foreground"
          }`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-muted h-2">
        <div 
          className="h-full gradient-primary transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl animate-fade-in">
          {/* Question Card */}
          <div className="bg-card rounded-2xl shadow-card p-8 border-2 border-secondary/20">
            {/* Question Number */}
            <div className="flex items-center justify-between mb-6">
              <span className="px-4 py-2 rounded-full gradient-warm text-primary-foreground font-semibold">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <div className="flex gap-2">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentQuestionIndex
                        ? "bg-primary scale-125"
                        : selectedAnswers[questions[idx].id] !== undefined
                        ? "bg-success"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-xl font-bold text-foreground mb-6 no-copy">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border-2 no-copy ${
                    selectedAnswers[currentQuestion.id] === index
                      ? "bg-secondary text-secondary-foreground border-secondary shadow-lg scale-[1.02]"
                      : "bg-background text-foreground border-input hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 font-bold ${
                    selectedAnswers[currentQuestion.id] === index
                      ? "bg-primary-foreground/20"
                      : "bg-muted"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 rounded-lg font-semibold border-2 border-input text-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-lg font-bold gradient-cool text-accent-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Exam ✓"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-lg font-semibold gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  Next →
                </button>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="mt-4 p-4 rounded-lg bg-warning/20 border border-warning/50 text-center">
            <p className="text-sm text-warning font-medium">
              ⚠️ Do not switch tabs or copy content. Your exam will be automatically submitted.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamPage;
