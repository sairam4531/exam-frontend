// API Configuration - Using Render deployment
const API_BASE_URL = "https://exam-server-aynr.onrender.com/api";

export interface ExamResponse {
  rollNumber: string;
  name: string;
  department: string;
  section: string;
  score: number;
  totalQuestions: number;
  wasTabSwitched: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// Submit exam response to MySQL database via backend API
export const submitExamResponse = async (response: ExamResponse): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${API_BASE_URL}/submit-exam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roll_number: response.rollNumber,
        name: response.name,
        department: response.department,
        section: response.section,
        score: response.score,
        total_questions: response.totalQuestions,
        was_tab_switched: response.wasTabSwitched ? 1 : 0,
        submitted_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to submit exam");
    }

    const data = await res.json();
    return { success: true, message: "Exam submitted successfully", data };
  } catch (error) {
    console.error("API Error:", error);
    // Fallback to localStorage if API is not available
    const storedResponses = localStorage.getItem("examResponses");
    const responses = storedResponses ? JSON.parse(storedResponses) : [];
    responses.push({
      ...response,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem("examResponses", JSON.stringify(responses));
    
    return { 
      success: true, 
      message: "Exam saved locally (backend not connected)",
      data: response 
    };
  }
};

// Check if roll number already exists - always return false to allow multiple attempts
export const checkRollNumber = async (rollNumber: string): Promise<boolean> => {
  // Allow same roll number to take exam multiple times
  return false;
};
