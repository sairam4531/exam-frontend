// API for fetching questions from database
const API_BASE_URL = "https://exam-server-aynr.onrender.com/api";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Fallback questions in case database is empty or unavailable
import { examQuestions as fallbackQuestions } from "@/data/questions";

export const fetchExamQuestions = async (): Promise<Question[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/questions`);
    const data = await res.json();
    
    if (data.success && data.data.length > 0) {
      return data.data;
    }
    
    // Return fallback questions if database is empty
    return fallbackQuestions;
  } catch (error) {
    console.error("Error fetching questions from API:", error);
    // Return fallback questions if API fails
    return fallbackQuestions;
  }
};
