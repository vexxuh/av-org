"use client";

import React, { useEffect } from "react";

// Next
import Link from "next/link";

// React Icons
import { FaGears } from "react-icons/fa6";

// Clerk
import { useSignUp, SignUp } from "@clerk/nextjs";

const Signup: React.FC = () => {
  const { isLoaded } = useSignUp();

  useEffect(() => {
    document.title = "Login | AV Gear";
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <main className="w-screen min-h-screen bg-gray-100 login-container h-full overflow-hidden">
      <div className="flex w-screen h-full">
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
              <p>Already have an account?</p>
              <Link href="/login">
                <p className="text-green-500 hover:underline">Login!</p>
              </Link>
            </div>
          </header>

          <article className="flex flex-col gap-10 items-center justify-center">
            <div className="flex items-center justify-center flex-col gap-2">
              <h1 className="text-3xl font-semibold font-poppins leading-10 text-center">
                Get Started With AV Gear
              </h1>
            </div>

            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary: "bg-green-600",
                  formButtonSecondary: "bg-white",
                  formButtonSecondaryText: "text-black",
                  formButtonPrimaryText: "text-white",
                  footer: "hidden",
                },
              }}
            />

            <p className="text-zinc-600 text-sm font-light font-poppins">
              By continuing you indicate that you read and agreed to the Terms
              of Use
            </p>
          </article>
        </section>
      </div>
    </main>
  );
};

export default Signup;
