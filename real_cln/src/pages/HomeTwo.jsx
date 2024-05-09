import React, { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import "../styles/home-two.css";

const HomeTwo = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(false);
  //effect
  useEffect(() => {
    setLoading(true);
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    // setLoading(true);

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    // setLoading(true);

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
    setLoading(false);
  }, []);
  return (
    <div className="home-two-main">
      {loading ? (
        <Loader />
      ) : (
        <div className="home-two">
          {offerListings && offerListings.length > 0 && (
            <div>
              <div className="home-two-heading-div">
                <h2 className="home-two-heading">Recent offers</h2>
                <Link to={"/search?offer=true"} className="home-two-link">
                  Show more offers
                </Link>
              </div>
              <div className="home-two-grid">
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {rentListings && rentListings.length > 0 && (
            <div>
              <div className="home-two-heading-div">
                <h2 className="home-two-heading">Recent places for rent</h2>
                <Link to={"/search?type=rent"} className="home-two-link">
                  Show more places for rent
                </Link>
              </div>
              <div className="home-two-grid">
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {saleListings && saleListings.length > 0 && (
            <div>
              <div className="home-two-heading-div">
                <h2 className="home-two-heading">Recent places for sale</h2>
                <Link to={"/search?type=sale"} className="home-two-link">
                  Show more places for sale
                </Link>
              </div>
              <div className="home-two-grid">
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          <div className="lorem">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            eligendi recusandae saepe repellat iusto quo facere eius soluta
            voluptatum animi perferendis eos consequuntur, illo sed! Facere,
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeTwo;
