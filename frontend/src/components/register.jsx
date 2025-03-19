import { useState, } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

let Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showinfo, setShowinfo] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3009/register', { name, phone, email, pass });
      console.log(response)
      alert('regstered successfuly')
      navigate('/login')

    } catch (error) {
      alert('some error')
      console.log('error')
    }
  }

  return (
    <div className="bg-black flex justify-center items-center h-screen overflow-hidden">
      <div className="bg-transparent border-2 border-purple-700 block m-10 p-6 rounded-lg">
        <h1 className="text-white text-center text-2xl mb-4">Signup Page</h1>

        <div className="bg-transparent text-white mt-4">
          <div className="flex items-center border border-gray-500 rounded-lg overflow-hidden">
            <label className="bg-purple-600 text-white py-2 px-3 w-fit">Name</label>
            <input
              type="text"
              className="p-2 flex-1 bg-transparent text-white outline-none"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </div>
        </div>
        <div className="bg-transparent text-white mt-4">
          <div className="flex items-center border border-gray-500 rounded-lg overflow-hidden">
            <label className="bg-purple-600 text-white py-2 px-3 w-fit">Phone</label>
            <input
              type="tel"
              className="p-2 flex-1 bg-transparent text-white outline-none"
              placeholder="Enter your Mobile No."
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
              }}
            />
          </div>
        </div>
        <div className="bg-transparent text-white mt-4">
          <div className="flex items-center border border-gray-500 rounded-lg overflow-hidden">
            <label className="bg-purple-600 text-white py-2 px-3 w-fit">email</label>
            <input
              type="email"
              className="p-2 flex-1 bg-transparent text-white outline-none"
              placeholder="Enter your email"
              value={email}
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

        <button className="w-full border-2 border-white bg-purple-700 text-white font-bold py-2 rounded-lg mt-4 hover:bg-purple-800 hover:border-gray-500 " onClick={handleSubmit} >
          register
        </button>

        <div className="mt-3 text-center">
          <Link className="text-red-600 font-[24px]  underline" to="/login">Already have an account?</Link>
        </div>
      </div>
    </div>
  );
};

export default Register
