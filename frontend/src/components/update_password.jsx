import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";


let Update_Password = () => {
    const [cPass, setCpass] = useState('');
    const [pass, setPass] = useState('');
    const { email } = location.state || {};

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (pass == cPass) {
                const response = await axios.post('http//localhost:3009/update_password', { email, pass })
                if (response.status === 200) {
                    navigate('/login');
                }
            }
            else {
                console.log('password is not matching')
            }
        }
        catch (error) {
            alert("an error occured", error)
        }

    }
    return (
        <div className="bg-black flex justify-center items-center h-screen overflow-hidden">
            <div className="bg-transparent border-2 border-purple-700  block m-10 p-6 rounded-lg">
                <h1 className="text-white text-center text-2xl mb-4">Update Password</h1>

                <div className="bg-transparent text-white">
                    <div className="flex items-center border border-gray-500 rounded-lg overflow-hidden">
                        <label className="bg-purple-600 text-white py-2 px-3 w-fit">New Password</label>
                        <input
                            type="password"
                            className="p-2 flex-1 bg-transparent text-white outline-none"
                            value={pass}
                            placeholder="Enter new password"
                            onChange={(e) => {
                                setPass(e.target.value)
                            }}
                        />
                    </div>
                </div>

                <div className="bg-transparent text-white mt-4">
                    <div className="flex items-center border border-gray-500 rounded-lg overflow-hidden">
                        <label className="bg-purple-600 text-white py-2 px-3 w-fit">Confirm Password</label>
                        <input
                            type="password"
                            className="p-2 flex-1 bg-transparent text-white outline-none"
                            placeholder="Enter Confirm password"
                            value={cPass}
                            onChange={(e) => {
                                setCpass(e.target.value)
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

export default Update_Password;
