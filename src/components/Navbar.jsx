import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-green-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Links to Sections */}
        <div className="flex space-x-4">
          <Link to="#weather" className="text-white hover:text-green-200">
            Weather
          </Link>
          <Link
            to="#crop-recommendation"
            className="text-white hover:text-green-200"
          >
            Crop Recommendation
          </Link>
          <Link to="#tips" className="text-white hover:text-green-200">
            Tips
          </Link>
        </div>

        {/* Right Side: Login and Signup Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="bg-white text-green-600 px-4 py-2 rounded hover:bg-green-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-green-600 px-4 py-2 rounded hover:bg-green-200"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
