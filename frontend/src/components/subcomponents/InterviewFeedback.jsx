import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { getUserFromToken } from "../auth/auth";
const InterviewFeedback = () => {
    const location = useLocation();
    const { interviewId } = location.state || {};
    const user = getUserFromToken();
    const userId = user?.id;
    const [feedbackList, setFeedbackList] = useState([]);

    useEffect(() => {
        if (interviewId && userId) {
            console.log("Fetching feedback for:", { interviewId, userId });
            fetchFeedback();
        }
    }, [interviewId, userId]);

    const fetchFeedback = async () => {
        try {
            const res = await axios.post("http://localhost:3009/api/get-feedbacks", {
                interviewId,
                userId
            });

            console.log("Fetched feedbacks:", res.data.feedbacks);
            setFeedbackList(res.data.feedbacks || []);
        } catch (err) {
            console.error("Error fetching feedbacks:", err);
        }
    };

    if (!feedbackList.length) return <p className="text-white p-4">Loading feedback...</p>;

    const averageScore = (
        feedbackList.reduce((sum, f) => sum + (f.score || 0), 0) / feedbackList.length
    ).toFixed(2);

    return (
        <div className="p-8 text-white">
            <h1 className="text-3xl font-bold mb-6">Interview Feedback ✨</h1>

            {feedbackList.map((feedback, idx) => (
                <div key={idx} className="bg-gray-800 p-6 rounded-lg mb-6 shadow-md">
                    <h2 className="text-lg font-bold mb-2">Question {idx + 1}</h2>
                    <p className="mb-2"><strong>Q:</strong> {feedback.question}</p>
                    <p className="mb-2"><strong>Your Answer:</strong> {feedback.userAnswer}</p>
                    <p className="mb-2"><strong>AI Feedback:</strong> {feedback.feedback}</p>
                    <p className="mb-2"><strong>Score:</strong> {feedback.score} / 10</p>
                </div>
            ))}

            <div className="mt-6 p-4 bg-green-700 rounded-lg shadow text-white">
                <p className="text-xl font-semibold">
                    ✅ Average Score: <span className="text-white">{averageScore} / 10</span>
                </p>
            </div>
            <div className="text-purple-600 bg-transparent w-full mt-5 justify-end items-end flex">
                <Link to="/MockInterviews" className=" text-center border-2 border-purple-700 p-2 w-1/6">Close</Link>
            </div>
        </div>
    );
};

export default InterviewFeedback;
