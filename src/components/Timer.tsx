import { useEffect } from 'react';
import { useQuiz } from '../contexts/QuizContext';

export default function Timer() {
  const { secondsRemaining, dispatch } = useQuiz();

  useEffect(
    function () {
      const id = setInterval(() => {
        dispatch({ type: 'tick' });
      }, 1000);
      return () => clearInterval(id);
    },
    [dispatch]
  );

  const formatedTime = function (totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <p className="timer">
      {secondsRemaining ? formatedTime(secondsRemaining) : ''}
    </p>
  );
}
