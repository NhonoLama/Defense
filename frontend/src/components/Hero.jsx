import React from "react";
import "./Hero.css";
import Search from "./Search";

const Hero = () => {
  return (
    <section className="hero">
      <h1>Welcome</h1>
      <div className="searchContain">
        <p>AI-Driven Sentiment in Movie Reviews. Explore Now.</p>
        <Search />
      </div>
    </section>
  );
};

export default Hero;
