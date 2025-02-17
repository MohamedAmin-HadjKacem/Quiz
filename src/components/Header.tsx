import { useQuiz } from '../contexts/QuizContext';

function Header() {
  const { dispatch } = useQuiz();

  const handleClick = () => dispatch({ type: 'restart' });
  return (
    <header className="header">
      <button className="header-title" onClick={handleClick}>
        <img src="../../public/iitLogo.jpg" alt="" />
        <h1>Quiz</h1>
      </button>
    </header>
  );
}

export default Header;
