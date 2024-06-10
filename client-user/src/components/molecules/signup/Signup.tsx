import React, { useState } from "react";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import LogoText from "@/components/atoms/logoText/LogoText";
import MiniLogoText from "@/components/atoms/miniLogoText/MiniLogoText";
import { useRouter } from "next/router";
import { auth } from "@/helpers/FirebaseConfig";
import { API_BASE_URL } from "@/config";
import Cookies from "js-cookie";
import PopUp from "./popUp";
import useStudent from "@/store/useStudent";
const provider = new GoogleAuthProvider();

const SignUp = () => {
  const router = useRouter();
  const email = useStudent((s) => s.email);
  const setEmail = useStudent((s) => s.setEmail);
  const name = useStudent((s) => s.name);
  const setName = useStudent((s) => s.setName);
  const [checkEmail, setCheckEmail] = useState(false);
  const [open, setOpen] = useState(false);
  const handleEmailChange = (e: any) => setEmail(e.target.value);
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // Handle successful sign-in
        const user: any = result.user;
        Cookies.set("loggedin", "true");
        setEmail(user?.email);
        setName(user?.email.split("@")[0]);
        localStorage?.setItem("token", user?.accessToken);
        console.log("User:", user);
        console.log("name", user?.email.split("@")[0]);
        await onClickContinue(user?.email, user?.email.split("@")[0]);
      })
      .catch((error: any) => {
        // Handle sign-in error
        console.log("error", error);
      });
  };
  //post api
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (email === null || email === undefined) {
      return;
    }
  };
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  async function onClickContinue(email: string, name: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/student`, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: email, name: name, Progress: {} }),
      });
      const data = await response.json();
      console.log("dataa", data);
      if (
        data?.message?.includes(
          "E11000 duplicate key error collection: server.students"
        )
      ) {
        setCheckEmail(true);
        setOpen(true);
      }
      if (response.ok) {
        localStorage.setItem("studentId", JSON.stringify(data.data.id));
        router.push(`/auth/avatar?email=${encodeURIComponent(email)}`);
      }
      if (!response.ok) {
        throw new Error(data.message || "Check your credentials");
      }
    } catch (err: any) {
      console.error(err);
      if (
        err.message.includes(
          "E11000 duplicate key error collection: server.students"
        )
      ) {
        setCheckEmail(true);
        setOpen(true);
      }
    }
  }
  const handleClose = () => {
    // Update the state in the parent component
    setOpen(false);
  };
  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-row justify-center items-center xl:justify-around">
          <div>
            <img
              src="/signUpImage.svg"
              alt="logo"
              className="md:m-2 md:h-[calc(100vh-36px)] md:w-[calc(90vw-36px)] xl:h-[calc(100vh-30px)] xl:w-full"
              // className="h-full 2xl:h-5/6 w-5/6 2xl:w-full"
            />
          </div>
          <div className="flex flex-col justify-center items-center align-center md:w-1/2 mr-5">
            <div className="items-center justify-center">
              <LogoText />
            </div>
            <div className="flex flex-row mt-5 md:mt-10">
              <MiniLogoText />
            </div>
            {/* <input
              type="text"
              // value={email}
              onChange={(e) => {
                handleEmailChange(e);
                if (checkEmail) setCheckEmail(false);
              }}
              placeholder="Enter email address"
              className={`p-3 border border-[#757575] rounded-full w-[28rem] md:mt-10 md:ml-10 ${
                checkEmail && "!border-red-500"
              }`}
            />
            {checkEmail && (
              <p className="text-red-500">* Email already exists</p>
            )}
            <button
              // onClick={onClickContinue}
              className="bg-[#505DAA] text-white rounded-full py-2 font-bold px-[12rem] mt-5 md:mt-10 md:ml-10"
            >
              Continue
            </button> */}
            <p className="text-base font-bold mt-2 lg:my-5">sign up with</p>
            <div className="flex flex-row space-x-4 mt-3 lg:my-3">
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500"
              >
                <FaGoogle className="text-white" size={30} />
              </button>
              {/* <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500">
                <FaFacebook className="text-white" size={30} />
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500">
                <FaTwitter className="text-white" size={30} />
              </div> */}
            </div>
            <div className="flex items-center mt-4 lg:my-3">
              <h5 className="font-bold mr-2 lg:my-3">Already Registered?</h5>
              <a href="/" className="text-sm font-bold text-[#300EFF] lg:my-3">
                Login
              </a>
            </div>
            <p className="text-sm mt-2 lg:my-3">
              Loreum ipsum is simply dummy text of the printing
            </p>
          </div>
        </div>
      </form>
      <PopUp
        open={open}
        setOpen={setOpen}
        text={"Email Already Exists Please login"}
        handleClose={handleClose}
      />
    </>
  );
};

export default SignUp;
