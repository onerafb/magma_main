import {
  containerVariants,
  containerVariantsTwo,
} from "../motion/motionStyles";
import "../styles/about.css";
import { motion as m } from "framer-motion";
const About = () => {
  return (
    <m.div
      className="about-div"
      initial="hidden"
      animate="visible"
      variants={containerVariantsTwo}
    >
      <div className="about-container">
        <h2 style={{ textAlign: "center", color: "white", marginTop: "10px" }}>
          About
        </h2>
        <div>
          <p>
            Welcome to DreamHomeFinder.com, your premier destination for finding
            your dream home! Whether you're in the market to buy, rent, or sell,
            our user-friendly platform connects you with a vast array of
            properties tailored to your preferences. Explore Your Options:
            Browse through thousands of listings from across the globe, spanning
            cozy apartments, sprawling estates, charming townhouses, and
            lucrative commercial spaces. Our intuitive search interface allows
            you to filter properties by location, price range, property type,
            and amenities, ensuring you find the perfect fit for your needs and
            budget. Detailed Property Profiles: Clicking on a listing unveils
            comprehensive property profiles complete with high-resolution
            images, detailed descriptions, floor plans, and virtual tours. Get a
            feel for the property's layout, amenities, and surrounding
            neighborhood.
          </p>
        </div>
      </div>
    </m.div>
  );
};

export default About;
