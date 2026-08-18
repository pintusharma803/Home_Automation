import { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";


// If you're using React Router, uncomment the next line and replace <a> with <Link>

export default function Home() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const {user} = useAuth();
  const isAuthenticated = !!user;
  const handleLogin = () => {
    navigate('/login');
    if(isAuthenticated){
      navigate('/profile/dashboard');
    }
  }

  useEffect(() => {
    const text = "PiezoPulse!";
    let index = 0;
    let deleting = false;
    let timeoutId;

    const animateText = () => {
      if (!deleting) {
        setTypedText(text.substring(0, index));
        index++;

        if (index > text.length) {
          deleting = true;
          timeoutId = setTimeout(animateText, 1200); // Pause
          return;
        }
      } else {
        setTypedText(text.substring(0, index));
        index--;

        if (index < 0) {
          deleting = false;
          index = 0;
        }
      }

      timeoutId = setTimeout(animateText, deleting ? 150 : 150);
    };

    animateText();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[radial-gradient(circle_at_bottom_left,_#1d4f92_0%,_#123165_40%,_#08172e_100%)]">
      {/* Navbar */}
      <header className="fixed top-5 right-4 md:right-8 z-[1000]">
        <div className="flex gap-2.5 md:gap-4">
          <button
            onClick={handleLogin}
            className="font-poppins text-sm md:text-[15px] font-semibold px-4 py-2 md:px-6 md:py-2.5 rounded-lg text-white border-2 border-white bg-transparent transition-all duration-300 hover:bg-white hover:text-[#123165] hover:-translate-y-1 hover:shadow-[0_8px_18px_rgba(255,255,255,0.25)]"
          >
            Login
          </button>
          <Link
            to='/register'
            className="font-poppins text-sm md:text-[15px] font-semibold px-4 py-2 md:px-6 md:py-2.5 rounded-lg text-white bg-[#ff3d5b] border-2 border-[#ff3d5b] transition-all duration-300 hover:bg-[#ff2248] hover:border-[#ff2248] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,61,91,0.4)]"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div>
        <div className="text-center px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-2.5 font-poppins">
            Welcome to <span className="text-[#00d4ff] font-bold">{typedText}</span>
          </h1>
          <p className="text-white/45 text-lg md:text-2xl font-light font-poppins">
            Where Ideas Become Electronics
          </p>
          <a href="/login">
            <button className="mt-10 w-[220px] md:w-auto px-5 py-3 md:px-10 md:py-3.5 font-poppins text-base md:text-lg font-semibold text-white bg-[#ff3d5b] border-none rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#ff2248] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,61,91,0.35)] active:scale-[0.98]">
              Get Started
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

