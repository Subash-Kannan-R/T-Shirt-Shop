import React from "react";
import Poster from "../Components/Poster";
import FeaturedProducts from "../Components/Home/FeaturedProducts";
import CategoriesGrid from "../Components/Home/CategoriesGrid";
import Features from "../Components/Home/Features";
import Newsletter from "../Components/Home/Newsletter";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Poster />
      <CategoriesGrid />
      <FeaturedProducts />
      <Features />
      <Newsletter />
    </div>
  );
};

export default Home;