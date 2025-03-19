import Header from "./header";
import { TypeAnimation } from "react-type-animation";
import PlayCubic from "./subcomponents/playCubic";
import image1 from "../assets/image.webp"
import image2 from "../assets/image(1).webp"
import image3 from "../assets/image(2).webp"
import image4 from "../assets/image(3).webp"
import CreateTest from "./subcomponents/createTest";

const Home = () => {
    return (
        <div>
            <Header />
            <section className="flex flex-col lg:flex-row p-6 lg:p-12 bg-gray-800 justify-between items-center">
                <div className="w-full lg:w-[600px] text-left lg:ml-20  lg:text-left">
                    <h1 className="text-white text-4xl md:text-5xl mb-2 font-bold">
                        Ace Your
                    </h1>
                    <div className="text-purple-600 text-xl md:text-5xl mb-2 font-bold">
                        <TypeAnimation
                            sequence={[
                                "Business",
                                1000,
                                "Behaviour",
                                1000,
                                "Legal",
                                1000,
                                "Data Science",
                                1000,
                                "Software",
                                1000,
                                "Marketing",
                                1000,
                            ]}
                            wrapper="span"
                            speed={50}
                            style={{ display: "inline-block" }}
                            repeat={Infinity}
                        />
                    </div>
                    <p className="text-gray-300 font-bold text-lg md:text-xl">
                        Prepare for your interviews with real-time voice-to-voice mock interviews with the world's most advanced AI. Say goodbye to interview performance anxiety. Master any role, any level, any industry, and land your dream job. Get detailed feedback on your answers and suggestions to improve them.
                    </p>
                    <button className="px-6 py-3 text-lg md:text-xl border-2 bg-purple-700 text-white rounded-lg mt-6 hover:bg-purple-800 hover:border-gray-500 border-black">
                        Try a Free Mock Interview Now
                    </button>
                    <p className="text-gray-300 font-bold text-lg md:text-xl mt-8">
                        Recent Interviews Aced By Our Users
                    </p>
                    <div className="w-2/3 border-black border-2 p-2  mt-5">
                        <marquee behavior="scroll" direction="left" scrollamount="4" loop="infinite">
                            <div className="flex gap-6">
                                <img className="h-10 object-contain" src={image1} alt="Airbnb" />
                                <img className="h-10 object-contain" src={image2} alt="Amazon" />
                                <img className="h-10 object-contain" src={image3} alt="Google" />
                                <img className="h-10 object-contain" src={image4} alt="Meta" />
                            </div>
                        </marquee>

                    </div>
                </div>
                <div className="bg-transparent mt-8 lg:mt-0 lg:mr-20 h-[300px] md:h-[400px] lg:h-[500px] w-full max-w-sm flex justify-center items-center">
                    <PlayCubic />
                </div>
            </section>
        </div>
    );
};

export default Home;
