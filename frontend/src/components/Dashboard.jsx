import { useState, useEffect } from "react";
import Header from "./header";
import CreateTest from "./subcomponents/createTest";
import { RiDeleteBinLine } from "react-icons/ri";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";

const Dashboard = () => {
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [interviews, setInterviews] = useState([]); // Store interview data

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch("http://localhost:3009/api/interviews");
      if (response.ok) {
        const data = await response.json();
        setInterviews(data);
      } else {
        console.error("Failed to fetch interviews");
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  const toggleCreateTest = () => {
    setShowCreateTest(!showCreateTest);
  };

  const addInterview = (newInterview) => {
    setInterviews([...interviews, newInterview]); // Add new interview to the list
    setShowCreateTest(false);
  };

  const deleteInterview = async (id) => {
    try {
      const response = await fetch(`http://localhost:3009/api/interviews/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInterviews(interviews.filter((interview) => interview._id !== id)); // Remove from UI
        alert("Interview deleted successfully!");
      } else {
        alert("Failed to delete interview");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="overflow-hidden relative">
      <Header />
      <div className="flex justify-between m-10 border-b-2">
        <div className="text-purple-600 text-2xl">Dashboard</div>
        <button className="text-white bg-purple-600 p-2 m-2" onClick={toggleCreateTest}>
          Add new
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 m-5">
        {interviews.map((interview) => (
          <DashCard key={interview._id} interview={interview} onDelete={deleteInterview} />
        ))}
      </div>

      {showCreateTest && <CreateTest onClose={toggleCreateTest} onSubmit={addInterview} />}
    </div>
  );
};

const DashCard = ({ interview, onDelete }) => {
  const isExpired = new Date(interview.expiryDate) < new Date();

  if (isExpired) return null; // Hide expired cards from UI

  return (
    <div className="bg-transparent border-2 border-purple-700 p-4 rounded-lg shadow-lg">
      <h1 className="text-white text-left text-xl">{interview.jobRole}</h1>
      <p className="text-gray-200">{interview.jobDescription}</p>
      <h3 className="text-gray-200">{interview.technology}</h3>
      <p className="text-sm text-red-500">Expires on: {new Date(interview.expiryDate).toLocaleDateString()}</p>
      <div className="flex text-white items-center justify-between mt-2">
        <p className="text-sm">{new Date().toLocaleDateString()}</p>
        <div className="flex gap-2">
          <RiDeleteBinLine className="cursor-pointer" onClick={() => onDelete(interview._id)} />
          <HiArrowRightStartOnRectangle className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
