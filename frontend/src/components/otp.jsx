import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Otp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = location.state || {};

    const handleinput = (e, index) => {
        if (isNaN(e.target.value)) return false

        const updatedOtp = [...otp];
        updatedOtp[index] = e.target.value;
        setOtp(updatedOtp);

        const nextInput = e.target.nextElementSibling;
        if (nextInput && e.target.value) {
            nextInput.focus();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3009/otp', { email, otp: otp.join('') });
            if (response.status === 200) {
                console.log('yo'); // Ensure this runs
                navigate('/update_password', { state: { email } }); // Redirect to OTP page with email
            }
        } catch (error) {
            alert('Invalid or expired OTP');
        }
    };

    return (
        <div className="bg-black flex justify-center items-center h-screen overflow-hidden">
            <div className="bg-transparent border-2 border-purple-700  block m-10 p-6 rounded-lg">
                <h1 className="text-white text-center text-2xl mb-4">OTP Verification</h1>

                <div className="bg-transparent border-purple-700 border-2 text-sky-400 p-5 rounded-lg shadow-lg">
                    <div className="w-full  ">
                        <h1 className="mb-3 text-xl">Enter OTP</h1>
                        <div className="w-full flex">
                            {
                                otp.map((data, i) => {
                                    return <input className="w-8 m-1 h-9 bg-transparent text-white border-white border-2 text-center" type="text" maxLength={1} value={data} onChange={(e) => handleinput(e, i)}></input>
                                })
                            }
                        </div>
                    </div></div>

                <button className="w-full border-2 border-white bg-purple-700 text-white font-bold py-2 rounded-lg mt-4 hover:bg-purple-800 hover:scale-x-110" onClick={handleSubmit} >
                    Next
                </button>
            </div>
        </div>

    );
};

export default Otp;
