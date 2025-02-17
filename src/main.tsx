import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import './index.css';
import { QuizProvider } from './contexts/QuizContext.jsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QuizProvider>
      <h1>Maynou</h1>
      <App />
    </QuizProvider>
  </React.StrictMode>
);
