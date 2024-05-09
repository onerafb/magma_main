import { Link, useNavigate } from "react-router-dom";
import "../styles/signup.css";
import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import OAuth from "../components/OAuth";
import { motion as m } from "framer-motion";
import { containerVariants } from "../motion/motionStyles";

const SignUp = () => {
  //!state
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  //!init
  const navigate = useNavigate();
  //!function one
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  //!function two
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //!state
      setLoading(true);
      //!fetching data
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      //!init data
      const data = await res.json();
      //!log
      // console.log(data);
      //!check error
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      //!state
      setLoading(false);
      setError(null);
      //!toast
      toast.success(data.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="signup-main">
      <div className="signup-main-div">
        <m.div
          className="signup-main-div-two"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h2 className="signup-heading">Sign Up</h2>
          <OAuth />
          <div className="line mg-top-zero"></div>
          <form className="sign-up-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="username.."
              id="username"
              onChange={handleChange}
              className="input-signup"

              // required
            />
            <input
              type="email"
              placeholder="email.."
              id="email"
              onChange={handleChange}
              className="input-signup"

              // required
            />
            <input
              type="password"
              placeholder="password.."
              id="password"
              onChange={handleChange}
              className="input-signup"

              // required
            />
            {loading ? (
              <Loader />
            ) : (
              <button className="signup-bt">SIGN UP</button>
            )}
          </form>
          <p className="signup-link-p">
            Aready a user ?{" "}
            <Link className="signup-navigate-link" to="/sign-in">
              Sign in
            </Link>
          </p>
        </m.div>
        {/* {error && (
        <p className="signup_error mg-top-one" key={error}>
          {error}
        </p>
      )} */}
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

export default SignUp;
