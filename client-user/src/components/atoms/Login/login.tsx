import React, { useState } from "react";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import LogoText from "../logoText/LogoText";
import MiniLogoText from "../miniLogoText/MiniLogoText";
import { auth } from "@/helpers/FirebaseConfig";
import { API_BASE_URL } from "@/config";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import PopUp from "@/components/molecules/signup/popUp";
import useStudent from "@/store/useStudent";
const provider = new GoogleAuthProvider();

const Login = () => {
  const router = useRouter();
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  const setEmail = useStudent((s) => s.setEmail);
  const setName = useStudent((s) => s.setName);
  const [open, setOpen] = useState(false);

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then(async (result: any) => {
        // Handle successful sign-in
        const user: any = result.user;
        console.log("User:", user.email);
        Cookies.set("loggedin", "true");
        setEmail(user?.email);
        setName(user?.email.split("@")[0]);
        await onClickContinue(user?.email);
      })
      .catch((error: any) => {
        // Handle sign-in error
        console.log("Error:", error);
      });
  };
  //login post api
  async function onClickContinue(email: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/students/login`, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: email }),
      });
      const data = await response.json();
      console.log("dataa", data);
      if (data?.msg?.includes("Credentials are not correct")) {
        setOpen(true);
      }
      localStorage.setItem("studentId", JSON.stringify(data.id));
      if (response.ok) {
        router.push(`/auth?email=${encodeURIComponent(email)}`);
      }
      if (!response.ok) {
        throw new Error(data.message || "Check your credentials");
      }
    } catch (err: any) {
      console.error(err);
    }
  }
  const handleClose = () => {
    // Update the state in the parent component
    setOpen(false);
  };
  return (
    <>
      <div className="flex md:flex-row justify-around">
        <div className="h-screen">
          <img
            src="/loginImage.svg"
            alt="logo"
            className="h-full w-full 2xl:w-11/12 ml-5"
          />
        </div>
        <div className="flex flex-col justify-center items-center align-center md:w-1/2 my-2">
          <div className="items-center justify-center">
            <LogoText />
          </div>
          <div className="flex flex-row md:mt-5 2xl:mt-10">
            <MiniLogoText />
          </div>
          {/* <input
            type="text"
            placeholder="Enter Email"
            className="p-3 border border-[#757575] rounded-full md:mt-5 md:w-[25rem] 2xl:w-[30rem] 2xl:mt-10 2xl:ml-10"
          />

          <input
            type="text"
            placeholder="Enter Password"
            className="p-3 border border-[#757575] rounded-full md:mt-5 md:w-[25rem] 2xl:w-[30rem] 2xl:mt-10 2xl:ml-10"
          />
          <button className="bg-[#505DAA] text-white rounded-full py-2 px-4 font-bold md:mt-5 md:w-[25rem] 2xl:w-[30rem] 2xl:mt-10 2xl:ml-10">
            Continue
          </button> */}
          <p className="text-base font-bold lg:my-5">Login with</p>
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
          <div className="flex items-center">
            <h5 className="font-bold mr-2 md:mt-5 lg:my-3">
              Don't have Registered account?
            </h5>
            <a
              href="/signup"
              className="md:mt-5 text-sm font-bold text-[#300EFF] lg:my-3"
            >
              SignUp
            </a>
          </div>
          <p className="text-sm mt-2 lg:my-3">
            Boost your skills with unique learning tools.
          </p>
        </div>
      </div>
      <PopUp
        open={open}
        setOpen={setOpen}
        text={"Email does not exist Please SignUp"}
        handleClose={handleClose}
      />
    </>
  );
};

export default Login;
