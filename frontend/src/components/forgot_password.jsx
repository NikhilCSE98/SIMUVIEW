
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Forgot_Password = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3009/forgot_password', { email });

            if (response.status === 200) {
                console.log('yo'); // Ensure this runs
                navigate('/otp', { state: { email } }); // Redirect to OTP page with email
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert('Email is not registered');
            } else {
                console.error('Error:', error.message);
                alert('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="bg-black flex justify-center items-center h-screen overflow-hidden">
            <div className="bg-transparent border-2 border-purple-700  block m-10 p-6 rounded-lg">
                <h1 className="text-white text-center text-2xl mb-4">Forgot Password</h1>
 
                <div className="bg-transparent text-white">
                    <div className="flex items-center border border-gray-500 rounded-lg overflow-hidden">
                        <label className="bg-purple-600 text-white py-2 px-3 w-fit">Email</label>
                        <input
                            type="email"
                            className="p-2 flex-1 bg-transparent text-white outline-none"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                        />
                    </div>
                </div>

                <button className="w-full border-2 border-white bg-purple-700 text-white font-bold py-2 rounded-lg mt-4 hover:bg-purple-800 hover:border-gray-500 " onClick={handleSubmit} >
                    Next
                </button>
            </div>
        </div>

    );
};

export default Forgot_Password;