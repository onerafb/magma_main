import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import "../styles/profile.css";
import snowman from "../assets/snowman.png";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { app } from "../firebase";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { motion as m } from "framer-motion";
import { Link } from "react-router-dom";
import { containerVariants } from "../motion/motionStyles";
import { MdDelete } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";

const Profile = () => {
  //!state
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  //!init
  const dispatch = useDispatch();
  //!ref
  const fileRef = useRef(null);
  //!useSelector
  const { loading, currentUser } = useSelector((state) => state.user);
  //!function
  const handleChange = async () => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  //!function to upload image
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file); //it upload files
    //for percentage of upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  //!function to update data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser?.rest?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success(data.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  //!function to delete user
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser?.rest?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success(data.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  //!function to signOut
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      toast.success(data.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  // const handleShowListings = async () => {
  //   try {
  //     setShowListingsError(false);
  //     const res = await fetch(`/api/user/listings/${currentUser.rest._id}`);
  //     const data = await res.json();
  //     if (data.success === false) {
  //       setShowListingsError(true);
  //       return;
  //     }

  //     setUserListings(data);
  //   } catch (error) {
  //     setShowListingsError(true);
  //   }
  // };

  // const handleListingDelete = async (listingId) => {
  //   try {
  //     const res = await fetch(`/api/listing/delete/${listingId}`, {
  //       method: "DELETE",
  //     });
  //     const data = await res.json();
  //     if (data.success === false) {
  //       console.log(data.message);
  //       return;
  //     }

  //     setUserListings((prev) =>
  //       prev.filter((listing) => listing._id !== listingId)
  //     );
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  //!effect
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="profile-main">
      <div className="profile-main-div">
        <m.div
          className="profile-main-div-two"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <form onSubmit={handleSubmit} className="profile-in-form">
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              ref={fileRef}
              style={{ visibility: "hidden" }}
              accept="image/*"
              className="input-profile"
            />
            <h2 className="profile-heading">Profile</h2>
            <img
              onClick={() => fileRef.current.click()}
              src={formData?.avatar || currentUser?.rest?.avatar || snowman}
              alt="profile"
              style={{
                width: "40px",
                height: "40px",
                cursor: "pointer",
                borderRadius: "50%",
              }}
            />
            {/* <img src={currentUser.rest.avatar} alt="" /> */}
            {/* <img src={snowman} alt="" /> */}
            <p style={{ textAlign: "center", color: "white" }}>
              {fileUploadError ? (
                <span className="text-red-700">
                  Error Image upload (image must be less than 3 mb)
                </span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span className="text-green-700">
                  Image uploaded , Make sure to click save!
                </span>
              ) : (
                ""
              )}
            </p>
            <input
              type="text"
              placeholder="username.."
              defaultValue={currentUser?.rest?.username}
              id="username"
              onChange={handleChange}
              className="input-profile"
            />
            <input
              type="email"
              placeholder="email.."
              id="email"
              defaultValue={currentUser?.rest?.email}
              onChange={handleChange}
              className="input-profile"
            />
            <input
              type="password"
              placeholder="password.."
              onChange={handleChange}
              id="password"
              className="input-profile"
            />
            {loading ? (
              <Loader />
            ) : (
              <button disabled={loading} className="profile-bt mg-bottom-zero">
                SAVE
              </button>
            )}
            {currentUser?.rest?.role == "admin" && (
              <Link to="/create-listing" className="listing-link">
                Create Listing
              </Link>
            )}
          </form>
          {currentUser?.rest?.role == "admin" && (
            <div className="show-listing-div">
              <button className="show-listing-bt">
                <Link to="/show-listing" className="showlisting-link">
                  show Listing
                </Link>
              </button>
            </div>
          )}
          <div className="d-a-s">
            <button className="bt-link" onClick={handleSignOut}>
              <FaSignOutAlt className="signout-icon" />
            </button>
            <button className="bt-link-two" onClick={handleDeleteUser}>
              <MdDelete className="delete-icon" />
            </button>
          </div>

          <p className="profile-error">
            {showListingsError ? "Error showing listings" : ""}
          </p>

          {/* {userListings && userListings.length > 0 && (
            <div>
              <h1>Your Listings</h1>
              {userListings.map((listing) => (
                <div key={listing._id}>
                  <Link to={`/listing/${listing._id}`}>
                    <img src={listing.imageUrls[0]} alt="listing cover" />
                  </Link>
                  <Link to={`/listing/${listing._id}`}>
                    <p>{listing.name}</p>
                  </Link>

                  <div>
                    <button onClick={() => handleListingDelete(listing._id)}>
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button>Edit</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )} */}
        </m.div>
      </div>

      <div className="custom-shape-divider-bottom-1705946508">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Profile;
