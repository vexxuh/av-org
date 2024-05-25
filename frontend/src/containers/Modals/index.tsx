"use client";

import React from "react";

// Next
import { useSearchParams } from "next/navigation";

// Components
import QuickAddModal from "./QuickAdd";

const Modals = () => {
  const searchParams = useSearchParams();

  return <>{searchParams.get("modal") === "quick-add" && <QuickAddModal />}</>;
};

export default Modals;
