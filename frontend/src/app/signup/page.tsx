import React from "react";

// Next
import { Metadata } from "next";

// Containers
import SignupContainer from "@/containers/Signup";

export const metadata: Metadata = {
  title: "AV Gear - Signup",
  description: "Inventory-like System",
};

const Signup: React.FC = () => {
  return <SignupContainer />;
};

export default Signup;
