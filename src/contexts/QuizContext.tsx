import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';

interface Question {
  question: string;
  options: string[];
  correctOption: number;
  points: number;
}

type ActionType =
  | { type: 'dataReceived'; payload: Question[] }
  | { type: 'dataFailed' }
  | { type: 'start' }
  | { type: 'newAnswer'; payload: number }
  | { type: 'nextQuestion' }
  | { type: 'finished' }
  | { type: 'restart' }
  | { type: 'tick' };

interface State {
  questions: Question[];
  status: 'loading' | 'error' | 'ready' | 'active' | 'finished';
  index: number;
  answer: number | null;
  points: number;
  highScore: number;
  secondsRemaining: number | null;
  secondsPerQuestion: number;
}

const initialState: State = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
  secondsPerQuestion: 12,
};

interface QuizContextType extends State {
  dispatch: (action: ActionType) => void; // replace 'any' with the type of your actions
  question: Question;
  numQuestions: number;
  maxPossiblePoints: number;
}

const QuizContext = createContext<QuizContextType | null>(null);

const reducer = function (state: State, action: ActionType): State {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start': {
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * state.secondsPerQuestion,
      };
    }
    case 'newAnswer': {
      const question = state.questions.at(state.index);
      if (!question) throw new Error('Problem finding question');

      const isCorrect = question.correctOption === action.payload;

      return {
        ...state,
        answer: action.payload,
        points: isCorrect ? state.points + question.points : state.points,
      };
    }
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };
    case 'finished':
      return {
        ...state,
        status: 'finished',
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case 'restart': {
      return {
        ...initialState,
        status: 'ready',
        questions: state.questions,
        highScore: state.highScore,
      };
    }
    case 'tick':
      return {
        ...state,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
        secondsRemaining: state.secondsRemaining
          ? state.secondsRemaining - 1
          : null,
      };
    default:
      throw new Error('Unknow action in QuizContext reducer function');
  }
};

interface QuizProviderProps {
  children: ReactNode;
}

function QuizProvider({ children }: QuizProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const numQuestions = state.questions.length;
  const maxPossiblePoints = state.questions.reduce(
    (acc: number, current: Question) => acc + current.points,
    0
  );
  const question = state.questions[state.index];

  useEffect(function () {
    const fetchData = async function () {
      const response = await fetch('/data/questions.json');
      const { questions } = await response.json();

      dispatch({ type: 'dataReceived', payload: questions });
    };
    fetchData().catch(error => {
      console.log('running catch');
      console.error(error);
      dispatch({ type: 'dataFailed' });
    });
  }, []);

  return (
    <QuizContext.Provider
      value={{
        ...state,
        dispatch,
        question,
        numQuestions,
        maxPossiblePoints,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz(): QuizContextType {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error(`useQuiz was used outside of QuizProvider`);

  if (context === null)
    throw new Error(
      `Quiz context was not properly initialized. It's value is null`
    );

  return context;
}

export { QuizProvider, useQuiz };
