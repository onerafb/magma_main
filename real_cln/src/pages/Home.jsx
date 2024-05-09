import { useEffect, useState, useRef } from "react";
import { motion as m } from "framer-motion";
import { containerVariantsTwo } from "../motion/motionStyles";
import LocomotiveScroll from "locomotive-scroll";
import one from "../assets/one.mp4";
import "../styles/home.css";
import right from "../assets/right-arrow.gif";
import { Link } from "react-router-dom";
const Home = () => {
  //locomotive
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });
    return () => {
      scroll.destroy();
    };
  }, []);
  //effect

  return (
    <>
      <div className="scroll-container home-main" ref={scrollRef}>
        <m.div
          className="home-main-one"
          initial="hidden"
          animate="visible"
          variants={containerVariantsTwo}
          data-scroll
          data-scroll-speed={-5}
        >
          <video
            src={one}
            autoPlay
            muted
            loop
            className="home-main-one-vid"
          ></video>
          <div className="home-main-one-overlay-text">
            <p className="p-one-home">
              Experience Real <br />
              Estate Agility
            </p>
            <p className="p-two-home">End your long search {"(DTT®)"}</p>
            <Link to="/about">
              <button style={{whiteSpace:"nowrap"}}>LEARN MORE</button>
            </Link>
          </div>
        </m.div>
        <div className="home-main-two" data-scroll data-scroll-speed={0}>
          <div className="home-main-two-container">
            <div
              className="home-desc-div"
              initial="hidden"
              animate="visible"
              variants={containerVariantsTwo}
            >
              <p>FIND YOUR DREAM HOME (DTT®)</p>
              <h1>
                Welcome to our trusted real estate platform! Explore a curated
                selection of homes tailored to your lifestyle. Let our
                experienced agents guide you with transparency and integrity.
              </h1>
            </div>
          </div>
        </div>
        <div className="home-main-three" data-scroll data-scroll-speed={-2}>
          <Link to="/home" className="hometwo-linkfhome">
            <div className="home-main-three-container">
              <p>SEE PROPERTIES</p>
              <img src={right} alt="" className="home-three-arrow" />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
