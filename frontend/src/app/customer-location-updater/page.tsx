"use client";

import React from "react";

// Components
import Layout from "@/components/common/Layout";

// Containers
import CLUpdaterContainer from "@/containers/CustomerLocationUpdater/Container";

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col bg-gray-200">
      <Layout>
        <CLUpdaterContainer />
      </Layout>
    </main>
  );
};

export default Page;
