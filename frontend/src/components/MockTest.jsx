import { useEffect, useState } from "react";
import Header from "./header";
import { useNavigate } from "react-router-dom";


const MockTest = () => {
    const [interviews, setInterviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const response = await fetch("http://localhost:3009/api/interviews", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setInterviews(data); // Store all interviews
            } else {
                console.error("Failed to fetch interviews");
            }
        } catch (error) {
            console.error("Error fetching interviews:", error);
        }
    };

    const handleSubmit = (interview) => {
        try {
            navigate(`/MockInterviews/Test/${interview._id}`, {
                state: { interview }, // Pass the full interview object
            });
        } catch (error) {
            console.error("Navigation error:", error);
        }
    };


    return (
        <div>
            <Header />
            <div className="p-5">
                <h1 className="border-b-2 border-white text-purple-700 text-2xl mb-5">
                    Mock Interviews
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {interviews.map((interview) => (
                        <MockCard key={interview._id} interview={interview} handleSubmit={handleSubmit} />

                    ))}
                </div>
            </div>
        </div>
    );
};

const MockCard = ({ interview, handleSubmit }) => {
    return (
        <div className="bg-transparent border-2 border-purple-700 p-4 rounded-lg shadow-lg">
            <h1 className="text-white text-left text-xl">{interview.jobRole}</h1>
            <p className="text-gray-200">{interview.jobDescription}</p>
            <h3 className="text-gray-200">{interview.technology}</h3>
            <div className="flex justify-between"><p className="text-sm text-red-500">
                Expires on: {new Date(interview.expiryDate).toLocaleDateString()}
            </p>
                <button
                    className="p-1 min-w-20 bg-gray-300 text-xl"
                    onClick={() => handleSubmit(interview)}
                >
                    Start
                </button>
            </div>
        </div>
    );
};

export default MockTest;
