import React from "react";

// Next
import { Metadata } from "next";

// Containers
import LoginContainer from "@/containers/Login";

export const metadata: Metadata = {
  title: "AV Gear - Login",
  description: "Inventory-like System",
};

const Login: React.FC = () => {
  return <LoginContainer />;
};

export default Login;
