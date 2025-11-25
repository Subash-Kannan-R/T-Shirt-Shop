import React from "react";
import img_11 from "../assets/img_11.jpg";
import img_12 from "../assets/img_12.jpg";
import img_16 from "../assets/img_16.jpg";
import img_17 from "../assets/img_17.jpg";
import img_38 from "../assets/img_38.jpg";
import img_39 from "../assets/img_39.jpg";

const products = [
  {
    name: "COLLAR T-SHIRT",
    image: img_11,
  },
  {
    name: "Relaxed Fit Printed Sweatshirt",
    image: img_12,
  },
  {
    name: "ROUNDNECK T-SHIRT",
    image: img_16,
    // removed price and sale percent
  },
  {
    name: "Relaxed Fit Rib-knit Jumper",
    image: img_17,
  },
  {
    name: "HOODIE T-SHIRT",
    image: img_38,
  },
  {
    name: "Woman’s Green Hoodie",
    image: img_39,
    // removed price and sale percent
  },
];

const Roundneck = () => (
  <div
    className="w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-100 via-white to-gray-50"
    style={{ fontFamily: "Georgia, serif" }}
  >
    {/* Left: Product Grid */}
    <div className="md:w-1/2 w-full p-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 tracking-wide">
        OUR COLLECTION
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {products.map((product, idx) => (
          <div
            key={idx}
            className="relative bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer group"
          >
            {/* (price and sale badge removed) */}

            {/* Product Image */}
            <div className="w-full h-56 flex items-center justify-center bg-gray-50 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-48 h-48 object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Product Info */}
            <div className="p-5 text-center">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                {product.name}
              </h3>

              {/* price removed intentionally */}
            </div>

            {/* Subtle bottom border on hover */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>
    </div>

    {/* Right: Large Preview Image */}
    <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100 min-h-[600px] p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/20 to-transparent pointer-events-none" />
      <img
        src={img_17}
        alt="Roundneck Model"
        className="object-contain h-[500px] drop-shadow-2xl transition-transform duration-700 ease-in-out hover:scale-105"
        draggable="false"
      />
    </div>
  </div>
);

export default Roundneck;
