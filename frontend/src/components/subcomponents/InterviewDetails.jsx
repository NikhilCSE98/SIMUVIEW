import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import useSpeechToText from 'react-hook-speech-to-text';
import { LuWebcam } from "react-icons/lu";
import axios from "axios";
import { toast } from 'react-toastify';
import { getUserFromToken } from "../auth/auth"

const InterviewDetails = () => {
    const location = useLocation();
    const interview = location.state?.interview;
    const webcamEnabled = location.state?.webcamEnabled;
    const navigate = useNavigate();
    const [webcamOn, setWebcamOn] = useState(webcamEnabled ?? false);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const webcamRef = useRef(null);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    const [userAnswers, setUserAnswers] = useState({});



    useEffect(() => {
        if (!interview) return;
        if (webcamOn) {
            startWebcamRecording();
        }
        return () => {
            stopRecording();
        };
    }, [interview, webcamOn]);

    if (!interview) return <p className="text-white p-4">No interview data available!</p>;

    // 🔥 NEW FUNCTION: Call Gemini API
    const getFeedbackFromGemini = async (questionsAndAnswers) => {
        try {
            const qaText = questionsAndAnswers.map((qa, idx) => {
                return `Q${idx + 1}: "${qa.question}"\nA${idx + 1}: "${qa.answer}"\n`;
            }).join('\n');

            const payload = {
                contents: [{
                    parts: [{
                        text: `Here are multiple interview questions and the candidate's answers:\n\n${qaText}\n
    For each question-answer pair:
    - Provide detailed feedback on how they can improve.
    - Give a score out of 10.
    
    Respond ONLY in JSON format like this:
    [
      {
        "questionIndex": 0,
        "feedback": "Feedback for Q1",
        "score": 7
      },
      {
        "questionIndex": 1,
        "feedback": "Feedback for Q2",
        "score": 8
      }
      ...
    ]`
                    }]
                }]
            };

            const geminiResponse = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
                payload
            );

            let geminiText = geminiResponse.data.candidates[0]?.content?.parts[0]?.text;

            if (!geminiText) throw new Error("Empty response from Gemini");

            geminiText = geminiText.replace(/```json|```/g, '').trim();

            const parsed = JSON.parse(geminiText);
            console.log(parsed);
            return parsed;
        } catch (error) {
            console.error("Error fetching feedback from Gemini:", error);
            toast.error("Failed to get feedback from AI.");
            return null;
        }
    };



    const startWebcamRecording = async () => {
        setRecordedChunks([]);
        try {
            const waitForStream = () => {
                return new Promise((resolve) => {
                    const check = () => {
                        if (webcamRef.current && webcamRef.current.stream) {
                            resolve(webcamRef.current.stream);
                        } else {
                            setTimeout(check, 100);
                        }
                    };
                    check();
                });
            };
            const stream = await waitForStream();

            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    setRecordedChunks(prev => [...prev, e.data]);
                }
            };
            recorder.start();
            setMediaRecorder(recorder);

        } catch (error) {
            console.error("Error starting webcam recording:", error);
        }
    };

    const stopRecording = async () => {
        if (mediaRecorder) {
            mediaRecorder.stop();

            mediaRecorder.onstop = async () => {
                const blob = new Blob(recordedChunks, { type: recordedChunks.length && recordedChunks[0].type });
                const webmFile = new File([blob], 'recording.webm', { type: 'video/webm' });

                const formData = new FormData();
                formData.append('file', webmFile);
                formData.append('interviewId', interview._id);

                try {
                    await axios.post("http://localhost:3009/api/save-full-interview", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    console.log("Full interview uploaded successfully!");
                } catch (error) {
                    console.error("Upload failed", error);
                }
            };
        }
    };

    const handleStartRecording = async () => {
        if (webcamOn) {
            setWebcamOn(false);
        }

        if (error) {
            toast.error("Microphone access is required! Please allow microphone permissions.");
            console.error("Speech Recognition Error:", error);
            return;
        }

        try {
            await startSpeechToText();
            console.log("Speech recognition started...");
        } catch (err) {
            console.error("Error starting speech recognition:", err);
        }
    };

    const handleStopRecording = async () => {
        try {
            await stopSpeechToText();
            console.log("Speech recognition stopped...");

            setTimeout(() => {
                const combinedTranscript = interimResult?.trim();

                if (!combinedTranscript || combinedTranscript.length < 30) {
                    toast.error("Your answer should be more than 30 characters.");
                    return;
                }

                setUserAnswers(prevAnswers => {
                    const updatedAnswers = { ...prevAnswers };
                    updatedAnswers[`ans${selectedQuestionIndex + 1}`] = combinedTranscript;
                    return updatedAnswers;
                });

                console.log(`Saved answer for question ans${selectedQuestionIndex + 1}:`, combinedTranscript);
            }, 300);

        } catch (err) {
            console.error("Error stopping speech recognition:", err);
        }
    };



    useEffect(() => {
        const combinedTranscripts = results
            .filter((result) => typeof result !== "string")
            .map((result) => result.transcript) // no + needed
            .join("");

        if (!combinedTranscripts) return;

        setUserAnswers(prevAnswers => {
            const updatedAnswers = { ...prevAnswers };
            updatedAnswers[`ans${selectedQuestionIndex + 1}`] = combinedTranscripts; // 🔥 key as ans1, ans2, ans3, etc.
            return updatedAnswers;
        });

        console.log("Combined Transcript:", combinedTranscripts);
    }, [results, selectedQuestionIndex]);


    // 🔥 UPDATED handleNextQuestion
    const handleNextQuestion = async () => {
        const currentAnswer = userAnswers[`ans${selectedQuestionIndex + 1}`];

        if (!currentAnswer || currentAnswer.length < 30) {
            toast.error("Please record a longer answer before proceeding!");
            return;
        }

        try {
            const questionsAndAnswers = [];
            for (let i = 0; i <= selectedQuestionIndex; i++) {
                questionsAndAnswers.push({
                    question: interview.questions[i]?.question,
                    answer: userAnswers[`ans${i}`] || ""
                });
            }
            const user = getUserFromToken();
            if (!user) {
                toast.error("Authentication required!");
                navigate("/login");
                return;
            }

            const feedbackList = await getFeedbackFromGemini(questionsAndAnswers);

            if (feedbackList) {
                for (const feedbackData of feedbackList) {
                    await axios.post("http://localhost:3009/save-feedback", {
                        interviewId: interview._id,
                        userId: user.id,
                        questionIndex: feedbackData.questionIndex,
                        question: interview.questions[feedbackData.questionIndex]?.question,
                        userAnswer: userAnswers[`ans${feedbackData.questionIndex + 1}`],
                        feedback: feedbackData.feedback,
                        score: feedbackData.score,
                    });
                }

                console.log("All feedbacks saved successfully!");
            }
        } catch (err) {
            console.error("Error saving feedback:", err);
        }

        if (selectedQuestionIndex < interview.questions.length - 1) {
            setSelectedQuestionIndex(prev => prev + 1);
        } else {
            // Interview finished
            stopRecording();

            setTimeout(() => {
                navigate("/interview-feedback", {
                    state: { interviewId: interview._id, userId: interview.userId }
                });
            }, 500);
        }
    };


    return (
        <div className="flex h-screen text-white">
            {/* Questions & Details */}
            <div className="flex-1 p-10 mt-10">
                <div className="mb-4">
                    {interview.questions.map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-4 py-1 mr-2 rounded-full text-sm font-semibold ${selectedQuestionIndex === idx
                                ? "bg-purple-600"
                                : "bg-gray-700 hover:bg-gray-600"
                                }`}
                            onClick={() => setSelectedQuestionIndex(idx)}
                        >
                            Question #{idx + 1}
                        </button>
                    ))}
                </div>

                <div className="mb-6">
                    <p className="text-lg font-semibold">
                        {interview.questions[selectedQuestionIndex]?.question}
                    </p>
                </div>

                {/* Start/Stop Recording Buttons */}
                <div className="mb-6 flex gap-4">
                    {!isRecording ? (
                        <button
                            onClick={handleStartRecording}
                            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
                        >
                            🎙️ Start Recording
                        </button>
                    ) : (
                        <button
                            onClick={handleStopRecording}
                            className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700"
                        >
                            🛑 Stop Recording
                        </button>
                    )}

                    <button
                        onClick={handleNextQuestion}
                        className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
                    >
                        {selectedQuestionIndex < interview.questions.length - 1 ? "Next ➡️" : "Finish 🏁"}
                    </button>
                </div>

                <div className="bg-white text-black p-5 ">
                    <strong>Your Answer:</strong>
                    <p>{userAnswers[selectedQuestionIndex] || "start recording to see your answer here"}</p>

                    {interimResult && (
                        <p className=" text-black ">
                            <strong>Current Speech:</strong><br />
                            {interimResult}
                        </p>
                    )}

                </div>

                <div className="bg-purple-100 text-black p-4 rounded-md text-sm mt-4">
                    <strong>Note:</strong><br />
                    - Click "Start Recording" to answer using your voice.<br />
                    - Webcam will be disabled automatically.<br />
                    - Click "Next" after answering each question.
                </div>
            </div>

            {/* Webcam Section */}
            <div className="w-1/3 flex justify-center items-center p-4">
                <div className="w-[300px] h-[400px] border-2 border-white rounded-lg overflow-hidden flex justify-center items-center">
                    {webcamOn ? (
                        <Webcam
                            ref={webcamRef}
                            audio={true}
                            className="w-auto h-full object-cover"
                            videoConstraints={{
                                width: 900,
                                height: 980,
                                facingMode: "user",
                            }}
                        />
                    ) : (
                        <LuWebcam className="text-gray-500 text-[200px]" />
                    )}
                </div>
            </div>

        </div>
    );
};

export default InterviewDetails;
