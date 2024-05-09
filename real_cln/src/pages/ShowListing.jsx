import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { motion as m } from "framer-motion";
import imgLoad from "../assets/imgLoad.gif";
import "../styles/showlisting.css";
import { containerVariants } from "../motion/motionStyles";

const ShowListing = () => {
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [loading_img, setLoading_img] = useState(false);

  useEffect(() => {
    setLoading_img(true);
    setTimeout(() => {
      setLoading_img(false);
    }, [1000]);
  }, []);
  
  useEffect(() => {
    const handleShowListings = async () => {
      setLoading(true);
      setLoadingTwo(true);
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser.rest._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }
        setUserListings(data);
        setLoading(false);
        setTimeout(() => {
          setLoadingTwo(false);
        }, [4000]);
        // console.log(userListings.length);
      } catch (error) {
        setShowListingsError(true);
      }
    };
    handleShowListings();
  }, []);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <m.div
      style={{ color: "black" }}
      className="showlisting-main"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            {userListings && userListings.length > 0 && (
              <>
                <div className="showlisting-container">
                  <h1 className="showlisting-heading">Your Listings</h1>
                  {userListings.map((listing) => (
                    <div
                      key={listing._id}
                      className="showlisting-container-sub"
                    >
                      <div className="showlisting-img-name-wrap">
                        <Link to={`/listing/${listing._id}`}>
                          <img
                            src={loading_img ? imgLoad : listing.imageUrls[0]}
                            alt="listing cover"
                            className="showlisting-img"
                          />
                        </Link>
                        <Link
                          to={`/listing/${listing._id}`}
                          className="show-listing-name-link"
                        >
                          <p className="showlisting-name">{listing.name}</p>
                        </Link>
                      </div>
                      {/* button */}
                      <div className="showlisting-button-div">
                        <button
                          onClick={() => handleListingDelete(listing._id)}
                          className="showlisting-bt-delete"
                        >
                          Delete
                        </button>
                        <Link to={`/update-listing/${listing._id}`}>
                          <button className="showlisting-bt-edit">Edit</button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </>
    </m.div>
  );
};

export default ShowListing;
