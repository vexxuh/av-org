"use client";

import React, { useState } from "react";

// Next
import { useRouter } from "next/navigation";
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
import axios from "axios";
import { Paths } from "@/utils/config/paths";
import toast, { Toaster } from "react-hot-toast";

type ItemDetailContainerProps = {
  data: any;
};

const ItemDetailContainer: React.FC<ItemDetailContainerProps> = ({ data }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const { push } = useRouter();

  const handleItemDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.GEAR_ITEM}/${data?.id}`
      );

      toast.success("Item deleted successfully!");

      push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete item!");
    }
    setIsDeleting(false);
  };

  return (
    <section className="flex items-center justify-center">
      <Toaster />
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
              <Button size="md" variant="grey" disabled={isDeleting}>
                Add
              </Button>
            </Link>

            <Link href="/devices/edit">
              <Button variant="black" size="md" disabled={isDeleting}>
                Edit
              </Button>
            </Link>

            <Button
              onClick={handleItemDelete}
              size="md"
              variant="red"
              disabled={isDeleting}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </article>

        <article className="border-2 border-gray-300 rounded-md p-5 bg-white shadow-lg">
          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">ID</h4>
            <p>{data?.id}</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Manufacturer</h4>
            <p>{data?.manufacturer}</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Model</h4>
            <p>{data?.device_model}</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Serial Number</h4>
            <p>{data?.serial_number}</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Hostname</h4>
            <p>{data?.hostname}</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Firmware</h4>
            <p>{data?.firmware}</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Password</h4>
            <p>{data?.password}</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Primary IP</h4>
            <p>{data?.primary_ip}</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Primary MAC</h4>
            <p>{data?.primary_mac}</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Secondary IP</h4>
            <p>{data?.secondary_ip}</p>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-lg font-medium">Secondary MAC</h4>
            <p>{data?.secondary_mac}</p>
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
