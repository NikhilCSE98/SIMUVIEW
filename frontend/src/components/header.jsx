import Logo from "./logo";
import Nav from "./nav"
const Header = () => {
    return (
        <div className=" sticky top-0 flex-wrap z-[20] mx-auto w-full flex items-center justify-between border-gray-500 p-4  bg-[rgb(34,10,28)]">
            <Logo />
            <Nav />
        </div>
    );
};

export default Header;
