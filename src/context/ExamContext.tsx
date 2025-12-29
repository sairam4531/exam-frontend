import React, { createContext, useContext, useState, ReactNode } from "react";

interface StudentInfo {
  rollNumber: string;
  name: string;
  department: string;
  section: string;
}

interface ExamResult {
  score: number;
  totalQuestions: number;
  wasTabSwitched: boolean;
}

interface ExamContextType {
  studentInfo: StudentInfo | null;
  setStudentInfo: (info: StudentInfo) => void;
  examResult: ExamResult | null;
  setExamResult: (result: ExamResult) => void;
  currentPage: "registration" | "exam" | "result";
  setCurrentPage: (page: "registration" | "exam" | "result") => void;
  resetExam: () => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider = ({ children }: { children: ReactNode }) => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [currentPage, setCurrentPage] = useState<"registration" | "exam" | "result">("registration");

  const resetExam = () => {
    setStudentInfo(null);
    setExamResult(null);
    setCurrentPage("registration");
  };

  return (
    <ExamContext.Provider
      value={{
        studentInfo,
        setStudentInfo,
        examResult,
        setExamResult,
        currentPage,
        setCurrentPage,
        resetExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
};
