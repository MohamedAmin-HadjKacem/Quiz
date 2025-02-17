import { useQuiz } from '../contexts/QuizContext';
import { useVideoRecorder } from '../hooks/useVideoRecorder';

export default function NextButton() {
    const { status, numQuestions, index, answer, dispatch } = useQuiz();
    const { stopRecording, downloadRecording, mediaRecorder, isRecording } = useVideoRecorder();

    if (answer === null && status !== 'finished') return null;

    const handleNext = async () => {
        if (isRecording) {
            stopRecording();
            setTimeout(() => {
                startRecording();
                dispatch({ type: 'nextQuestion' });
            }, 500);
        } else {
            dispatch({ type: 'nextQuestion' });
        }
    };

    const handleFinish = () => {
        setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.onstop = () => {
                    downloadRecording();
                };
                stopRecording();
            } else {
                downloadRecording();
            }
            dispatch({ type: 'finished' });
        }, 500);
    };

    const handleRestart = () => {
        dispatch({ type: 'restart' });
    };

    let buttonText = 'Next';
    let buttonAction = handleNext;

    if (index === numQuestions - 1) {
        buttonText = 'Results';
        buttonAction = handleFinish;
    } else if (status === 'finished') {
        buttonText = 'Restart Quiz';
        buttonAction = handleRestart;
    }

    return (
        <button className="btn btn-ui" onClick={buttonAction}>
            {buttonText}
        </button>
    );
}