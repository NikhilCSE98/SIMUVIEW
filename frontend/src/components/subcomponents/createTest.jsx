import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const CreateTest = ({ onClose, onSubmit }) => {
    const [JProfile, setJProfile] = useState("");
    const [JDesc, setJDesc] = useState("");
    const [JExp, setJExp] = useState("");
    const [JSkills, setJSkills] = useState("");
    const [JExpiry, setJExpiry] = useState("");
    const [userId, setUserId] = useState(null);

    // Decode JWT and extract userId
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.id);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    const handleSubmit = async () => {
        if (!userId) {
            alert("User not authenticated!");
            return;
        }

        const formData = {
            userId,
            jobRole: JProfile.trim(),
            jobDescription: JDesc.trim(),
            yearsOfExperience: JExp.trim(),
            technology: JSkills.trim(),
            expiryDate: JExpiry,
        };

        console.log("Form Data:", formData);

        if (!formData.jobRole || !formData.expiryDate) {
            alert("Please fill all required fields!");
            return;
        }

        try {
            const token = localStorage.getItem("jwt");

            const geminiResponse = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: ` As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

        [
          { "question": "<Question text>", "answer": "<Answer text>" },
          ...
        ]

        Job Information:
        - Job Position: ${JProfile}
        - Job Description: ${JDesc}
        - Years of Experience Required: ${JExp}
        - Tech Stacks: ${JSkills}

        The questions should assess skills in ${JSkills} development and best practices, problem-solving, and experience handling complex requirements. Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers.
        `
                                }
                            ]
                        }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            try {
                let questionText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

                // Clean unwanted formatting
                questionText = questionText.replace(/```json|```/g, "").trim();  // Remove markdown formatting
                questionText = questionText.replace(/[\x00-\x1F\x7F]/g, "");  // Remove control characters

                console.log("Cleaned Gemini Response:", questionText); // Debugging

                const parsedQuestions = JSON.parse(questionText); // Parse cleaned JSON

                formData.questions = parsedQuestions; // Attach to formData
            } catch (err) {
                console.error("Error parsing Gemini response:", err);
                alert("Failed to generate questions. Please try again.");
                return;
            }




            const response = await axios.post("http://localhost:3009/api/interviews", formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            if (response.status === 201) {
                alert("Mock interview created successfully!");
                onSubmit(formData);
                setJProfile("");
                setJDesc("");
                setJExp("");
                setJSkills("");
                setJExpiry("");
                onClose();
            } else {
                alert("Error creating interview!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to server.");
        }
    };

    return (
        <div className="flex fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 justify-center items-center">
            <div className="bg-black bg-opacity-70 shadow-xl shadow-gray-700 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
                <form className="text-white">
                    <h1 className="text-white text-center text-xl">Create Mock Interview</h1>
                    <div className="m-5 bg-black border-2 border-purple-700 overflow-hidden rounded-xl">
                        <input
                            className="w-full bg-transparent outline-none m-2 placeholder-slate-50"
                            placeholder="Job role"
                            value={JProfile}
                            onChange={(e) => setJProfile(e.target.value)}
                        />
                    </div>
                    <div className="m-5 bg-black border-2 border-purple-700 overflow-hidden rounded-xl">
                        <input
                            className="w-full bg-transparent outline-none m-2 placeholder-slate-50"
                            placeholder="Job Description"
                            value={JDesc}
                            onChange={(e) => setJDesc(e.target.value)}
                        />
                    </div>
                    <div className="m-5 bg-black border-2 border-purple-700 overflow-hidden rounded-xl">
                        <input
                            className="w-full bg-transparent outline-none m-2 placeholder-slate-50"
                            placeholder="Years of Experience"
                            value={JExp}
                            onChange={(e) => setJExp(e.target.value)}
                        />
                    </div>
                    <div className="m-5 bg-black border-2 border-purple-700 overflow-hidden rounded-xl">
                        <input
                            className="w-full bg-transparent outline-none m-2 placeholder-slate-50"
                            placeholder="Technology"
                            value={JSkills}
                            onChange={(e) => setJSkills(e.target.value)}
                        />
                    </div>
                    <div className="m-5 bg-black border-2 border-purple-700 overflow-hidden rounded-xl">
                        <input
                            className="w-full bg-transparent outline-none m-2 placeholder-slate-50"
                            type="date"
                            value={JExpiry}
                            onChange={(e) => setJExpiry(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between m-5">
                        <button
                            type="button"
                            className="text-white bg-red-600 p-1 text-xl w-1/3 rounded-xl"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="text-white bg-purple-800 p-1 text-xl w-1/3 rounded-xl"
                            onClick={handleSubmit}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTest;
