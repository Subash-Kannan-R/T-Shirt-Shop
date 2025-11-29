import React from "react";
import Poster from "../Components/Poster";
import FeaturedProducts from "../Components/Home/FeaturedProducts";
import Features from "../Components/Home/Features";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Poster />
      <FeaturedProducts />
      <Features />
    </div>
  );
};

export default Home;