import React, { useState } from "react";
import { Link } from "react-router-dom";
import img_1 from "../assets/img_1.jpg";
import img_2 from "../assets/img_2.jpg";
import img_45 from "../assets/img_45.jpg";
import HomepageTshirt from "../assets/Homepage_Tshirt.png";
import Footer from "../Pages/Footer";



const About = () => (
  <div style={{ fontFamily: "Georgia, serif" }}>
    {/* Top Banner with left image */}
    <div className="w-full flex items-center px-8 py-8 min-h-[180px] bg-[#fafafa]">
      <div className="flex items-center">
        <img src={HomepageTshirt} alt="Homepage T-shirt" className="h-32 w- object-cover" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-2 text-center">About Us</h1>
        <Link to="/" className="text-xl text-black-700 hover:underline text-center">Home</Link>
      </div>
    </div>

    {/* Our Story */}
    <div className="w-full py-16 flex flex-col items-center justify-center bg-white">
  <h2 className="text-xl font-bold mb-6">Our Story</h2>
  <p className="max-w-2xl text-center text-base text-gray-700">
        In the ever-evolving world of fashion, few garments have achieved the universal appeal and cultural significance of the humble T-shirt. What began as a utilitarian undergarment has transformed into a global symbol of individuality, activism, and style. Today, T-shirts are not just clothing—they're statements.
      </p>
    </div>

    {/* About Us Section */}
    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 px-8 pb-16">
      <div className="flex-1">
  <h3 className="text-lg font-bold mb-4">About us</h3>
  <p className="text-base text-gray-700">
          Originally designed for comfort and simplicity, T-shirts have undergone a radical transformation. Modern trends embrace oversized silhouettes, cropped cuts, tie-dye patterns, and tech-infused fabrics. Brands and designers now treat T-shirts as blank canvases, splashing them with bold graphics, ironic slogans, and artistic prints that reflect the zeitgeist.
        </p>
      </div>
      <div className="flex-1 flex gap-8 justify-center">
        <img src={img_1} alt="" className="w-40 h-48 object-cover rounded" />
        <img src={img_2} alt="" className="w-40 h-48 object-cover rounded" />

      </div>
    </div>

    {/* What can we do for you? Section */}
  <div className="w-full flex flex-col md:flex-row items-center justify-center py-12 px-8 gap-8">
      {/* Left: Image */}
      <div className="flex-1 flex justify-center items-center">
        <img src={img_45} alt="About" className="max-w-xs w-full rounded-lg object-cover" />
      </div>
      {/* Right: Text and Features */}
      <div className="flex-1 max-w-xl">
        <h2 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>What can we do for you ?</h2>
        <p className="text-base text-gray-700 mb-4">
Streetwear Influence: Labels like Supreme and Off-White have elevated the T-shirt to luxury status.
Sustainability Trends: Organic cotton, recycled fibers, and ethical production are reshaping how we think about fashion.
Tech Meets Textile: Smart T-shirts with biometric sensors are pushing boundaries beyond aesthetics.        </p>
        <p className="text-base text-gray-700 mb-6">
          {/* It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. */}
        </p>
        <ul className="space-y-3">
          <li className="flex items-center text-base text-gray-800">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 rounded-full mr-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </span>
            Highly trained certified personal stylist
          </li>
          <li className="flex items-center text-lg text-gray-800">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 rounded-full mr-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </span>
            All clients get the individual look and style
          </li>
          <li className="flex items-center text-lg text-gray-800">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 rounded-full mr-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </span>
            I help people with issues of low confidence and self esteem
          </li>
          <li className="flex items-center text-lg text-gray-800">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 rounded-full mr-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </span>
            Experience with over 7,000 consultations
          </li>
        </ul>
      </div>
    </div>
    {/* Our Team Section */}
    <div className="w-full py-16 flex flex-col items-center bg-white">
      <h2 className="text-2xl font-bold mb-2 text-center">Our Team</h2>
      <p className="text-base text-center text-gray-700 mb-12">For creative businesses or projects, “Meet the Creators” adds a personal touch. It highlights the individuals behind the artistry</p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 w-full">
        {/* Team Member 1 */}
        <div className="flex flex-col items-center w-72">
          <div className="w-56 h-56 rounded-full bg-red-100 flex items-center justify-center mb-6">
            {/* <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Subash" className="w-40 h-40 rounded-full object-cover" /> */}
          </div>
          <h3 className="text-lg font-semibold mb-1">Subash</h3>
          <p className="text-gray-600 text-base">CEO/Founder</p>
        </div>
        {/* Team Member 2 */}
        <div className="flex flex-col items-center w-72">
          <div className="w-56 h-56 rounded-full bg-red-100 flex items-center justify-center mb-6">
            {/* <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Hari" className="w-40 h-40 rounded-full object-cover" /> */}
          </div>
          <h3 className="text-lg font-semibold mb-1">Hari</h3>
          <p className="text-gray-600 text-base">Accountant</p>
        </div>
        {/* Team Member 3 */}
        <div className="flex flex-col items-center w-72">
          <div className="w-56 h-56 rounded-full bg-red-100 flex items-center justify-center mb-6">
            {/* <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Subashkannan" className="w-40 h-40 rounded-full object-cover" /> */}
          </div>
          <h3 className="text-lg font-semibold mb-1">Subashkannan</h3>
          <p className="text-gray-600 text-base">Developer</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;