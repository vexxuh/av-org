import React from "react";
import LoaderComponent from "../LoaderComponent";

const PageLoader: React.FC = () => {
  return (
    <section className="fixed flex items-center justify-center w-full h-screen z-[99] top-0 bg-[rgba(0,0,0,0.1)]">
      <LoaderComponent />
    </section>
  );
};

export default PageLoader;
