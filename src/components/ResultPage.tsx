import React from "react";
import { useExam } from "../context/ExamContext";

const ResultPage = () => {
  const { studentInfo, examResult, resetExam } = useExam();

  if (!examResult || !studentInfo) {
    return null;
  }

  const percentage = Math.round((examResult.score / examResult.totalQuestions) * 100);

  return (
    <div className="min-h-screen gradient-sunset flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Result Card */}
        <div className="bg-card rounded-2xl shadow-card p-8 border-2 border-primary/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">
              🎉
            </div>
            <h1 className="text-3xl font-bold text-primary">
              Exam Completed!
            </h1>
            <p className="text-muted-foreground mt-2">
              Your exam has been submitted successfully
            </p>
          </div>

          {/* Student Info */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-semibold text-foreground">{studentInfo.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Roll Number</p>
                <p className="font-semibold text-foreground">{studentInfo.rollNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-semibold text-foreground">{studentInfo.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Section</p>
                <p className="font-semibold text-foreground">{studentInfo.section}</p>
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <svg className="w-48 h-48" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(percentage / 100) * 283} 283`}
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{examResult.score}</span>
                <span className="text-lg text-muted-foreground">/ {examResult.totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* Tab Switch Warning */}
          {examResult.wasTabSwitched && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Note: Tab switch was detected during the exam
              </p>
            </div>
          )}

          {/* Info Notice */}
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-sm text-accent font-medium text-center">
              📝 Answers are not revealed to maintain exam integrity
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          Thank you for participating in the online examination
        </p>
      </div>
    </div>
  );
};

export default ResultPage;
