import { useState } from "react";

const CreateTest = ({ onClose, onSubmit }) => {
    const [JProfile, setJProfile] = useState("");
    const [JDesc, setJDesc] = useState("");
    const [JExp, setJExp] = useState("");
    const [JSkills, setJSkills] = useState("");
    const [JExpiry, setJExpiry] = useState("");

    const handleSubmit = async () => {
        const formData = {
            jobRole: JProfile,
            jobDescription: JDesc,
            yearsOfExperience: JExp,
            technology: JSkills,
            expiryDate: JExpiry, // Add expiry date
        };

        try {
            const response = await fetch("http://localhost:3009/api/interviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Mock interview created successfully!");
                onSubmit(formData);
                setJProfile("");
                setJDesc("");
                setJExp("");
                setJSkills("");
                setJExpiry(""); // Clear expiry date
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
