
import React from "react";
import { Link } from "react-router-dom";
import tshirtBanner from "../assets/Homepage_Tshirt.png";
import tshirtImg from "../assets/img_45.jpg";
import Footer from "../Pages/Footer";

const Contact = () => (
  <div className="w-full min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Georgia, serif' }}>
    {/* Top Banner */}
    <div className="w-full flex items-center bg-[#f3f3f3] px-8 py-8 min-h-[180px]">
      <div className="flex-1 flex items-center justify-start">
        <img src={tshirtBanner} alt="T-shirt" className="h-32 object-contain" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-2 text-center">Contact Us</h1>
        <Link to="/" className="text-base text-gray-700 hover:underline text-center">Home</Link>
      </div>
      <div className="flex-1"></div>
    </div>

    {/* Main Contact Content */}
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-white shadow-none mt-0">
      {/* Left: Image */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-[#f6f6f6] min-h-[600px]">
        <img src={tshirtImg} alt="Contact" className="object-contain h-[420px]" />
      </div>
      {/* Right: Contact Info & Form */}
      <div className="md:w-1/2 w-full flex flex-col px-8 py-10">
        <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
        <p className="text-gray-700 mb-6">If you have any questions, please fell free to get in touch with us. We will reply to you as soon as possible. Thank you!</p>
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4">
            <span className="bg-red-200 rounded-full w-10 h-10 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </span>
            <div>
              <div>Mobile 1: (+91) 8838506695</div>
              <div>Mobile 2: (+91) 93604 84391 </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-red-200 rounded-full w-10 h-10 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V6a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" /></svg>
            </span>
            <div>20 Masthan Ali Garden,<br />Chennai,India</div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-red-200 rounded-full w-10 h-10 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 01-8 0m8 0a4 4 0 00-8 0" /></svg>
            </span>
            <div>
              <div>subashkannan0309@gmail.com</div>
              <div>subashkannanramesh@gmail.com</div>
            </div>
          </div>
        </div>
        <form className="w-full" onSubmit={e => e.preventDefault()}>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Your Name (required)</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none" placeholder="Your name" required />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Your Email (required)</label>
              <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none" placeholder="Your email" required />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Your Message</label>
            <textarea className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none" rows="5" placeholder="Your message" required></textarea>
          </div>
          <button type="submit" className="bg-red-400 text-white px-8 py-2 rounded font-semibold tracking-widest hover:bg-red-500 transition">SUBMIT</button>
        </form>
      </div>
    </div>
    <Footer />
  </div>
);

export default Contact;
