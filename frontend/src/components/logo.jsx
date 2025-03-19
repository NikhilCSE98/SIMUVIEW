import logo from "../assets/logo.png"
const Logo = () => {
    return (<div className="h-8 w-8 ml-5 flex">
        <img alt="Semiview" src={logo}></img>
        <div className="text-white text-2xl">
            <p>SimuView</p>
        </div>
    </div>)
}

export default Logo;
