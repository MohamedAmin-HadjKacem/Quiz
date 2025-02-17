import { useRef, useState, useEffect } from 'react';

export function useVideoRecorder() {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        if (isRecording) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            setStream(stream);
            if (videoRef.current) videoRef.current.srcObject = stream;

            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            setMediaRecorder(recorder);

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                    setChunks([...chunksRef.current]); // Mise à jour de l'état avec la nouvelle valeur
                }
            };

            recorder.onstart = () => {
                console.log("MediaRecorder a démarré");
            };

            recorder.start();
            setIsRecording(true);
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                console.error("Permissions refusées. Veuillez autoriser l'accès à la caméra et au microphone.");
            } else {
                console.error("Erreur lors du démarrage de l'enregistrement :", error);
            }
        }
    };

    const stopRecording = () => {
        if (!mediaRecorder || !isRecording) return;

        mediaRecorder.onstop = () => {
            downloadRecording();
        };

        mediaRecorder.stop();
        setIsRecording(false);

        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }

        setMediaRecorder(null);
    };

    const downloadRecording = () => {
        if (chunksRef.current.length === 0) {
            console.error("Aucune vidéo enregistrée.");
            return;
        }

        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `recording_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);

        setChunks([]);
        chunksRef.current = [];
    };

    useEffect(() => {
        return () => {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [mediaRecorder, stream]);

    return { startRecording, stopRecording, videoRef, downloadRecording, mediaRecorder, isRecording };
}