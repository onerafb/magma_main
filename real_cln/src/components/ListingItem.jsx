import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import imgLoad from "../assets/imgLoad.gif";
import "../styles/listing-item.css";

const ListingItem = ({ listing }) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, [1000]);
  }, []);

  return (
    <div className="listing-item-container">
      <Link to={`/listing/${listing._id}`} className="listing-item-link">
        <div className="listing-item-image-div">
          <img
            className="listing-item-image"
            src={
              loading
                ? imgLoad
                : listing.imageUrls[0] ||
                  "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
            }
            alt="listing cover"
            // loading="lazy"
          />
        </div>
        <div className="listing-item-text-div">
          <p className="listing-name">{listing.name}</p>
          <div className="listing-item-location-div">
            <MdLocationOn className="location-symbol" />
            <p className="listing-address">{listing.address}</p>
          </div>
          <p className="listing-description">{listing.description}</p>
          <p className="listing-price">
            Rs.{" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="listing-bed-bath-count">
            <div>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
