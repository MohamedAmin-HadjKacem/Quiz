import { useQuiz } from '../contexts/QuizContext';

export default function StartScreen() {
  const { numQuestions, dispatch } = useQuiz();
  return (
    <div className="start">
      <h2>Welcome to our Quiz!</h2>
      <h3>{numQuestions} Questions to test your mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'start' })}
      >
        Let&apos;s Start
      </button>
    </div>
  );
}