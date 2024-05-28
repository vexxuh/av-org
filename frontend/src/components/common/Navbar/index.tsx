"use client";

import React, { useState } from "react";

// Next
import Link from "next/link";

// React Icons
import { FaGears } from "react-icons/fa6";
import { MdAccountCircle, MdDynamicForm } from "react-icons/md";
import { LogOut, User } from "lucide-react";

// Components
import Input from "@/components/FormElements/Input/ControlledInput";
import { FaSearch } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/FormElements/DropdownMenu";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/FormElements/Select";
import Button from "../Button";
import { IoIosArrowDown } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { SlEnergy } from "react-icons/sl";
import { RiSoundModuleFill } from "react-icons/ri";

type NavbarProps = {
  listingOptions?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ listingOptions = false }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <section className="flex items-center justify-center border-b-[1px] border-gray-300">
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
          </div>

          {listingOptions && (
            <div className="flex items-center gap-3">
              <hr className="w-10 h-[0.5px] border-none bg-gray-500 rotate-90" />
              <div className="max-w-96 w-full">
                <Input
                  id="search"
                  onChange={handleChange}
                  placeholder="Search"
                  icon={<FaSearch />}
                  mb={0}
                  value={search}
                  className="h-[40px] outline-none"
                />
              </div>

              <div className="rounded-full overflow-hidden w-20">
                <Button variant="grey" className="rounded-full">
                  <div className="rotate-90">
                    <RiSoundModuleFill />
                  </div>
                </Button>
              </div>
            </div>
          )}
        </article>

        <article className="flex items-center gap-4">
          {listingOptions && (
            <div>
              <DropdownMenu
                onOpenChange={(isOpen) => setIsOpen(isOpen)}
                open={isOpen}
              >
                <DropdownMenuTrigger asChild>
                  <span>
                    <Button
                      variant="grey"
                      size="sm"
                      iconEnd={<IoIosArrowDown />}
                      iconStart={<LuPlus />}
                      className="rounded-full"
                    >
                      Add
                    </Button>
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className={`bg-white shadow-lg rounded-lg mt-1 w-32 flex gap-2 flex-col overflow-hidden ${
                    isOpen ? "visible" : "hidden"
                  }`}
                >
                  <DropdownMenuItem className="hover:bg-gray-300 cursor-pointer px-3 py-1 outline-none border-none">
                    <Link
                      href="/?modal=quick-add"
                      className="flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <SlEnergy className="h-4 w-4" />
                      <span>Quick</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-300 cursor-pointer px-3 py-1 outline-none border-none">
                    <Link
                      href="/detailed-add"
                      className="flex items-center gap-2"
                    >
                      <MdDynamicForm className="h-4 w-4" />
                      <span>Detailed</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="text-gray-600 cursor-pointer flex items-center justify-center">
                <MdAccountCircle fontSize={40} />
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white shadow-lg rounded-lg mt-1 w-32 flex gap-2 flex-col overflow-hidden">
              <DropdownMenuItem className="hover:bg-gray-300 cursor-pointer px-3 py-1 outline-none border-none flex items-center gap-2">
                <User className=" h-4 w-4" />

                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-300 cursor-pointer px-3 py-1 outline-none border-none flex items-center gap-2">
                <LogOut className=" h-4 w-4" />

                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </article>
      </div>
    </section>
  );
};

export default Navbar;
