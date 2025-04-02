import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const isHomePage = window.location.pathname === '/';

  const handleRecommendClick = (e) => {
    if (!isHomePage) {
      // If not on home page, navigate to home first
      e.preventDefault();
      navigate('/');
      
      // Scroll after the home page loads
      setTimeout(() => {
        const element = document.getElementById('crop-recommendation');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    // If already on home page, let the default hash behavior handle the scroll
  };

  return (
    <nav className="bg-green-600 p-4 pl-20">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Links to Sections */}
        <div className="flex space-x-4">
          <Link to="/" className="text-white hover:text-green-300 text-xl">
            Home
          </Link>
          <Link
            to={isHomePage ? "#crop-recommendation" : "/#crop-recommendation"}
            onClick={handleRecommendClick}
            className="text-white hover:text-green-300 text-xl"
          >
            Recommend Crop
          </Link>
          <Link to="#tips" className="text-white hover:text-green-300 text-xl">
            Tips
          </Link>
        </div>

        {/* Right Side: Login and Signup Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="bg-white text-green-600 px-3 py-2 rounded hover:bg-green-200 text-lg"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-green-600 px-3 py-2 rounded hover:bg-green-200 text-lg"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;