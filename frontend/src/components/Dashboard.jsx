import { useState, useEffect } from "react";
import Header from "./header";
import CreateTest from "./subcomponents/createTest";
import { RiDeleteBinLine } from "react-icons/ri";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";
import { jwtDecode } from "jwt-decode";
import { HiOutlineClipboardList } from "react-icons/hi";

const Dashboard = () => {
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("User not authenticated!");
        return;
      }

      const decodedToken = jwtDecode(token);
      const loggedInUserId = decodedToken.id;

      const response = await fetch("http://localhost:3009/api/interviews/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        let data = await response.json();
        data = data.filter(
          (interview) =>
            new Date(interview.expiryDate) >= new Date() &&
            interview.userId === loggedInUserId
        );
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
    setInterviews([...interviews, newInterview]);
    setShowCreateTest(false);
  };
  const onCheckList = async (interviewId) => {
    try {
      const feedbackRes = await fetch("http://localhost:3009/api/get-feedbacks-userid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interviewId }),
      });

      if (!feedbackRes.ok) throw new Error("Failed to fetch feedbacks");

      const { feedbacks } = await feedbackRes.json();
      const userIds = [...new Set(feedbacks.map(fb => fb.userId))];

      const users = await Promise.all(userIds.map(async (id) => {
        try {
          const res = await fetch(`http://localhost:3009/user-details?id=${id}`);

          if (!res.ok) throw new Error(`User fetch failed`);
          return await res.json();
        } catch (err) {
          console.error(`Error fetching user ${id}`, err);
          return null;
        }
      }));

      setUserList(users.filter(Boolean));
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteInterview = async (id) => {
    try {
      const response = await fetch(`http://localhost:3009/api/interviews/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInterviews(interviews.filter((interview) => interview._id !== id));
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
          <DashCard
            key={interview._id}
            interview={interview}
            onDelete={deleteInterview}
            onCheckList={onCheckList}
          />
        ))}
      </div>

      {showCreateTest && <CreateTest onClose={toggleCreateTest} onSubmit={addInterview} />}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-transparent text-white border-2 border-purple-600 p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">User List</h2>
            <table className="table-auto w-full text-white border border-purple-600">
              <thead>
                <tr className="bg-purple-800">
                  <th className="p-2 border border-purple-600 text-left">ID</th>
                  <th className="p-2 border border-purple-600 text-left">Name</th>
                  <th className="p-2 border border-purple-600 text-left">Email</th>
                  <th className="p-2 border border-purple-600 text-left">Score</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user, index) => (
                  <tr key={index} className="hover:bg-purple-700">
                    <td className="p-2 border border-purple-600">{index}</td>
                    <td className="p-2 border border-purple-600">{user.name || "N/A"}</td>
                    <td className="p-2 border border-purple-600">{user.email || "N/A"}</td>

                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DashCard = ({ interview, onDelete, onCheckList }) => {
  const isExpired = new Date(interview.expiryDate) < new Date();

  if (isExpired) return null;

  return (
    <div className="bg-transparent border-2 border-purple-700 p-4 rounded-lg shadow-lg">
      <h1 className="text-white text-left text-xl">{interview.jobRole}</h1>
      <p className="text-gray-200">{interview.jobDescription}</p>
      <h3 className="text-gray-200">{interview.technology}</h3>
      <p className="text-sm text-red-500">Expires on: {new Date(interview.expiryDate).toLocaleDateString()}</p>
      <div className="flex text-white items-center justify-between mt-2">
        <p className="text-sm">{new Date().toLocaleDateString()}</p>
        <div className="flex gap-2">
          <HiOutlineClipboardList className="cursor-pointer" onClick={() => onCheckList(interview._id)} />

          <RiDeleteBinLine className="cursor-pointer" onClick={() => onDelete(interview._id)} />
          <HiArrowRightStartOnRectangle className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
