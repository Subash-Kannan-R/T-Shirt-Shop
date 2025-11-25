import React from "react";
import { useNavigate } from "react-router-dom";
import { HomepageTshirt } from "../assets/images"; // Import from images.js

const Poster = () => {
  const navigate = useNavigate();

  return (
    <section
      className="w-full min-h-[70vh] flex items-center bg-[#fcfcfc] relative overflow-hidden"
      style={{ fontFamily: "Georgia, serif" }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between px-8 py-16">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col items-start justify-center z-10">
          <p className="tracking-[0.5em] text-gray-500 text-lg mb-4 font-medium">NEW FASHION</p>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-4">
            Spring Summer<br />Collection
          </h1>
          <button 
            onClick={() => navigate('/shop')}
            className="mt-8 px-10 py-3 bg-red-400 hover:bg-red-500 text-white rounded font-semibold text-lg shadow transition"
          >
            SHOP NOW
          </button>
        </div>
        {/* Right: Image */}
        <div className="flex-1 flex items-center justify-center relative">
          <img
            src={HomepageTshirt}
            alt="Spring Summer Collection"
            className="w-full max-w-xl object-contain select-none"
            draggable="false"
          />
          <div
            className="absolute inset-0 rounded-full bg-white opacity-60 blur-3xl z-0"
            style={{ width: '120%', height: '120%', left: '-10%', top: '-10%' }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Poster;