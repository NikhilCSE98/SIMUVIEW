import axios from "axios"
import { NavLink } from "react-router-dom"
import { Bluetooth, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

const NavLinks = () => {
    const [userData, setUserData] = useState({});

    const getUser = async () => {
        try {
            const token = localStorage.getItem("jwt"); // Retrieve token from local storage
            const response = await axios.get("http://localhost:3009/login/success", {
                headers: { Authorization: `Bearer ${token}` }, // Send token in headers
                withCredentials: true
            });
            setUserData(response.data.user);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        getUser()
    }, [])

    return (<>

        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About us</NavLink>
        {Object?.keys(userData)?.length === 0 && (
            <NavLink to="/Login">Login</NavLink>)
        }
        {Object?.keys(userData)?.length === 0 && (
            <NavLink to="/signup">sign up</NavLink>)
        }
        {Object?.keys(userData)?.length > 0 && (
            <NavLink to="/dashboard">Dashboard</NavLink>)
        }

    </>)
}

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleNavbar = () => {
        setIsOpen(!isOpen)
    }

    return (<>
        <nav className="w-1/3 flex justify-end">
            <div className="hidden w-full md:flex justify-between text-white">
                <NavLinks />
            </div>
            <div className="text-white md:hidden ">
                <button onClick={toggleNavbar}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>
        </nav>
        {
            isOpen && (
                <div className=" flex flex-col items-center basis-full text-white">
                    <NavLinks />
                </div>
            )
        }
    </>)
}
export default Nav