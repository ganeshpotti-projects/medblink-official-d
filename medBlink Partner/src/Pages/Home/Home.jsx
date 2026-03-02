import React, { useContext } from "react";

// ASSETS
import { assets } from "../../assets/assets";

// CONTEXT
import { PartnerContext } from "../../context/PartnerContext.jsx";

// COMPONENTS
import Loading from "../../Components/Loading/Loading.jsx";
import PartnerStats from "../../Components/PartnerStats/PartnerStats.jsx";

const Home = () => {
  const { stats, loading } = useContext(PartnerContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Loading />
      </div>
    );
  }

  return (
    <div className=" mt-4">
      <div className="mx-3 mb-4">
        <img
          src={assets.homePageBanner}
          alt="Partner Dashboard Banner"
          className="rounded-4 shadow-sm"
          style={{ width: "100%", objectFit: "cover", maxHeight: "225px" }}
        />
      </div>
      <PartnerStats stats={stats} />
    </div>
  );
};

export default Home;
