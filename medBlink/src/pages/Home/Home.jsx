import React, { useState } from "react";

// COMPONENTS
import ExploreCategories from "../../components/ExploreCategories/ExploreCategories";
import Header from "../../components/Header/Header";
import ProductsList from "../../components/ProductsList/ProductsList";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <>
      <main className="container">
        <Header />
        <ExploreCategories category={category} setCategory={setCategory} />
        <ProductsList category={category} searchProduct={""} />
      </main>
      <Footer />
    </>
  );
};

export default Home;
