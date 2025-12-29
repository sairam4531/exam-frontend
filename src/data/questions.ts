export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const examQuestions: Question[] = [
  {
    id: 1,
    question: "What does AI stand for?",
    options: ["Artificial Intelligence", "Automated Integration", "Advanced Interface", "Applied Informatics"],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "Which programming language is primarily used for Data Science?",
    options: ["Java", "Python", "C++", "Ruby"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is Machine Learning?",
    options: [
      "A type of hardware",
      "A subset of AI that enables systems to learn from data",
      "A programming language",
      "A database management system"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Which algorithm is commonly used for classification tasks?",
    options: ["Linear Regression", "K-Means", "Decision Tree", "PCA"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Query Logic", "Sequential Query List", "System Query Language"],
    correctAnswer: 0
  },
  {
    id: 6,
    question: "Which of the following is a supervised learning algorithm?",
    options: ["K-Means Clustering", "Random Forest", "DBSCAN", "Principal Component Analysis"],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "What is the purpose of activation functions in neural networks?",
    options: [
      "To store data",
      "To introduce non-linearity",
      "To reduce memory usage",
      "To compress images"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "Which library is commonly used for deep learning in Python?",
    options: ["NumPy", "Pandas", "TensorFlow", "Matplotlib"],
    correctAnswer: 2
  },
  {
    id: 9,
    question: "What does CNN stand for in deep learning?",
    options: [
      "Computer Neural Network",
      "Convolutional Neural Network",
      "Connected Node Network",
      "Cascaded Neuron Network"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "Which metric is used to evaluate classification models?",
    options: ["Mean Squared Error", "R-Squared", "Accuracy", "Standard Deviation"],
    correctAnswer: 2
  }
];
