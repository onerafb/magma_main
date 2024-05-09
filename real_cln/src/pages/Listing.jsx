import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { motion as m } from "framer-motion";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Loader from "../components/Loader";
import Contact from "./Contact";
import "../styles/listing.css";
import { containerVariants } from "../motion/motionStyles";
const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  console.log(listing);
  return (
    <m.main
      className="listing-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {loading && <Loader />}
      {error && <p>Something went wrong</p>}
      {listing && !loading && !error && (
        <div className="listing-container-inner">
          {/* //!work */}
          <div className="l-grid-wrap">
            <div className="l-div-one">
              {listing.imageUrls[0] && (
                <img src={listing.imageUrls[0]} alt="" className="l-ch-img" />
              )}
              <p className="no-image-l">NO IMAGE YET</p>
            </div>
            <div className="l-div-two">
              {listing.imageUrls[1] && (
                <img src={listing.imageUrls[1]} alt="" className="l-ch-img" />
              )}
              <p className="no-image-l">NO IMAGE YET</p>
            </div>
            <div className="l-div-three">
              {listing.imageUrls[2] && (
                <img src={listing.imageUrls[2]} alt="" className="l-ch-img" />
              )}
              <p className="no-image-l">NO IMAGE YET</p>
            </div>
            <div className="l-div-four">
              {listing.imageUrls[3] && (
                <img src={listing.imageUrls[3]} alt="" className="l-ch-img" />
              )}
              <p className="no-image-l">NO IMAGE YET</p>
            </div>
            <div className="l-div-five">
              {listing.imageUrls[4] && (
                <img src={listing.imageUrls[4]} alt="" className="l-ch-img" />
              )}
              <p className="no-image-l">NO IMAGE YET</p>
            </div>
          </div>

          {/* //!work */}
          <div className="listing-text">
            <p className="listingg-name">
              {listing.name} - Rs{" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="listing-address">
              <span> ADDRESS - {listing.address}</span>
            </p>
            <div className="listing-bt">
              <p>{listing.type === "rent" ? "For Rent" : "For Sale"}</p>
              {listing.offer && (
                <p>Rs.{+listing.regularPrice - +listing.discountPrice} OFF</p>
              )}
            </div>
            <p className="listing-desc">
              <span style={{ fontWeight: "bold" }}>Description:</span>
              <span>{listing.description}</span>
            </p>
            <ul className="listing-ul">
              <li>
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li>
                <FaBath />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li>
                <FaParking />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li>
                <FaChair />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser &&
              listing.userRef !== currentUser.rest._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="contact-toggle"
                >
                  Contact Landlord
                </button>
              )}
            {contact && <Contact />}
          </div>
        </div>
      )}
      <span className="opacity0">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, id
      </span>
    </m.main>
  );
};

export default Listing;
