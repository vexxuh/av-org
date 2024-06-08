"use client";

import React, { useEffect, useState } from "react";

// Next
import Link from "next/link";

// Toast
import { Toaster, toast } from "react-hot-toast";
import { SignIn, useSignIn } from "@clerk/nextjs";

// React Icons
import { FaGears } from "react-icons/fa6";

const Login: React.FC = () => {
  const { isLoaded } = useSignIn();
  const [clerkLoaded, setClerkLoaded] = useState(false);

  useEffect(() => {
    document.title = "Login | AV Gear";

    const checkClerkLoaded = () => {
      const clerkRootBox = document.querySelector(".cl-rootBox");
      if (clerkRootBox) {
        setClerkLoaded(true);
      } else {
        setClerkLoaded(false);
      }
    };

    const intervalId = setInterval(checkClerkLoaded, 50);

    return () => clearInterval(intervalId);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <main className="w-screen min-h-screen bg-gray-100 login-container h-full">
      <Toaster />

      <div className="flex items-center justify-center w-screen h-full z-10 relative">
        {/* Form Section */}
        <section className="pt-10 px-14 w-full flex flex-col gap-28">
          <header className="flex items-center justify-between flex-col sm:flex-row">
            <div>
              <Link href="/">
                <h1 className="text-2xl font-bold text-green-500 flex items-center gap-2">
                  AV{" "}
                  <span className="text-gray-600 flex items-center gap-2">
                    Gear
                  </span>
                  <i>
                    <FaGears />
                  </i>
                </h1>
              </Link>
            </div>

            <div className="font-poppins text-sm font-medium flex items-center gap-1 whitespace-nowrap">
              <p>Don&apos;t have an account?</p>
              <Link href="/signup">
                <p className="text-green-500 hover:underline">Sign up!</p>
              </Link>
            </div>
          </header>

          <article className="flex flex-col gap-10 items-center justify-center h-full">
            <div className="flex items-center justify-center flex-col gap-2">
              <h1 className="text-4xl font-semibold font-poppins leading-10">
                Welcome Back
              </h1>
              <h6 className="text-lg font-normal font-poppins leading-7">
                Login into your account
              </h6>
            </div>

            {!clerkLoaded && (
              <p className="text-xl text-gray-500">Loading...</p>
            )}

            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: "bg-green-600",
                  formButtonPrimary__loading: "bg-green-700",
                  formButtonPrimary__error: "bg-red-600",
                  footer: "hidden",
                },
              }}
              forceRedirectUrl={"/dashboard"}
            />
          </article>
        </section>
      </div>
    </main>
  );
};

export default Login;
