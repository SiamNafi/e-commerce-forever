/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import UseShop from "../utils/UseShop";
import axios from "axios";
import { toast } from "react-toastify";
import { ImSpinner9 } from "react-icons/im";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { backendUrl, token, setToken, navigate } = UseShop();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (currentState === "Sign Up") {
        const res = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          toast.success("Register Successful");
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          toast.success("Login Successful");
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.log("error in login component", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {/* input fields */}
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          type="text"
          className="w-full px-3 py-2 border border-gray-800 outline-none"
          placeholder="Name"
        />
      )}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        type="email"
        className="w-full px-3 py-2 border border-gray-800 outline-none"
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        type="password"
        className="w-full px-3 py-2 border border-gray-800 outline-none"
        placeholder="Password"
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer hover:text-pink-500">
          Forgot you password?
        </p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer hover:text-pink-500"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer hover:text-pink-500"
          >
            Login here
          </p>
        )}
      </div>
      <button className="bg-black flex items-center justify-center text-white font-light px-8 py-2 cursor-pointer hover:bg-transparent hover:text-black border hover:border-black transition-all">
        {loading ? (
          <ImSpinner9 size={20} className="animate-spin" />
        ) : currentState === "Login" ? (
          "Sign In"
        ) : (
          "Sign Up"
        )}{" "}
      </button>
    </form>
  );
};

export default Login;
