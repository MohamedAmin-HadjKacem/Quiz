import { useQuiz } from '../contexts/QuizContext';

export function Options() {
  const { question, dispatch, answer } = useQuiz();
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          key={option}
          className={`btn btn-option ${index === answer ? 'answer' : ''} ${
            answer !== null && index === question.correctOption
              ? 'correct'
              : answer !== null
              ? 'wrong'
              : ''
          }`}
          onClick={() => dispatch({ type: 'newAnswer', payload: index })}
          disabled={answer !== null}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
