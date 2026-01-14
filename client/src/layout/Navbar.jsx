import { useState, useEffect } from "react";

const Navbar = ({ toggleSideOpen }) => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).toLowerCase();

  return (
    <header className="h-16 backdrop-blur-xl bg-white/20 border-b border-white/30 
        shadow-sm flex justify-between items-center px-4 sticky top-0 z-30">

      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSideOpen}
          className="lg:hidden text-slate-900 text-2xl font-bold hover:scale-110 transition"
        >
          ☰
        </button>
        <h1 className="font-bold text-lg md:text-2xl text-slate-900 tracking-wide">
          Lulu Mobiles & Services
        </h1>
      </div>

      <div className="rounded-lg px-3 py-1 bg-slate-900 text-white text-xs md:text-sm font-medium shadow-md">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </header>
  );
};

export default Navbar;
