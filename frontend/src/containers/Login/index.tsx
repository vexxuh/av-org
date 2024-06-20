"use client";

import React, { useState } from "react";

// React Hook Form
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Next
import { useRouter } from "next/navigation";
import Link from "next/link";

// Toast
import { Toaster, toast } from "react-hot-toast";

// React Icons
import { FaGears } from "react-icons/fa6";

// Components
import { FacebookIcon, GoogleIcon } from "@/components/icons";
import Input from "@/components/FormElements/Input/UncontrolledInput";
import CheckboxSwitch from "@/components/FormElements/Switch";
import Button from "@/components/common/Button";

// Schema
import loginSchema from "./schema";
import { useSignIn, useUser } from "@clerk/nextjs";

// Utils

type FormValues = {
  email: string;
  password: string;
};

const LoginContainer = () => {
  const [remember, SetRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useSignIn();
  const { user, isSignedIn } = useUser();

  const { push } = useRouter();

  const form = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
  });

  const {
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await signIn?.create({
        identifier: values.email,
        password: values.password,
        token: remember ? "long" : "short",
        redirectUrl: "/dashboard",
      });

      push("/dashboard");
    } catch (error) {
      console.error(error);
      form.setError("email", {
        type: "manual",
        message: "Invalid email or password",
      });

      form.setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });

      toast.error("Invalid email or password");
    }

    setIsLoading(false);
  };

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
            </div>

            <div className="flex items-center gap-3">
              <hr className="bg-[#dbdbdb] border-none h-[1px] w-[140px]" />
              <p className="text-black text-xs font-medium font-poppins leading-none whitespace-nowrap">
                Or continue with
              </p>
              <hr className="bg-[#dbdbdb] border-none h-[1px] w-[140px]" />
            </div> */}

            <FormProvider {...form}>
              <form
                className="max-w-[400px] w-full"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    required
                    mb={21}
                    error={errors?.email?.message}
                    disabled={isLoading}
                  />
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
                <div className="flex items-center justify-between mb-9">
                  <div className="flex items-center gap-2">
                    <CheckboxSwitch
                      id="remember-me"
                      checked={remember}
                      checkedChanged={() => SetRemember(!remember)}
                    />
                    <p className="text-zinc-900 text-xs font-medium font-poppins leading-tight tracking-tight">
                      Remember me
                    </p>
                  </div>

                  <Link href="/reset-password">
                    <p className="text-red-600 text-sm font-light font-poppins leading-none hover:underline">
                      Recover Password
                    </p>
                  </Link>
                </div>

                <Button
                  type="submit"
                  size="md"
                  variant="grey"
                  isLoading={isLoading}
                >
                  Log In
                </Button>
              </form>
            </FormProvider>
          </article>
        </section>
        {/* Design Section */}
        {/* <section className="relative none hidden lg:block lg:w-1/2 max-h-screen">
          <div className="w-[453px] h-[453px] bg-green-500 bg-opacity-40 rounded-full blur-[50px] absolute -bottom-10 -left-[200px] -z-10"></div>
          <img
            src="/images/login/cover-image.png"
            alt="Cover Image"
            className="w-full object-contain"
          />
        </section> */}
      </div>
    </main>
  );
};

export default LoginContainer;
