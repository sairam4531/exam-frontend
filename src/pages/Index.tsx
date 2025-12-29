import { ExamProvider, useExam } from "../context/ExamContext";
import RegistrationPage from "../components/RegistrationPage";
import ExamPage from "../components/ExamPage";
import ResultPage from "../components/ResultPage";

const ExamContent = () => {
  const { currentPage } = useExam();

  switch (currentPage) {
    case "registration":
      return <RegistrationPage />;
    case "exam":
      return <ExamPage />;
    case "result":
      return <ResultPage />;
    default:
      return <RegistrationPage />;
  }
};

const Index = () => {
  return (
    <ExamProvider>
      <ExamContent />
    </ExamProvider>
  );
};

export default Index;
