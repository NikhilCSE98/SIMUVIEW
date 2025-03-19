import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


let Login = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [showinfo, setShowinfo] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3009/login', { email, pass });
            const { token } = response.data;

            if (token) {
                localStorage.setItem('jwt', token);
                console.log('token', token)
                alert('login successfully');
                navigate("/")
            }
            else {
                alert('error due to mistake in credentials')
            }
        }
        catch (error) {
            alert("an error occured", error)
        }

    }
    return (
        <div className="bg-black flex justify-center items-center h-screen overflow-hidden">
            <div className="bg-transparent border-2 border-purple-700  block m-10 p-6 rounded-lg">
                <h1 className="text-white text-center text-2xl mb-4">Login Page</h1>

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

                <div className="bg-transparent text-white mt-4">
                    <div className="flex items-center border border-gray-500 rounded-lg overflow-hidden">
                        <label className="bg-purple-600 text-white py-2 px-3 w-fit">Password</label>
                        <input
                            type="password"
                            className="p-2 flex-1 bg-transparent text-white outline-none"
                            placeholder="Enter your password"
                            value={pass}
                            onChange={(e) => {
                                setPass(e.target.value)
                            }}
                        />
                    </div>
                </div>
                <div className="mt-2 text-left">
                    <Link className="text-white font-[20px] " to="/forgot_password">Forgot Password?</Link>
                </div>

                <button className="w-full border-2 border-white bg-purple-700 text-white font-bold py-2 rounded-lg mt-4 hover:bg-purple-800 hover:border-gray-500 " onClick={handleSubmit} >
                    Login
                </button>

                <div className="mt-3 text-center">
                    <Link className="text-red-600 font-[24px]  underline" to="/register">Create new account ?</Link>
                </div>
            </div>
        </div>

    );
};

export default Login
