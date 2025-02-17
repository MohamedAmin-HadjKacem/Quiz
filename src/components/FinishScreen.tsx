import { useQuiz } from '../contexts/QuizContext';

export default function FinishScreen() {
  const { maxPossiblePoints, points, highScore } = useQuiz();
  const percentage = Math.ceil((points / maxPossiblePoints) * 100);

  let emoji;
  switch (true) {
    case percentage === 100:
      emoji = '💯';
      break;
    case percentage === 0:
      emoji = '💥';
      break;
    default:
      '';
      break;
  }

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{' '}
        {maxPossiblePoints} ({percentage}%)
      </p>
      <p className="highscore">(High Score: {highScore} points)</p>
    </>
  );
}
