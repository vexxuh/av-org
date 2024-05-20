"use client";

import React, { useState } from "react";

// Next
import Link from "next/link";

// React Icons
import { FaGears } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";

// Components
import Input from "@/components/FormElements/Input/ControlledInput";
import { FaSearch } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <section className="flex items-center justify-center">
      <div className="max-w-[1900px] w-full mx-auto flex items-center justify-between px-5 py-7">
        <article className="flex items-center gap-2 ">
          <div className="flex items-center gap-3">
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

            <hr className="w-8 h-[0.5px] border-none bg-gray-500 rotate-90" />
          </div>

          <div className="max-w-96 w-full">
            <Input
              id="search"
              onChange={handleChange}
              placeholder="Search"
              icon={<FaSearch />}
              mb={0}
            />
          </div>
        </article>

        <article className="flex items-center gap-2">
          <span className="text-gray-600 cursor-pointer">
            <MdAccountCircle fontSize={32} />
          </span>
        </article>
      </div>
    </section>
  );
};

export default Navbar;
