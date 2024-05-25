"use client";

import React from "react";

// Next
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";

// Components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";

const ItemDetailContainer: React.FC = () => {
  return (
    <section className="flex items-center justify-center">
      <div className="max-w-[1900px] w-full mx-auto flex flex-col justify-between px-5 py-7 gap-10">
        {/* <Breadcrumb className="md:w-full ml-5 print:hidden m-auto">
          <BreadcrumbList className="text-gray-400 ">
            <BreadcrumbItem className="hover:text-gray-700 transition-colors duration-200 cursor-pointer">
              <Link href="/">
                <BreadcrumbPage>Home</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem className="transition-colors duration-200">
              <BreadcrumbPage>1</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}

        <article className="max-w-xs w-full">
          <div className="flex items-center gap-2">
            <Link href="/detailed-add">
              <Button size="md" variant="grey">
                Add
              </Button>
            </Link>

            <Link href="/devices/edit">
              <Button variant="black" size="md">
                Edit
              </Button>
            </Link>

            <Button onClick={() => redirect("/")} size="md" variant="red">
              Delete
            </Button>
          </div>
        </article>

        <article className="border-2 border-gray-300 rounded-md p-5 bg-white shadow-lg">
          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">ID</h4>
            <p>11132132-132312-312132</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Manufacturer</h4>
            <p>Apple</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Model</h4>
            <p>MacBook Pro</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Serial Number</h4>
            <p>123123123123</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Type</h4>
            <p>Laptop</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Status</h4>
            <p>Active</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Location</h4>
            <p>San Francisco</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Assigned To</h4>
            <p>John Doe</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Notes</h4>
            <p>Some notes about this item</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Created At</h4>
            <p>12/12/2021</p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ItemDetailContainer;
