"use client";
import { useEffect, useState } from "react";
import { FaAngleUp } from "react-icons/fa6";

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      id="to-top-button"
      onClick={scrollToTop}
      title="Go To Top"
      aria-label="Go to top"
      className={`fixed z-40 bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-br from-green-600 to-green-500 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
        showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <FaAngleUp className="text-lg" />
    </button>
  );
};

export default ScrollToTop;
