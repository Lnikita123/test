import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import CircularIndeterminate from "./loadingButton";
const LoginForm = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const [showProgress, setShowProgress] = useState(false);
  const handleSubmit = async (e: any) => {
    setShowProgress(true);
    e.preventDefault();
    Cookies.set("loggedin", "true");
    try {

      const response = await fetch("https://staging.api.playalvis.com/v1/login", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),

      });

      const res = await response.json();
      console.log("res", res);
      if (res.status) {
        localStorage.setItem("token", res.token);
        setShowProgress(false);
        if (localStorage.getItem("token")) {
          router.push("/auth/courses");
        } else {
          alert("You need to log in to access the unit page.");
        }
      } else {
        alert("error, try again");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="flex flex-row justify-justify-between m-5 ">
        <div className="overflow-y-hidden bg-gradient-to-b from-blue-500 to-blue-300 md:w-1/2 xl:w-1/3 h-[calc(100vh-36px)] rounded-xl ">
          <div className="m-8">
            <div className="flex">
              <Image src="/alvis.svg" alt="logo" width={60} height={80} />
              <Image src="/alvisText.svg" alt="text" width={100} height={100} />
            </div>
            <h2 className="xl:my-[5rem] md:my-[2rem] text-3xl font-bold mb-2 text-white">
              Start creating with us.
            </h2>
            <p className="text-white text-xl md:my-2 xl:my-4">
              Let's be the architects of tomorrow, shaping the world through the
              education we impart today.
            </p>
            <div className="my-[3rem]">
              <Image
                src="/Artboard.svg"
                alt="logo"
                width={100}
                height={100}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="m-auto">
          <div className="mx-auto text-center flex flex-col items-between justify-center">
            <h2 className="py-4 text-2xl font-bold text-slate-950">Login</h2>
            <div className="mb-4">
              <h5 className="inline-block font-bold">
                Already have an account?
              </h5>
              <a
                href="#"
                className="inline-block ml-2 text-sm font-bold text-[#300EFF]"
              >
                Sign Up
              </a>
            </div>
          </div>
          <div>
            <label className="m-7 mx-8 block">
              <h5 className="font-bold mb -10 text-xl mb-3"> Email </h5>
              <input
                type="text"
                value={login.email}
                onChange={(e) => setLogin({ ...login, email: e.target.value })}
                placeholder="Enter email address"
                className=" p-3 border border-[#50BAFF] rounded-full w-[40rem]"
              />
            </label>
            <label className="m-7 mx-8 block">
              <h5 className="font-bold text-xl mb-3"> Password </h5>
              <input
                type="password"
                value={login.password}
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
                placeholder="Enter Password"
                className=" p-3  border border-[#50BAFF] rounded-full w-[40rem]"
              />
            </label>
          </div>
          <div className="flex">
            <button className="bg-[#03A9F4] text-white rounded-full py-2 px-4 font-bold m-44 mb-300 mx-8 my-4">
              Continue
            </button>
            <div className="my-4">
              {showProgress && <CircularIndeterminate />}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
