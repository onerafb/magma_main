import React, { useState } from "react";
import "../styles/create-listing.css";
import { app } from "../firebase";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { motion as m } from "framer-motion";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { containerVariants } from "../motion/motionStyles";
import toast from "react-hot-toast";
const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 5000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  //need to add -->city
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // console.log(files);
  console.log(formData);
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("Can only upload 1 or 5 images ");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);

      console.log(formData);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser.rest._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
      toast.success("Listing Created", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <m.div
      className="createlisting-main"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="createlisting-container">
        <form onSubmit={handleSubmit} className="form-listing">
          <div className="form-div-one">
            <div className="div-one">
              <input
                type="text"
                placeholder="Name"
                maxLength="62"
                minLength="10"
                onChange={handleChange}
                value={formData.name}
                id="name"
                required
                className="input-listing"
              />
              <textarea
                type="text"
                placeholder="Description"
                onChange={handleChange}
                value={formData.description}
                id="description"
                required
                className="input-listing"
              />
              <input
                type="text"
                placeholder="Address"
                onChange={handleChange}
                value={formData.address}
                id="address"
                required
                className="input-listing"
              />
            </div>
            <div className="div-two">
              <div className="check-div">
                <input
                  type="checkbox"
                  id="sale"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span>Sell</span>
              </div>
              <div className="check-div">
                <input
                  type="checkbox"
                  id="rent"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="check-div">
                <input
                  type="checkbox"
                  id="parking"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking spot</span>
              </div>
              <div className="check-div">
                <input
                  type="checkbox"
                  id="furnished"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className="check-div">
                <input
                  type="checkbox"
                  id="offer"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="div-three">
              <div className="number-div-sub">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  onChange={handleChange}
                  value={formData.bedrooms}
                  className="number-div-sub-input"
                />
                <p>Beds</p>
              </div>
              <div className="number-div-sub">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  onChange={handleChange}
                  value={formData.bathrooms}
                  className="number-div-sub-input"
                />
                <p>Baths</p>
              </div>
              <div className="number-div-sub">
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="10000000"
                  required
                  onChange={handleChange}
                  value={formData.regularPrice}
                  className="number-div-sub-input"
                />
                <div className="n-sub">
                  <p>Regular price</p>
                  {formData.type === "rent" && <span>(rs / month)</span>}
                </div>
              </div>
              {formData.offer && (
                <div className="number-div-sub">
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="10000000"
                    required
                    onChange={handleChange}
                    value={formData.discountPrice}
                    className="number-div-sub-input"
                  />
                  <div className="n-sub">
                    <p>Discount price</p>
                    {formData.type === "rent" && <span>(rs / month)</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="form-div-two">
            <div className="div-four">
              <p className="create-listing-images-title">Images</p>
              <div className="div-four-sub">
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                />
                <button
                  type="button"
                  onClick={handleImageSubmit}
                  disabled={uploading}
                  className="createlisting-upload-bt"
                >
                  {uploading ? "Uploading.." : "Upload"}
                </button>
              </div>
              <p className="image-error">
                {imageUploadError && imageUploadError}
              </p>
              <div className="overflow-listing">
                {formData.imageUrls.length > 0 &&
                  formData.imageUrls.map((url, index) => (
                    <div key={url} className="create-listing-img-div">
                      <img
                        src={url}
                        alt="listing image"
                        className="listing-image"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            {loading ? (
              <Loader />
            ) : (
              <div className="create-listing-bt-div">
                <button
                  className="create-listing-bt"
                  disabled={loading || uploading}
                >
                  Create Listing
                </button>
              </div>
            )}
            {error && <p>{error}</p>}
          </div>
        </form>
      </div>
    </m.div>
  );
};

export default CreateListing;
