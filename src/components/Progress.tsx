import { useQuiz } from '../contexts/QuizContext';

export default function Progress() {
  const { points, index, numQuestions, answer, maxPossiblePoints } = useQuiz();

  return (
    <header className="progress">
      <progress
        id="quiz"
        value={index + Number(answer !== null)}
        max={numQuestions}
      >
        {index + 1}% canis<p>canis</p>
      </progress>
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        Points <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}
