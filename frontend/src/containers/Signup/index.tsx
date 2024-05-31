"use client";

import React, { useState } from "react";

// Next
import Image from "next/image";
import Link from "next/link";

// React Hook Form
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// React Icons
import { FaGears } from "react-icons/fa6";

// React Hot Toast
import { Toaster, toast } from "react-hot-toast";

// Clerk
import { useSignUp, SignUp } from "@clerk/nextjs";

// Components
import { FacebookIcon, GoogleIcon } from "@/components/icons";
import Input from "@/components/FormElements/Input/UncontrolledInput";
import Button from "@/components/common/Button";

// Schema
import signupSchema from "./schema";
import { useRouter } from "next/navigation";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

const SignupContainer = () => {
  const { signUp, isLoaded } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: yupResolver(signupSchema),
  });

  const { push } = useRouter();

  const {
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await signUp?.create({
        emailAddress: values.email,
        password: values.password,
      });

      toast.success("Account created successfully");

      push("/login");
    } catch (err) {
      console.log("err", err);
      toast.error("An error occurred, please try again");
    }
    setIsLoading(false);
  };

  return (
    <main className="w-screen min-h-screen bg-gray-100 login-container h-full overflow-hidden">
      <Toaster />
      <div className="flex w-screen h-full">
        {/* Design Section */}
        {/* <section className="relative none hidden lg:block lg:w-1/2 max-h-screen">
          <img
            src="/images/login/cover-image.png"
            alt="Cover Image"
            className="w-full object-cover"
          />
        </section> */}

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
              {/* <h6 className="text-md font-normal font-poppins leading-7 text-[#7E7E7E]">
                Create your Account
              </h6> */}
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
              signInUrl="/login"
              forceRedirectUrl="/login"
              signInForceRedirectUrl="/login"
            />

            {/* <div className="flex items-center gap-4">
              <button className="w-32 h-11 bg-white rounded border border-neutral-200 hover:border-green-500 hover:shadow-md cursor-pointer flex items-center justify-center gap-3 ease-in-out duration-300 transition-all">
                <span>
                  <GoogleIcon />
                </span>
                <p className="text-black text-xs font-semibold font-poppins leading-10">
                  Google
                </p>
              </button>
              <button className="w-32 h-11 bg-white rounded border border-neutral-200 hover:border-green-500 hover:shadow-md cursor-pointer flex items-center justify-center gap-3 ease-in-out duration-300 transition-all">
                <span>
                  <FacebookIcon />
                </span>
                <p className="text-black text-xs font-semibold font-poppins leading-10">
                  Facebook
                </p>
              </button>
            </div> */}
            {/* 
            <div className="flex items-center gap-3">
              <hr className="bg-[#dbdbdb] border-none h-[1px] w-[140px]" />
              <p className="text-black text-xs font-medium font-poppins leading-none whitespace-nowrap">
                Or continue with
              </p>
              <hr className="bg-[#dbdbdb] border-none h-[1px] w-[140px]" />
            </div> */}

            {/* <FormProvider {...form}>
              <form
                className="max-w-[400px] w-full"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex gap-2">
                  <div>
                    <Input
                      id="firstName"
                      placeholder="First Name"
                      type="text"
                      required
                      disabled={isLoading}
                      mb={21}
                      error={errors?.firstName?.message}
                    />
                  </div>
                  <div>
                    <Input
                      id="lastName"
                      placeholder="Last Name"
                      type="text"
                      required
                      disabled={isLoading}
                      mb={21}
                      error={errors?.lastName?.message}
                    />
                  </div>
                </div>
                <div>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    required
                    disabled={isLoading}
                    mb={21}
                    error={errors?.email?.message}
                  />
                </div>
                <div>
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    required
                    mb={21}
                    disabled={isLoading}
                    error={errors?.password?.message}
                  />
                </div>
                <div>
                  <Input
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"
                    required
                    mb={21}
                    disabled={isLoading}
                    error={errors?.confirmPassword?.message}
                  />
                </div>

                <Button
                  type="submit"
                  size="md"
                  variant="grey"
                  disabled={false}
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              </form>
            </FormProvider> */}

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

export default SignupContainer;
