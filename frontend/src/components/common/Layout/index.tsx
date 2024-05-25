import React from "react";

// Components
import Navbar from "../Navbar";

interface LayoutProps {
  children: React.ReactNode;
  navListingOptions?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  navListingOptions = false,
}) => {
  return (
    <main className="overflow-x-hidden min-h-[calc(100vh - 80px)]">
      <Navbar listingOptions={navListingOptions} />
      {children}
    </main>
  );
};

export default Layout;
