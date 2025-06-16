import { useLocation, useParams, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { LuWebcam } from "react-icons/lu";
import Webcam from "react-webcam";
import { useState } from "react";

const Test_id = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const interview = location.state?.interview;

    const [webcamEnabled, setWebcamEnabled] = useState(false);

    if (!interview) return <p className="text-white p-4">No interview data found!</p>;

    const handleStart = () => {
        navigate(`/interview/${id}`, {
            state: { interview, webcamEnabled }, // ✅ pass whether webcam is enabled
        });
    };

    const toggleWebcam = () => {
        setWebcamEnabled(prev => !prev);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-700 px-6 py-4 bg-[rgb(34,10,28)]">
                <div
                    className="flex items-center cursor-pointer text-2xl hover:text-purple-400 transition"
                    onClick={handleGoBack}
                >
                    <MdOutlineKeyboardBackspace />
                    <span className="ml-2 text-lg">Back</span>
                </div>
                <h1 className="text-xl font-semibold">Interview Instructions</h1>
                <div></div>
            </div>

            {/* Body */}
            <div className="flex flex-col lg:flex-row justify-between gap-10 m-10">
                {/* Instructions */}
                <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-4">Please read the following instructions:</h2>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-gray-300">
                        <li>Enable microphone to start the interview. Webcam is optional.</li>
                        <li>Read each question carefully and answer clearly.</li>
                        <li>Don’t skip questions; skipping may lead to deduction of marks.</li>
                        <li>The interview must be submitted within 60 minutes.</li>
                        <li>Make sure your microphone has access permission.</li>
                    </ul>

                    {/* Start Interview Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            className="px-6 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white transition"
                            onClick={handleStart}
                        >
                            Start Interview
                        </button>
                    </div>
                </div>

                {/* Webcam Section */}
                <div className="flex-1 flex flex-col items-center">
                    {webcamEnabled ? (
                        <div className="rounded overflow-hidden border border-purple-500">
                            <Webcam audio={true} className="w-full max-w-sm rounded" />
                        </div>
                    ) : (
                        <LuWebcam className="text-gray-500 text-9xl mb-4" />
                    )}

                    <button
                        className="bg-purple-600 hover:bg-purple-700 transition mt-4 px-4 py-2 text-sm rounded"
                        onClick={toggleWebcam}
                    >
                        {webcamEnabled ? "Disable Webcam" : "Enable Webcam (Optional)"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Test_id;
